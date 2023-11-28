import React, { useEffect, useState } from 'react'
import CustomText from '../atoms/CustomText'
import { Button, Input, Progress, SimpleGrid, Slider, Text, TextInput } from '@mantine/core'
import { Dropzone } from '@mantine/dropzone'
import { truncateText } from '@/utils/text'
import { MusicItemProps } from '@/types/musics'
import useFS from '@/hooks/useFS'
import { addTypeToBase64, audioToBase64, getExtension, getExtensionFromBase64, imageToBase64, removeTypeFromBase64, uuid, verifyIfExtensionIsAudio, wait } from '@/utils/file'
import { ApiError } from 'next/dist/server/api-utils'
import Image from 'next/image'
import { secondsToMinutes } from '@/utils/date'
import { programProps } from '@/types/programs'
import DefaultWindow from '../containers/DefaultWindow'
import useStore from '@/hooks/useStore'

const MyMusics = ({
  tab,
  window
}: programProps) => {

  const { fs } = useFS()
  const {states, dispatch} = useStore()

  const [isUploadOpen, setIsUploadOpen] = React.useState(false)
  const [uploadMusicText, setUploadMusicText] = React.useState('Music')
  const [uploadImageText, setUploadImageText] = React.useState('Image')
  const [inputMusicTitle, setInputMusicTitle] = React.useState('')
  const [inputMusicArtist, setInputMusicArtist] = React.useState('')
  const [musicToUpload, setMusicToUpload] = React.useState<File | null>(null)
  const [imageToUpload, setImageToUpload] = React.useState<File | null>(null)
  const [musics, setMusics] = React.useState<MusicItemProps[]>([])
  const [musicSelected, setMusicSelected] = React.useState<MusicItemProps | null>(null)
  const [isMusicPlaying, setIsMusicPlaying] = React.useState(false)
  const [isMusicPaused, setIsMusicPaused] = React.useState(true)
  const [musicDuration, setMusicDuration] = React.useState(0)
  const [musicCurrentTime, setMusicCurrentTime] = React.useState(0)
  const [musicProgress, setMusicProgress] = React.useState(0)
  const [musicVolume, setMusicVolume] = React.useState(1)
  const [currentMusicIndex, setCurrentMusicIndex] = React.useState(0)

  const [searchText, setSearchText] = React.useState('')

  const [audioElement, setAudioElement] = React.useState<HTMLAudioElement | null>(null)


  type MusicItemPropsPlus = MusicItemProps & {
    index: number
  }
  const MusicItem = ({
    name,
    artist,
    image,
    music,
    index,
  }: MusicItemPropsPlus) => {
    return (
      <div className='w-full h-20  flex justify-center items-center cursor-pointer'
        style={{
          backgroundColor: states.Settings.settings.system.systemBackgroundColor || 'whitesmoke',
        }}
        onClick={() => {
          setCurrentMusicIndex(index)
          handlerPlayMusic({
            name,
            artist,
            image,
            music,
          })
        }}
      >
        <div className='w-20 h-20 flex justify-center items-center' >
          <Image
            src={image || '/assets/icons/Alaska.png'}
            width={80}
            height={80}
            alt='Music Image'
          />
        </div>
        <div className='w-[calc(100%-80px)] flex flex-col h-16 ml-1'>
          <CustomText
            text={truncateText(name, 42)}
            className='text-sm'
          />
          <CustomText
            text={truncateText(artist, 48)}
            className='text-xs'
          />
        </div>
      </div>
    )
  }

  useEffect(() => {
    LoadMusics()
  }, [fs])


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

  
    setMusicSelected(music);
    const newAudioElement = new Audio(music.music);
  
    newAudioElement.addEventListener('loadeddata', (e) => {
      setMusicDuration(newAudioElement.duration || 0);
      setIsMusicPlaying(true);
      setIsMusicPaused(false);
      newAudioElement.play();
    });
  
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
    // Adicione um controle para evitar a execução múltipla
    if (!musicEndedHandled) {
      console.log("end");
      setMusicEndedHandled(true);
      handleTogglePause();
      await wait(1000);
      handleNextMusic();
    }
  };
  
  // Adicione um estado para controlar se o evento 'ended' foi manipulado
  const [musicEndedHandled, setMusicEndedHandled] = useState(false);



  const AppendToMusics = (music: MusicItemProps) => {
    setMusics((prevMusics) => {
      if (prevMusics.some((existingMusic) => existingMusic.name === music.name)) {
        return prevMusics;
      }

      const newMusics = [...prevMusics, music];
      return newMusics;
    });
  };

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

  const LoadMusics = async () => {
    const FolderName = '/ProgramFiles/myMusics'
    setMusics([])
    fs?.readdir(FolderName, (err, folders) => {
      if (err) {
        console.log(err)
      } else {
        folders?.forEach((folder) => {
          const music: MusicItemProps = {
            name: '',
            artist: '',
            image: '',
            music: '',
          }
          fs?.readdir(`${FolderName}/${folder}`, (err, files) => {
            files?.forEach((file) => {
              if (getExtension(file) === 'json') {
                fs?.readFile(`${FolderName}/${folder}/${file}`, (err, jsonBuffer) => {
                  if (err) {
                    console.log(err)
                  } else {
                    if (jsonBuffer) {
                      const jsonData = Buffer.from(jsonBuffer).toString()
                      music.artist = JSON.parse(jsonData).artist
                      music.name = JSON.parse(jsonData).name
                    }

                  }
                })
              } else {
                fs?.readFile(`${FolderName}/${folder}/${file}`, 'utf-8', (err, data) => {
                  if (err) {
                    console.log(err)
                  } else {
                    if (data) {
                      if (verifyIfExtensionIsAudio(getExtension(file))) {
                        music.music = addTypeToBase64(getExtension(file), data)
                      } else {
                        music.image = addTypeToBase64(getExtension(file), data)
                      }
                      AppendToMusics(music)
                    }
                  }
                })
              }
            })
          })
        })
      }
    })
  }

  useEffect(() => {
    setAudioElement((audio) => {
      if (audio) {
        audio.volume = musicVolume
      }
      return audio
    })
  }, [musicVolume])

  const handlerUploadMusic = async ({
    name,
    artist,
    image,
  }: MusicItemProps) => {
    const musicToUploadProps: MusicItemProps = {
      name,
      artist,
      image,
    }
    if (name === '') {
      musicToUploadProps.name = 'Unknown Music'
    }
    if (artist === '') {
      musicToUploadProps.artist = 'Unknown Artist'
    }

    if (musicToUpload !== null) {
      let image64 = ''
      const music64 = await audioToBase64(musicToUpload) as string
      if (imageToUpload !== null) {
        image64 = await imageToBase64(imageToUpload) as string
      }
      const ObjectToUpload = {
        ...musicToUploadProps,
        music: music64,
        image: image64,
      }

      const FolderName = `/ProgramFiles/myMusics/${uuid(8)}`
      fs?.mkdir(FolderName, (err: ApiError) => {
        if (err) {
          console.log(err)
        } else {
          if (image64 !== '') {
            fs?.writeFile(`${FolderName}/image.${getExtension(imageToUpload?.name || '.png')}`, removeTypeFromBase64(image64), (err) => {
              if (err) {
                console.log(err)
              } else {
                console.log('Image Uploaded')
              }
            })
          }
          if (music64 !== '') {
            fs?.writeFile(`${FolderName}/music.${getExtension(musicToUpload.name)}`, removeTypeFromBase64(music64), (err) => {
              if (err) {
                console.log(err)
              } else {
                console.log('Music Uploaded')
              }
            })
          }
          fs?.writeFile(`${FolderName}/music.json`, JSON.stringify({
            name: name,
            artist: artist,
          }), (err) => {
            if (err) {
              console.log(err)
            } else {
              console.log('Success!')
              LoadMusics()
            }
          }
          )
        }
      })
      console.log(ObjectToUpload)
    }
  }



  return (
    <DefaultWindow
      currentTab={tab}
      currentWindow={window}
      title='My Musics'
      uuid={tab?.uuid || ''}
      onClose={() => { 
        console.log("close")
        handleTogglePause()
      }}
      onMinimize={() => { }}
      onMaximize={() => { }}
      resizable

    >
      <div className='flex flex-col w-full h-full'>
        <div className='sticky w-full py-1 flex flex-col
        transition-all duration-300 ease-in-out
      '
          style={{
            backgroundColor: states.Settings.settings.system.systemBackgroundColor || 'whitesmoke',
            height: isUploadOpen ? '176px' : '70px',
          }}
        >
          <div className=' w-full h-full  items-center justify-center
          transition-all duration-300 ease-in-out flex overflow-hidden
        '
            style={{
              height: isUploadOpen ? '60%' : '0%',
              // display: isUploadOpen ? 'flex' : 'none',
              borderBottom: '1px solid',
              borderColor: isUploadOpen ? states.Settings.settings.system.systemTextColor : 'transparent',
            }}
          >
            <Dropzone
              className='h-24 w-24 rounded flex flex-col items-center justify-center mx-1 mb-1
          border border-dashed border-gray-500 bg-slate-300 bg-opacity-40 cursor-pointer hover:bg-opacity-60 transition-all duration-300 ease-in-out'
              onDrop={(files) => {
                const musicToUpload = files[0]
                setUploadMusicText(musicToUpload.name)
                setMusicToUpload(musicToUpload)
                if (inputMusicTitle === '') {
                  setInputMusicTitle(musicToUpload.name)
                }
              }}
              multiple={false}
              accept={['audio/*']}
            >
              <span className='i-mdi-upload text-lg -mb-1'
                style={{
                  color: states.Settings.settings.system.systemTextColor
                }}
              />
              <CustomText
                text={truncateText(uploadMusicText, 6)}
                className='text-xs mr-1'
                style={{
                  color: states.Settings.settings.system.systemTextColor
                }}
              />
            </Dropzone>
            <Dropzone className='h-24 w-24 rounded  flex flex-col items-center justify-center mx-1 mb-1
          border border-dashed border-gray-500 bg-slate-300 bg-opacity-40 cursor-pointer hover:bg-opacity-60 transition-all duration-300 ease-in-out'
              onDrop={(files) => {
                const imageToUpload = files[0]
                setUploadImageText(imageToUpload.name)
                setImageToUpload(imageToUpload)
              }}
              multiple={false}
              accept={['image/*']}
            >
              <span className='i-mdi-upload text-lg -mb-1'
                style={{
                  color: states.Settings.settings.system.systemTextColor
                }}
              />
              <CustomText
                text={truncateText(uploadImageText, 6)}
                className='text-xs mr-1'
                style={{
                  color: states.Settings.settings.system.systemTextColor
                }}
              />
            </Dropzone>
            <div className='h-24  flex  items-center justify-evenly px-1'>
              <TextInput
                label='Music Name: '
                placeholder='Music Name'
                className='w-5/12 mx-1'
                value={inputMusicTitle}
                onChange={(event) => {
                  setInputMusicTitle(event.currentTarget.value)
                }}
                style={{
                  color: states.Settings.settings.system.systemTextColor,
                  borderColor: states.Settings.settings.system.systemTextColor,
                }}
              />
              <TextInput
                label='Artist Name: '
                placeholder='Artist Name'
                className='w-5/12 mx-1'
                value={inputMusicArtist}
                onChange={(event) => {
                  setInputMusicArtist(event.currentTarget.value)
                }}
                style={{
                  color: states.Settings.settings.system.systemTextColor,
                  borderColor: states.Settings.settings.system.systemTextColor,
                }}
              />
              <Button
                className='w-2/12 mx-1 mt-6'
                style={{
                  backgroundColor: 'transparent',
                  color: states.Settings.settings.system.systemTextColor,
                  border: '1px solid',
                  borderColor: states.Settings.settings.system.systemTextColor,
                }}
                onClick={() => {
                  setInputMusicTitle('')
                  setInputMusicArtist('')
                  setUploadImageText('')
                  setUploadMusicText('')
                  handlerUploadMusic({
                    name: inputMusicTitle,
                    artist: inputMusicArtist,
                    image: uploadImageText,
                  })
                }}
              >
                Save
              </Button>
            </div>
          </div>
          <div className='w-full flex justify-start items-center
        transition-all duration-300 ease-in-out
        '
            style={{
              height: isUploadOpen ? '40%' : '100%',
            }}
          >

            <Button
              className='w-2/12 mx-1 mt-5 ml-2'
              style={{
                backgroundColor: 'transparent',
                color: states.Settings.settings.system.systemTextColor,
                border: '1px solid',
                borderColor: states.Settings.settings.system.systemTextColor,
              }}
              onClick={() => {
                setIsUploadOpen(!isUploadOpen)
              }}
            >
              <CustomText
                text='New Music'
                className='text-xs'
                style={{
                  color: states.Settings.settings.system.systemTextColor
                }}
              />
            </Button>
            <TextInput
              label='Search: '
              placeholder='Search'
              defaultValue={searchText}
              value={searchText}
              onChange={(event) => {
                setSearchText(event.currentTarget.value)
              }}
              className='w-4/12 mx-1 mb-1 ml-6'
              style={{
                color: states.Settings.settings.system.systemTextColor,
                borderColor: states.Settings.settings.system.systemTextColor,
              }}
            />

          </div>
        </div>

        <div className='w-full flex flex-col h-full overflow-y-auto py-2 px-2 '>
          <SimpleGrid
            cols={3}
            verticalSpacing={6}
            spacing={6}
          > {!searchText
            ?
            musics.map((music, index) => <MusicItem index={index} key={index} {...music} />)
            :
            musics.filter((music) => {
              if (music.name.toLowerCase().includes(searchText.toLowerCase()) || music.artist.toLowerCase().includes(searchText.toLowerCase())) {
                return music
              }

            }).map((music, index) => <MusicItem index={index} key={index} {...music} />)
            }
          </SimpleGrid>
        </div>
        <div className='sticky  w-full h-32 flex justify-center items-center'
          style={{
            backgroundColor: states.Settings.settings.system.systemBackgroundColor || 'whitesmoke',
          }}
        >
          <div className='h-20 w-3/12 flex justify-center items-start py-2 mx-1 '
          >
            <div className='w-16 h-16 flex justify-center items-center ' >
              {
                musicSelected?.image ?
                  <Image
                    src={musicSelected?.image || '/assets/icons/Alaska.png'}
                    width={80}
                    height={80}
                    alt='Music Image'
                  />
                  :
                  <span className='i-mdi-music-note text-4xl'
                    style={{
                      color: states.Settings.settings.system.systemTextColor
                    }}
                  />
              }
            </div>
            <div className='w-[calc(100%-64px)] flex flex-col h-16 ml-1'>
              <CustomText
                text={truncateText(musicSelected?.name || '', 16) || 'Unknown Music'}
                className='text-sm'
              />
              <CustomText
                text={truncateText(musicSelected?.artist || '', 12) || 'Unknown Artist'}
                className='text-xs'
              />
            </div>
          </div>
          <div className='h-full w-6/12  flex flex-col justify-center items-center mx-1 '>
            <div className=' w-full flex h-2/3 justify-center items-center'>
              <span
                className='i-mdi-skip-previous text-4xl mx-1 cursor-pointer
              hover:bg-slate-500 transition-all duration-300 ease-in-out'
                onClick={handlePreviousMusic}
                style={{
                  color: states.Settings.settings.system.systemTextColor
                }}
              />
              <div className='
              bg-black mx-1 h-8 w-8 flex justify-center items-center rounded-full
              cursor-pointer hover:bg-slate-500 transition-all duration-300 ease-in-out
              '
                onClick={handleTogglePause}
              >
                {!isMusicPaused ?
                  <span className='i-mdi-pause text-2xl text-white cursor-pointer' />
                  :
                  <span className='i-mdi-play text-2xl text-white cursor-pointer' />
                }
              </div>
              <span
                className='i-mdi-skip-next text-4xl mx-1 cursor-pointer
              hover:bg-slate-500 transition-all duration-300 ease-in-out
              '
                onClick={handleNextMusic}
                style={{
                  color: states.Settings.settings.system.systemTextColor
                }}
              />
            </div>
            <div className='w-full h-1/3 flex justify-evenly items-center'>
              <CustomText
                text={secondsToMinutes(musicCurrentTime)}
                className='text-xs'
              />
              <Progress
                color='blue'
                value={musicProgress}
                w={"80%"}
                h={6}
                radius={6}
                style={{
                  width: '50%',
                  height: '50%',
                }}
              />
              <CustomText
                text={secondsToMinutes(musicDuration)}
                className='text-xs'
              />

            </div>
          </div>
          <div className='h-full w-3/12 flex justify-center items-center mx-1 '>
            <div className='w-1/6 h-full flex justify-center items-center'>
              <span className='i-mdi-volume-high text-2xl cursor-pointer'
                style={{
                  color: states.Settings.settings.system.systemTextColor
                }}
              />
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
    </DefaultWindow>
  )
}

export default MyMusics