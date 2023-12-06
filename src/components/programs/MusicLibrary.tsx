import useStore from '@/hooks/useStore'
import React, { useEffect, useState } from 'react'
import CustomText from '../atoms/CustomText'
import { Button, Loader, Menu, Progress, Slider, TextInput, Tooltip } from '@mantine/core'
import { truncateText } from '@/utils/text'
import useFS from '@/hooks/useFS'
import { ApiError } from 'browserfs/dist/node/core/api_error'
import { Dropzone } from '@mantine/dropzone'
import Image from 'next/image'
import { addTypeToBase64, getExtension, removeTypeFromBase64, toBase64, wait } from '@/utils/file'
import { secondsToMinutes } from '@/utils/date'

const MusicLibrary = () => {

  const basePath = '/ProgramFiles/MusicLibrary'

  type MusicItemProps = {
    title: string,
    artist: string,
    filePath: string,
    imgPath?: string,
    image64?: string,
    file64?: string,
  }

  type PlaylistItemProps = {
    title: string,
    description: string,
    imgPath: string,
    image64?: string,
    musics?: MusicItemProps[],
  }


  const { states, dispatch } = useStore()
  const { fs } = useFS()

  // UI States
  const [isNewPlaylistItemOpen, setIsNewPlaylistItemOpen] = useState(false)
  const [isNewMusicItemOpen, setIsNewMusicItemOpen] = useState(false)
  const [isEditingPlaylistItemOpen, setIsEditingPlaylistItemOpen] = useState(false)
  const [isDeletePlaylistItemOpen, setIsDeletePlaylistItemOpen] = useState(false)

  // Playlist Infos
  const [playlistItems, setPlaylistItems] = useState<PlaylistItemProps[]>([])
  const [musicItems, setMusicItems] = useState<MusicItemProps[]>([])
  const [currentPlaylistItem, setCurrentPlaylistItem] = useState<PlaylistItemProps>()
  

  // New Playlist Infos
  const [newPlaylistItemTitle, setNewPlaylistItemTitle] = useState('')
  const [newPlaylistImageFile, setNewPlaylistImageFile] = useState<File>()

  // Edit Playlist Infos
  const [editingPlaylistId, setEditingPlaylistId] = useState<number | null>(null)
  const [editPlaylistItemTitle, setEditPlaylistItemTitle] = useState('')
  const [editPlaylistItemDescription, setEditPlaylistItemDescription] = useState('')


  // New Music Infos
  const [newMusicItemTitle, setNewMusicItemTitle] = useState('')
  const [newMusicItemArtist, setNewMusicItemArtist] = useState('')
  const [newMusicItemImgFile, setNewMusicItemImgFile] = useState<File>()
  const [newMusicItemFile, setNewMusicItemFile] = useState<File>()

  // Music Infos
  const [musics, setMusics] = React.useState<MusicItemProps[]>([])
  const [musicSelected, setMusicSelected] = React.useState<MusicItemProps | null>(null)
  const [isMusicPlaying, setIsMusicPlaying] = useState(false)
  const [isMusicPaused, setIsMusicPaused] = useState(true)
  const [musicDuration, setMusicDuration] = useState(0)
  const [musicCurrentTime, setMusicCurrentTime] = useState(0)
  const [musicProgress, setMusicProgress] = useState(0)
  const [musicVolume, setMusicVolume] = useState(1)
  const [currentMusicIndex, setCurrentMusicIndex] = useState(0)
  const [audioElement, setAudioElement] = React.useState<HTMLAudioElement | null>(null)
  

  // Utils
  const [searchText, setSearchText] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // START Music Methods
  const handleTogglePause = () => {
    if (audioElement) {
      if (!isMusicPaused) {
        audioElement.pause()
        setIsMusicPaused(true)
      } else {
        audioElement.play()
        setIsMusicPaused(false)
      }
    }
  }
  const handlerPlayMusic = (music: MusicItemProps) => {
    if (audioElement) {
      audioElement.pause();
    }
  
    setMusicSelected(music);
    const newAudioElement = new Audio(music.file64);
  
    newAudioElement.addEventListener('loadeddata', (e) => {
      setMusicDuration(newAudioElement.duration || 0);
      setIsMusicPlaying(true);
      setIsMusicPaused(false);
      newAudioElement.play();
    });
    
    newAudioElement.addEventListener('pause',(e) => {
      setIsMusicPaused(true);
    })
    
    newAudioElement.addEventListener('play',(e) => {
      setIsMusicPaused(false);
    })

    newAudioElement.addEventListener('timeupdate', (e) => {
      setMusicCurrentTime(newAudioElement.currentTime || 0);
      setMusicProgress((newAudioElement.currentTime || 0) / (newAudioElement.duration || 0) * 100);
    });
  
    newAudioElement.addEventListener('ended', handleMusicEnded);
  
    newAudioElement.addEventListener('error', (e) => {
      console.log(e);
    });
  
    setAudioElement(newAudioElement);
  };
  
  const handleMusicEnded = async () => {
    if (!musicEndedHandled) {
      console.log("end");
      setMusicEndedHandled(true);
      handleTogglePause();
      await wait(1000);
      handleNextMusic();
    }
  };
  
  const [musicEndedHandled, setMusicEndedHandled] = useState(false);

  const handleNextMusic = () => {
    setAudioElement((audio) => {
      if (audio) {
        audio.pause()
      }
      return audio
    })

    if (currentMusicIndex === musics.length - 1) {
      setCurrentMusicIndex(0)
      handlerPlayMusic(musics[0])
    } else {
      setCurrentMusicIndex(currentMusicIndex + 1)
      handlerPlayMusic(musics[currentMusicIndex + 1])
    }

  }

  const handlePreviousMusic = () => {
    setAudioElement((audio) => {
      if (audio) {
        audio.currentTime = 0
        audio.pause()
      }
      return audio
    })

    if (currentMusicIndex === 0) {
      setCurrentMusicIndex(musics.length - 1)
      handlerPlayMusic(musics[musics.length - 1])
    } else {
      setCurrentMusicIndex(currentMusicIndex - 1)
      handlerPlayMusic(musics[currentMusicIndex - 1])
    }
  }

  useEffect(() => {
    setAudioElement((audio) => {
      if (audio) {
        audio.volume = musicVolume * states.System.globalVolumeMultiplier
      }
      return audio
    })
  },[states.System.globalVolumeMultiplier,musicVolume])

  useEffect(() => {
    setMusics(musicItems)
  }, [musicItems])

  // END Music Methods


  const loadPlaylistItems = () => {
    setPlaylistItems([])
    fs?.readdir(basePath, (err, playListsFolder) => {
      if (err) {
        if (err.code === 'ENOENT') {
          fs?.mkdir(basePath, (err: ApiError) => {
            if (err) console.log(err)
            console.log('created')
          })
        }
      }
      if (playListsFolder) {
        playListsFolder?.map((playListFolder) => {
          fs?.readFile(`/${basePath}/${playListFolder}/about.json`, 'utf-8', (err, data) => {
            if (err) console.log(err)
            if (!data) return
            const aboutJson = JSON.parse(data || '{}')


            fs?.readFile(aboutJson.imgPath, 'utf-8', (err, dataImage) => {
              const _about = {
                title: aboutJson.title,
                description: aboutJson.description,
                imgPath: aboutJson.imgPath,
                musics: aboutJson?.musics || '',
                image64: addTypeToBase64(getExtension(aboutJson.imgPath), dataImage || ''),
              }

              setPlaylistItems(prev => [...prev, _about])

            })
          })
        })
      }
    })
  }

  useEffect(() => {
    if (playlistItems.length > 0) {
      setCurrentPlaylistItem(editingPlaylistId === null ? playlistItems[0] : playlistItems[editingPlaylistId])
    }
  }, [playlistItems])

  useEffect(() => {
    if (currentPlaylistItem) {
      setMusicItems([])
      setEditPlaylistItemDescription(currentPlaylistItem?.description || '')
      setEditPlaylistItemTitle(currentPlaylistItem?.title || '')
      if(currentPlaylistItem?.musics?.length === 0) return
      if(currentPlaylistItem?.musics?.length || 0 > 0){
        setCurrentMusicIndex(0)
      }
      LoadMusics()
    }
  }, [currentPlaylistItem])


  const appendMusic = (music: MusicItemProps) => {
    if(musicItems.some(item => item.title === music.title)) return
    setMusicItems(prev => [...prev, music])
  }


  const LoadMusics = () => {
    setMusicItems([])
    if (fs) {
      console.log(currentPlaylistItem?.musics?.length)
      currentPlaylistItem?.musics?.forEach((music) => {
        let _music: MusicItemProps = {} as MusicItemProps
        if (music?.filePath) {
          fs.readFile(music.imgPath || '', 'utf-8', (err, dataImage) => {
            _music = {
              title: music.title,
              artist: music.artist,
              filePath: music.filePath,
              imgPath: music.imgPath,
              image64: addTypeToBase64(getExtension(music.imgPath || ''), dataImage || ''),
            }
            fs?.readFile(music.filePath || '', 'utf-8', (err, dataFile) => {
              _music = {
                ..._music,
                file64: addTypeToBase64(getExtension(music.filePath || ''), dataFile || ''),
              }
              appendMusic(_music)
            })
          })
        }
      })
    } 
  }


  useEffect(() => {
    loadPlaylistItems()
  }, [fs])


  const CreateNewPlaylist = () => {
    const _path = `${basePath}/${newPlaylistItemTitle}`
    fs?.mkdir(_path, (err: ApiError) => {
      if (err) throw err

      if (newPlaylistImageFile) {
        toBase64(newPlaylistImageFile).then((base64) => {
          const newPlaylistProps: PlaylistItemProps = {
            title: newPlaylistItemTitle,
            description: 'Music Playlist',
            imgPath: `${_path}/image.${getExtension(newPlaylistImageFile?.name || '.png')}`,
            musics: [],
          }


          fs.writeFile(`${basePath}/${newPlaylistItemTitle}/image.${getExtension(newPlaylistImageFile?.name || '.png')}`, removeTypeFromBase64(base64 as string), (err) => {
            if (err) throw err
            fs.writeFile(`/${basePath}/${newPlaylistItemTitle}/about.json`, JSON.stringify(newPlaylistProps), (err) => {
              if (err) throw err
              console.log('Successfully created new playlist')
              loadPlaylistItems()
            })
          })


        }).catch((err) => {
          console.log(err)
        })

      } else {
        const newPlaylistProps: PlaylistItemProps = {
          title: newPlaylistItemTitle,
          description: 'Music Playlist',
          imgPath: '',
        }
        fs.writeFile(`${basePath}/${newPlaylistItemTitle}/about.json`, JSON.stringify(newPlaylistProps), (err) => {
          if (err) throw err
          console.log('saved')
          loadPlaylistItems()
        })
      }


    })
  }

  const EditCurrentPlaylist = () => {
    if (fs && editPlaylistItemTitle && editPlaylistItemDescription) {
      fs?.rename(`${basePath}/${currentPlaylistItem?.title}`, `${basePath}/${editPlaylistItemTitle}`, (err) => {
        if (err) throw err
        fs.writeFile(`${basePath}/${editPlaylistItemTitle}/about.json`, JSON.stringify({
          ...currentPlaylistItem,
          title: editPlaylistItemTitle,
          description: editPlaylistItemDescription,
          image64:'',
          imgPath: `${basePath}/${editPlaylistItemTitle}/image.${getExtension(currentPlaylistItem?.imgPath || '.png')}`,
        }), (err) => {
          if (err) throw err
          console.log('Successfully edited playlist')
          setEditingPlaylistId(playlistItems.findIndex(item => item.title === currentPlaylistItem?.title))
          loadPlaylistItems()
        })
      })
      
    }
    
  }

  const RemoveMusicFromPlayList = (musicTitle: string) => {
    setMusicItems([])
    if(fs && currentPlaylistItem?.title) {
      fs.readFile(`${basePath}/${currentPlaylistItem?.title}/about.json`, 'utf-8', (err, data) => {
        if(err) throw err
        const aboutJson = JSON.parse(data || '{}')
        fs.writeFile(`${basePath}/${currentPlaylistItem?.title}/about.json`, JSON.stringify({
          ...aboutJson,
          musics: aboutJson?.musics?.filter((music: MusicItemProps) => music.title !== musicTitle)
        }), (err) => {
          if(err) throw err
          console.log('Item Removed from Playlist')
          setCurrentPlaylistItem({
            ...currentPlaylistItem,
            musics: aboutJson?.musics?.filter((music: MusicItemProps) => music.title !== musicTitle)
          })
        })
      })
    }
  }

  const DeleteCurrentPlayList = () => {
    fs?.readdir(`${basePath}/${currentPlaylistItem?.title}`, (err, files) => {
      if(err) throw err
      files?.forEach((file) => {
        fs?.unlink(`${basePath}/${currentPlaylistItem?.title}/${file}`, (err) => {
          if(err) throw err
        })
      })
      fs?.rmdir(`${basePath}/${currentPlaylistItem?.title}`, (err) => {
        if(err) throw err
        console.log('deleted')
      })
  
    })

    
    setEditingPlaylistId(null)
    loadPlaylistItems()
  }

  const createMusic = () => {
    
    if (fs && newMusicItemFile && newMusicItemImgFile && newMusicItemTitle && newMusicItemArtist) {
      const _path = `${basePath}/Musics/${newMusicItemTitle}`
      const newMusicProps: MusicItemProps = {
        title: newMusicItemTitle,
        artist: newMusicItemArtist,
        imgPath: `${_path}/image.${getExtension(newMusicItemImgFile?.name || '.png')}`,
        filePath: `${_path}/music.${getExtension(newMusicItemFile?.name || '.mp3')}`,
      }
      toBase64(newMusicItemImgFile).then((Imgbase64) => {
        toBase64(newMusicItemFile).then((Filebase64) => {
          fs?.mkdir(`${basePath}/Musics`, (err: ApiError) => {
            if (err) {
              console.log(err)
            }
            fs?.mkdir(_path, (err: ApiError) => {
              if (err) {
                console.log(err)
              }
              fs.writeFile(`${_path}/image.${getExtension(newMusicItemImgFile?.name || '.png')}`, removeTypeFromBase64(Imgbase64 as string), (err) => {
                if (err) {
                  console.log(err)
                  console.log('failed image')
                }
                fs.writeFile(`${_path}/music.${getExtension(newMusicItemFile?.name || '.mp3')}`, removeTypeFromBase64(Filebase64 as string), (err) => {
                  if (err) {
                    console.log(err)
                    console.log('failed music')
                  }
                  fs.writeFile(`${_path}/about.json`, JSON.stringify(newMusicProps), (err) => {
                    if (err) {
                      console.log(err)
                      console.log('failed about')
                    }
                    fs.writeFile(`${basePath}/${currentPlaylistItem?.title}/about.json`, JSON.stringify({
                      ...currentPlaylistItem,
                      image64: '',
                      musics: [...currentPlaylistItem?.musics || [], newMusicProps]
                    }), (err) => {
                      if (err) throw err
                      console.log('Success Saved In Playlist')
                      loadPlaylistItems()
                    })
                  })
                })
              })
            })
    
          })
        })
      })

    }
  }


  const PlayListItem = ({
    title,
    description,
    imgPath,
    musics,
    image64,
  }: PlaylistItemProps) => {




    return (
      <div
        className='w-full h-12  flex my-1 rounded
      justify-center items-center cursor-pointer
      border-b border-white border-opacity-5
      hover:bg-white hover:bg-opacity-10 transition-all duration-300 ease-in-out
      shadow-md drop-shadow-md
      '
        onClick={() => {
          setCurrentPlaylistItem({
            title,
            description,
            imgPath,
            musics,
            image64,
          })
        }}
      >
        <div className='w-12 h-12 rounded-sm flex justify-center items-center overflow-hidden'>
          <Image
            alt={title}
            src={image64 || '/assets/icons/Alaska.png'}
            width={50}
            height={50}
          />
        </div>
        <div className='flex h-full w-[calc(100%-40px)] ml-1'>
          <CustomText
            text={truncateText(title, 36)}
            className='!text-xs !font-semibold'
          />
        </div>
      </div>
    )
  }

  const MusicItem = ({
    title,
    artist,
    imgPath,
    image64,
    filePath,
    file64,

  }: MusicItemProps) => {

    const [isMusicItemMenuOpen, setIsMusicItemMenuOpen] = useState(false)


    return (
      <div
        className='w-52 h-16 flex m-1 rounded shadow-md drop-shadow-md
      hover:bg-white hover:bg-opacity-10 transition-all duration-300 ease-in-out
      cursor-pointer flex-shrink-0
      '
      onClick={() => {
        console.log('clicked')
        setCurrentMusicIndex(musicItems.findIndex(item => item.title === title))
          handlerPlayMusic({
            title,
            artist,
            imgPath,
            image64,
            filePath,
            file64,
          })
      }}
      >
        <div className='w-16 h-full rounded-sm flex justify-center items-center'>
          <Image
            alt={title}
            src={image64 || '/assets/icons/Alaska.png'}
            width={64}
            height={64}
          />
        </div>
        <div className='w-[calc(100%-88px)] h-full flex flex-col justify-start px-1'>
          <CustomText
            text={truncateText(title, 24)}
            className='!text-xs !font-semibold'
          />
          <CustomText
            text={truncateText(artist, 24)}
            className='!text-xs !font-normal'
          />
        </div>
        <Menu>
          <Menu.Target>
            <div className='w-6 h-6 bg-black bg-opacity-10 rounded flex justify-center items-center
              -ml-1 mt-1 hover:bg-opacity-20 transition-all duration-300 ease-in-out
              '>
              <span className='i-mdi-dots-vertical text-2xl cursor-pointer'
                style={{
                  color: states.Settings.settings.system.systemTextColor
                }}
                
              />
            </div>
          </Menu.Target>
          <Menu.Dropdown
            bg={states.Settings.settings.system.systemBackgroundColor}
          >
            <Menu.Item
              bg={states.Settings.settings.system.systemBackgroundColor}
              onClick={() => {
                RemoveMusicFromPlayList(title)
              }}
            >
              <CustomText
                text='Remove'
                className='!text-xs !font-semibold !text-red-500'
              />
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div>
    )
  }

  if(isLoading){
    return (
      <div
      className='absolute w-1/2 h-1/2 top-1/4 left-1/4
    flex flex-col  overflow-hidden
    rounded-lg '
    >
      <div
        className='w-full h-full flex flex-col'
        style={{
          backgroundColor: states.Settings.settings.system.systemBackgroundColor || 'white',
        }}
      >
        <Loader
          color={states.Settings.settings.system.systemHighlightColor || 'cyan'}
        />
      </div>
    </div>
    )
  }

  return (
    <div
      className='absolute w-1/2 h-1/2 top-1/4 left-1/4
    flex flex-col  overflow-hidden
    rounded-lg '
    >
      <div
        className='w-full h-full flex flex-col'
        style={{
          backgroundColor: states.Settings.settings.system.systemBackgroundColor || 'white',
        }}
      >

        <div className='h-[calc(100%-64px)] w-full  flex'>
          <div className='w-1/4 h-full  flex flex-col items-center px-1 pt-1 overflow-y-auto overflow-x-hidden'>
            <div
              className='sticky w-full  
              flex items-center justify-center cursor-pointer
              transition-all duration-300 ease-in-out
              overflow-hidden border-b border-white border-opacity-50
              '
              style={{
                height: isNewPlaylistItemOpen ? '400px' : '32px',
              }}

            >
              {!isNewPlaylistItemOpen ?
                <div
                  className='h-full w-full flex items-center justify-center cursor-pointer'
                  onClick={(e) => {
                    if (isNewPlaylistItemOpen) return
                    setIsNewPlaylistItemOpen(!isNewPlaylistItemOpen)
                  }}
                >
                  <span
                    className='i-mdi-add text-lg mr-0.5'
                    style={{
                      color: states.Settings.settings.system.systemTextColor || 'white',
                    }}
                  />
                  <CustomText
                    text='Add new playlist'
                    className='!text-sm !font-semibold'
                  />
                </div>
                :
                <div className=' w-full flex flex-col items-center mt-10
                '
                  style={{
                    height: isNewPlaylistItemOpen ? '200px' : '0px',
                  }}
                >
                  <Dropzone
                    onDrop={(files) => {
                      setNewPlaylistImageFile(files[0])
                    }}
                    multiple={false}
                    accept={['image/*']}
                    className='h-20 w-20 rounded flex justify-center items-center
                  border border-slate-50 border-opacity-50 border-dashed
                  '>
                    {newPlaylistImageFile ?
                      <Image
                        alt={newPlaylistImageFile?.name || 'image'}
                        src={URL.createObjectURL(newPlaylistImageFile)}
                        width={80}
                        height={80}
                      />
                      :
                      <>
                        <span className='i-mdi-upload text-lg'
                          style={{
                            color: states.Settings.settings.system.systemTextColor
                          }}
                        />
                        <CustomText
                          text='Image'
                          className='!text-xs !font-semibold'
                          style={{
                            color: states.Settings.settings.system.systemTextColor
                          }}
                        />
                      </>
                    }
                  </Dropzone>
                  <TextInput
                    w={'80%'}
                    className='mt-2'
                    placeholder='Title'
                    value={newPlaylistItemTitle}
                    onChange={(e) => {
                      setNewPlaylistItemTitle(e.currentTarget.value)
                    }} />
                  <div className='flex h-16 w-full justify-evenly px-px mt-2'>
                    <Button
                      variant='outline'
                      w={80}
                      color='red'
                      onClick={() => {
                        setIsNewPlaylistItemOpen(false)
                      }}
                    >
                      <CustomText
                        text='Cancel'
                        className='!text-xs !font-semibold'
                        style={{
                          color: 'red'
                        }}
                      />
                    </Button>
                    <Button
                      variant='outline'
                      w={80}
                      color='green'
                      onClick={() => {
                        CreateNewPlaylist()
                        setIsNewPlaylistItemOpen(false)
                      }}
                    >
                      <CustomText
                        text='Save'
                        className='!text-xs !font-semibold'
                        style={{
                          color: 'green'
                        }}
                      />
                    </Button>
                  </div>

                </div>
              }
            </div>
            <div
              className='sticky flex-shrink-0 w-full  flex items-center justify-evenly
            transition-all duration-300 ease-in-out
            '
              style={{
                height: '48px'
              }}
            >
              <TextInput
                placeholder='Search'
                value={searchText}
                onChange={(e) => {
                  setSearchText(e.currentTarget.value)
                }}
                w={'100%'}
                leftSection={<span className='i-mdi-magnify text-lg' />}
              />
            </div>
            <div className='w-full overflow-y-auto h-[calc(100%-64px)] flex flex-col overflow-x-hidden'>
              {
                playlistItems.filter(item => {
                  if (searchText === '') return item
                  if (item.title.toLowerCase().includes(searchText.toLowerCase())) {
                    return item
                  }
                }).map((playlistItem, index) => {
                  return (
                    <PlayListItem {...playlistItem} key={index} />
                  )
                })
              }
            </div>
          </div>
          <div className='w-3/4 h-full  flex flex-col items-center'>
            <div className='w-full h-28 flex items-center justify-between p-2 border-b border-white border-opacity-50'>
              <div className='h-24 w-24 rounded  flex justify-center items-center overflow-hidden'>
                <Image
                  alt={currentPlaylistItem?.title || 'Title'}
                  src={currentPlaylistItem?.image64 || '/assets/icons/Alaska.png'}
                  width={100}
                  height={100}
                />
              </div>
              <div className='w-[calc(100%-144px)] h-full m-1 flex flex-col '>
                <CustomText
                  text={currentPlaylistItem?.title || 'Untitled'}
                  className='!text-lg !font-semibold'
                />
                <CustomText
                  text={currentPlaylistItem?.description || 'No description'}
                  className='!text-sm !font-medium'
                />
              </div>
              <div className='w-12 h-full flex flex-col items-center justify-evenly'>
                <Tooltip
                  label='Add to playlist'
                >
                  <Menu
                    closeOnItemClick={false}
                    onClose={() => {
                      setIsNewMusicItemOpen(false)
                    }}
                    opened={isNewMusicItemOpen}
                    onOpen={() => {
                      setIsNewMusicItemOpen(true)
                    }}
                    position='left'
                    transitionProps={{
                      transition: 'slide-down',
                      duration: 300
                    }}
                    styles={{
                      dropdown: {
                        width: '176px',
                      },
                      item: {
                        padding: 'none',
                        margin: 'none',
                        cursor: 'default',
                      }
                    }}
                  >
                    <Menu.Target>
                      <span
                        className='i-mdi-music-note-add text-2xl cursor-pointer'
                        style={{
                          color: states.Settings.settings.system.systemTextColor
                        }}
                        onClick={() => {
                          setIsNewMusicItemOpen(!isNewMusicItemOpen)
                        }}
                      />
                    </Menu.Target>
                    <Menu.Dropdown
                      bg={states.Settings.settings.system.systemBackgroundColor}

                    >
                      <Menu.Item
                        bg={states.Settings.settings.system.systemBackgroundColor}
                        p={0}
                        m={0}
                        my={2}
                      >
                        <div className='w-44 h-10 flex justify-center items-center'>
                          <Dropzone
                            className='w-28 h-8 rounded-sm flex justify-center items-center
                            border border-slate-50 border-opacity-50 border-dashed 
                            cursor-pointer'
                            onDrop={(files) => {
                              setNewMusicItemFile(files[0])
                            }}
                            accept={['audio/*']}
                            multiple={false}
                          >
                            <span className='i-mdi-upload text-lg -mb-1 -ml-1'
                              style={{
                                color: states.Settings.settings.system.systemTextColor
                              }}
                            />
                            <CustomText
                              text={truncateText(newMusicItemFile?.name || '', 12) || 'Music'}
                              className='!text-xs !font-semibold'
                              style={{
                                color: states.Settings.settings.system.systemTextColor
                              }}
                            />
                          </Dropzone>
                        </div>
                      </Menu.Item>
                      <Menu.Item
                        bg={states.Settings.settings.system.systemBackgroundColor}
                        p={0}
                        m={0}
                        my={2}
                      >
                        <div className='w-44 h-20 flex justify-center items-center'>
                          <Dropzone
                            onDrop={(files) => {
                              setNewMusicItemImgFile(files[0])
                            }}
                            multiple={false}
                            accept={['image/*']}
                            className='h-16 w-16 rounded flex justify-center items-center
                            border border-slate-50 border-opacity-50 border-dashed
                            cursor-pointer
                            '>
                            {newMusicItemImgFile ?
                              <Image
                                alt={newMusicItemImgFile?.name || 'image'}
                                src={URL.createObjectURL(newMusicItemImgFile)}
                                width={64}
                                height={64}
                              />
                              :
                              <>
                                <span className='i-mdi-upload text-lg -mb-1 -ml-1'
                                  style={{
                                    color: states.Settings.settings.system.systemTextColor
                                  }}
                                />
                                <CustomText
                                  text='Cover'
                                  className='!text-xs !font-semibold'
                                  style={{
                                    color: states.Settings.settings.system.systemTextColor
                                  }}
                                />
                              </>
                            }
                          </Dropzone>
                        </div>
                      </Menu.Item>

                      <Menu.Divider />
                      <Menu.Item
                        bg={states.Settings.settings.system.systemBackgroundColor}
                        p={0}
                        m={0}
                        my={2}
                      >
                        <div className='w-44 h-10 flex justify-center items-center -ml-1'>
                          <TextInput
                            placeholder='Music Title'
                            w={'90%'}
                            value={newMusicItemTitle}
                            onChange={(e) => {
                              setNewMusicItemTitle(e.currentTarget.value)
                            }}
                          />
                        </div>
                      </Menu.Item>
                      <Menu.Item
                        bg={states.Settings.settings.system.systemBackgroundColor}
                        p={0}
                        m={0}
                        my={2}
                      >
                        <div className='w-44 h-10 flex justify-center items-center -ml-1'>
                          <TextInput
                            placeholder='Artist'
                            w={'90%'}
                            value={newMusicItemArtist}
                            onChange={(e) => {
                              setNewMusicItemArtist(e.currentTarget.value)
                            }}
                          />
                        </div>
                      </Menu.Item>

                      <Menu.Divider />

                      <Menu.Item
                        bg={states.Settings.settings.system.systemBackgroundColor}
                        p={0}
                        m={0}
                        my={2}
                      >
                        <div className='w-44 h-10 flex justify-evenly items-center -ml-1'>
                          <Button
                            variant='outline'
                            w={78}
                            color='red'
                            onClick={() => {
                              setIsNewMusicItemOpen(false)
                            }}
                          >
                            <CustomText
                              text='Cancel'
                              className='!text-xs !font-semibold'
                              style={{
                                color: 'red'
                              }}
                            />
                          </Button>
                          <Button
                            variant='outline'
                            w={78}
                            color='green'
                            onClick={() => {
                              createMusic()
                              setIsNewMusicItemOpen(false)
                            }}
                          >
                            <CustomText
                              text='Add'
                              className='!text-xs !font-semibold'
                              style={{
                                color: 'green'
                              }}
                            />
                          </Button>
                        </div>
                      </Menu.Item>

                    </Menu.Dropdown>
                  </Menu>

                </Tooltip>
                <Tooltip
                  label='Edit Playlist'
                >
                  <Menu
                    closeOnItemClick={false}
                    onClose={() => {
                      setIsEditingPlaylistItemOpen(false)
                    }}
                    opened={isEditingPlaylistItemOpen}
                    onOpen={() => {
                      setIsEditingPlaylistItemOpen(true)
                    }}
                    position='left'
                    transitionProps={{
                      transition: 'slide-down',
                      duration: 300
                    }}
                    styles={{
                      dropdown: {
                        width: '256px',
                      },
                      item: {
                        padding: 'none',
                        margin: 'none',
                        cursor: 'default',
                      }
                    }}
                  >
                    <Menu.Target>
                      <span
                        className='i-mdi-edit text-2xl cursor-pointer'
                        style={{
                          color: states.Settings.settings.system.systemTextColor
                        }}
                        onClick={() => {
                          setIsEditingPlaylistItemOpen(!isEditingPlaylistItemOpen)

                        }}
                      />
                    </Menu.Target>
                    <Menu.Dropdown
                      bg={states.Settings.settings.system.systemBackgroundColor}

                    >

                      <Menu.Item
                        bg={states.Settings.settings.system.systemBackgroundColor}
                        p={0}
                        m={0}
                        my={2}
                      >
                        <div className='w-64 h-10 flex justify-center items-center -ml-1'>
                          <TextInput
                            placeholder='Playlist Title'
                            w={'90%'}
                            value={editPlaylistItemTitle}
                            onChange={(e) => {
                              setEditPlaylistItemTitle(e.currentTarget.value)
                            }}
                          />
                        </div>
                      </Menu.Item>
                      <Menu.Item
                        bg={states.Settings.settings.system.systemBackgroundColor}
                        p={0}
                        m={0}
                        my={2}
                      >
                        <div className='w-64 h-auto flex justify-center items-center -ml-1'>
                          <textarea
                            placeholder='Description'
                            className='h-20 rounded outline-none resize p-2'
                            style={{
                              width: '90%',
                            }}
                            value={editPlaylistItemDescription}
                            onChange={(e) => {
                              setEditPlaylistItemDescription(e.currentTarget.value)
                            }}
                          />
                        </div>
                      </Menu.Item>

                      <Menu.Divider />

                      <Menu.Item
                        bg={states.Settings.settings.system.systemBackgroundColor}
                        p={0}
                        m={0}
                        my={2}
                      >
                        <div className='w-64 h-10 flex justify-evenly items-center -ml-1'>
                          <Button
                            variant='outline'
                            w={78}
                            color='red'
                            onClick={() => {
                              setIsEditingPlaylistItemOpen(false)
                            }}
                          >
                            <CustomText
                              text='Cancel'
                              className='!text-xs !font-semibold'
                              style={{
                                color: 'red'
                              }}
                            />
                          </Button>
                          <Button
                            variant='outline'
                            w={78}
                            color='green'
                            onClick={() => {
                              EditCurrentPlaylist()
                              setIsEditingPlaylistItemOpen(false)
                            }}
                          >
                            <CustomText
                              text='Save'
                              className='!text-xs !font-semibold'
                              style={{
                                color: 'green'
                              }}
                            />
                          </Button>
                        </div>
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Tooltip>
                <Tooltip
                  label='Delete Playlist'
                >
                  <Menu
                    closeOnItemClick={false}
                    onClose={() => {
                      setIsDeletePlaylistItemOpen(false)
                    }}
                    opened={isDeletePlaylistItemOpen}
                    onOpen={() => {
                      setIsDeletePlaylistItemOpen(true)
                    }}
                    position='left'
                    transitionProps={{
                      transition: 'slide-down',
                      duration: 300
                    }}
                    styles={{
                      dropdown: {
                        width: '256px',
                      },
                      item: {
                        padding: 'none',
                        margin: 'none',
                        cursor: 'default',
                      }
                    }}
                  >
                    <Menu.Target>
                      <span
                        className='i-mdi-delete text-2xl cursor-pointer'
                        style={{
                          color: states.Settings.settings.system.systemTextColor
                        }}
                        onClick={() => {
                          setIsDeletePlaylistItemOpen(!isDeletePlaylistItemOpen)

                        }}
                      />
                    </Menu.Target>
                    <Menu.Dropdown
                      bg={states.Settings.settings.system.systemBackgroundColor}

                    >

                      <Menu.Item
                        bg={states.Settings.settings.system.systemBackgroundColor}
                        p={0}
                        m={0}
                        my={2}
                      >
                        <div className='w-64 p-2 h-auto flex justify-center items-center -ml-1'>
                          <CustomText
                            text='Are you sure you want to delete this playlist?'
                            className='!text-base !font-bold text-center'
                          />
                        </div>
                      </Menu.Item>

                      <Menu.Divider />

                      <Menu.Item
                        bg={states.Settings.settings.system.systemBackgroundColor}
                        p={0}
                        m={0}
                        my={2}
                      >
                        <div className='w-64 h-10 flex justify-evenly items-center -ml-1'>
                          <Button
                            variant='outline'
                            w={100}
                            color='red'
                            onClick={() => {
                              DeleteCurrentPlayList()
                            }}
                          >
                            <CustomText
                              text='Confirm'
                              className='!text-xs !font-semibold'
                              style={{
                                color: 'red'
                              }}
                            />
                          </Button>
                          <Button
                            variant='outline'
                            w={100}
                            color='green'
                            onClick={() => {
                              setIsDeletePlaylistItemOpen(false)
                            }}
                          >
                            <CustomText
                              text='Cancel'
                              className='!text-xs !font-semibold'
                              style={{
                                color: 'green'
                              }}
                            />
                          </Button>
                        </div>
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Tooltip>
              </div>
            </div>
            <div className='w-full h-auto  overflow-y-auto flex justify-start flex-wrap'>
              {/* <MusicItem /> */}
              {
                musicItems.slice(0,currentPlaylistItem?.musics?.length).map((musicItem, index) => {
                  return (
                    <MusicItem {...musicItem} key={index} />
                  )
                })
              }
            </div>
          </div>
        </div>
        <div className='stick flex h-16 w-full p-1 border-t border-white border-opacity-50'>
          <div className='h-full w-1/4 flex ' >
            <div className='h-14 w-14 flex bg-blue-400 rounded justify-center items-center'>
            {
                musicSelected?.image64 ?
                  <Image
                    src={musicSelected?.image64 || '/assets/icons/Alaska.png'}
                    width={56}
                    height={56}
                    alt='Music Image'
                  />
                  :
                  <span className='i-mdi-music-note text-2xl'
                    style={{
                      color: states.Settings.settings.system.systemTextColor
                    }}
                  />
              }
            </div>
            <div className='h-full w-[calc(100%-56px)] flex flex-col px-1'>
              <CustomText
                text={truncateText(musicSelected?.title || '', 16) || 'Unknown Music'}
                className='!text-sm !font-semibold'
              />
              <CustomText
                text={truncateText(musicSelected?.artist || '', 12) || 'Unknown Artist'}
                className='!text-xs !font-normal -mt-1'
              />
            </div>
          </div>
          <div className='h-full w-2/4 flex flex-col items-center px-1'>
            <div className='h-2/3 w-full flex justify-center items-center'>
              <div className='h-full w-12 mx-0.5 flex justify-center items-center'>
                <span
                  className='i-mdi-skip-previous text-3xl cursor-pointer '
                  style={{
                    color: states.Settings.settings.system.systemTextColor || 'white',
                  }}
                  onClick={handlePreviousMusic}
                />
              </div>
              <div
                className='h-8 w-8 flex justify-center items-center mx-0.5 rounded-full cursor-pointer hover:brightness-150 transition-all duration-300 ease-in-out'
                style={{
                  backgroundColor: states.Settings.settings.system.systemBackgroundColor || 'white',
                }}
                onClick={handleTogglePause}
              >
                {!isMusicPaused ?
                  <span className='i-mdi-pause text-3xl cursor-pointer' 
                  style={{
                    color: states.Settings.settings.system.systemTextColor
                  }}
                  />
                  :
                  <span className='i-mdi-play text-3xl cursor-pointer'
                  style={{
                    color: states.Settings.settings.system.systemTextColor
                  }}
                  />
                }
              </div>
              <div className='h-full w-12 mx-0.5 flex justify-center items-center'>
                <span
                  className='i-mdi-skip-next text-3xl cursor-pointer'
                  style={{
                    color: states.Settings.settings.system.systemTextColor || 'white',
                  }}
                  onClick={handleNextMusic}
                />
              </div>
            </div>
            <div className='h-1/3 w-full flex justify-evenly items-center'>
              <CustomText
                text={secondsToMinutes(musicCurrentTime)}
                className='!text-xs !font-normal '
              />
              <Progress
                value={musicProgress}
                size='sm'
                color={states.Settings.settings.system.systemHighlightColor}
                animated
                radius={6}
                className='w-4/5'
              />
              <CustomText
                text={secondsToMinutes(musicDuration)}
                className='!text-xs !font-normal '
              />
            </div>
          </div>
          <div className='h-full w-1/4 flex  px-1' >
            <div className='w-1/6 h-full flex justify-center items-center'>
              {musicVolume === 0 ? 
              <span className='i-mdi-volume-mute text-2xl cursor-pointer'
              style={{
                color: states.Settings.settings.system.systemTextColor
              }}
              onClick={() => {
                setMusicVolume(0.5)
              }}
            />
              :
              <span className='i-mdi-volume-high text-2xl cursor-pointer'
              style={{
                color: states.Settings.settings.system.systemTextColor
              }}
              onClick={() => {
                setMusicVolume(0)
              }}
            />
              }
            </div>
            <div className='w-5/6 h-full flex justify-center items-center pl-1'>
              <Slider
                h={6}
                w={'100%'}
                color={states.Settings.settings.system.systemTextColor}
                value={Number((musicVolume * 100).toFixed(0))}
                onChange={(value) => {
                  setMusicVolume(value / 100)
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}

export default MusicLibrary