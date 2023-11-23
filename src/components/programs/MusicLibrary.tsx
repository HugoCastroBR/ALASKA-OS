'use client'
import { Button, FileButton, Loader, Progress, Slider } from '@mantine/core'
import React, { useEffect } from 'react'
import CustomText from '../atoms/CustomText'
import Image from 'next/image'
import { truncateText } from '@/utils/text'
import { base64ToFile, convertMp3Base64ToFile, convertSizeToKBMBGB, getExtension, getMP3Duration, uuid } from '@/utils/file'
import useFS from '@/hooks/useFS'
import { ApiError } from 'next/dist/server/api-utils'
import { secondsToMinutes } from '@/utils/date'
import { MusicItemProps, MusicProps, programProps } from '@/types/programs'
import MusicItem from '../molecules/MusicItem'
import useStore from '@/hooks/useStore'
import { AddMusic, ClearMusic, MusicClearEverything, SetCurrentMusic, SetCurrentPlayingIndex, SetIsPaused, SetIsPlaying, SetMusics, SetProgress, SetVolume } from '@/store/actions'
import DefaultWindow from '../containers/DefaultWindow'

function MusicLibrary({
  tab,
  window,
}: programProps) {

  const { fs } = useFS()
  const { states, dispatch } = useStore()

  const [musicCurrentTime, setMusicCurrentTime] = React.useState(0)
  const [isExternalSource, setIsExternalSource] = React.useState(false)

  useEffect(() => {
    LoadMusicFiles()
  }, [fs])

  useEffect(() => {


    if (tab.value !== '/Desktop') {
      setIsExternalSource(true)
      fs?.readFile(`${tab.value}`, 'utf8', (err, data) => {
        if (err) throw err
        if (data) {
          console.log(data)
          console.log(data)

          let MusicToRender = {
            index: 0,
            music: {
              artist: 'Unknown Artist',
              title: 'Unknown Title',
              cover: '',
              duration: 0,
              musicFile: base64ToFile(data, {
                fileName: tab.ficTitle || 'music.mp3',
                fileType: 'audio/mpeg',
              }),
              uuid: uuid(6),
            }
          } as MusicItemProps
          HandlerPlayMusic(MusicToRender.music)
          dispatch(SetIsPlaying(true))
          dispatch(SetIsPaused(true))
        }
      })
      // dispatch(AddMusic({
      //   artist: 'Unknown Artist',
      //   title: 'Unknown Title',
      //   cover: '',
      //   duration: 0,
      //   musicFile: null,
      //   uuid: uuid(6),
      // }))
    }
  }, [tab])


  const HandlerUploadMusic = (file: File) => {
    setIsLoading(true)
    const folder = `/Musics/${uuid(8)}}`
    const fileName = file.name.replaceAll(' ', '_')
    const fileReader = new FileReader()
    fileReader.readAsDataURL(file)
    fileReader.onload = () => {
      if (fileReader.result) {
        const fileBuffer = fileReader.result.toString().split(',')[1]

        fs?.mkdir(folder, (err: ApiError) => {
          if (err) {
            console.log(err)
            setUploadMusicOpen(false)
            setIsLoading(false)
            throw err

          }

          console.log('Folder Created', folder)
          const aboutJsonContent = {
            title: UploadedSongTitle,
            artist: UploadedSongArtist,
          }
          const JsonContent = JSON.stringify(aboutJsonContent)
          console.log(JsonContent)
          fs?.writeFile(`${folder}/about.txt`, JsonContent, 'utf8', (err) => {
            if (err) {
              console.log(err)
              setUploadMusicOpen(false)
              setIsLoading(false)
              throw err

            }
            console.log('About.json Created')
            fs?.writeFile(`${folder}/image.${UploadedSongCoverExtension}`, UploadedSongCover?.split(',')[1], (err) => {
              if (err) {
                console.log(err)
                setUploadMusicOpen(false)
                setIsLoading(false)
                throw err

              }
              console.log('Music Cover Uploaded')
              console.log(fileBuffer.length)
              fs?.writeFile(`${folder}/music.${getExtension(fileName)}`, fileBuffer, (err) => {
                if (err) {
                  console.log(err)
                  setUploadMusicOpen(false)
                  setIsLoading(false)
                  throw err

                }
                console.log('Music Uploaded')
                setIsLoading(false)
                setUploadMusicOpen(false)
                LoadMusicFiles()
              })
            })
          })

        })
      }
    }

  }

  const LoadMusicFiles = () => {

    console.log('Loading Musics')
    dispatch(SetMusics([]))


    fs?.readdir('/Musics', (err, folders) => {
      if (err) throw err
      if (folders?.length === 0) return
      folders?.map((folder) => {
        setIsLoading(true)
        let MusicToRender = {
          music: {
            artist: 'Unknown Artist',
            title: 'Unknown Title',
            cover: '',
            duration: 0,
            musicFile: null,
            uuid: uuid(6),
          }
        } as MusicItemProps
        fs?.readFile(`/Musics/${folder}/about.txt`, 'utf8', (err, data) => {
          if (err) throw err
          if (data) {
            const aboutJson = JSON.parse(data)
            MusicToRender.music.artist = aboutJson.artist || 'Unknown Artist'
            MusicToRender.music.title = aboutJson.title || 'Unknown Title'
          }
        })
        fs?.readFile(`/Musics/${folder}/image.png`, 'utf8', (err, data) => {
          if (err) throw err
          if (data) {
            MusicToRender.music.cover = data
          }
        })
        fs?.readFile(`/Musics/${folder}/music.mp3`, 'utf8', (err, data) => {
          if (err) throw err
          if (data) {
            const musicFile = base64ToFile(data, {
              fileName: 'music.mp3',
              fileType: 'audio/mpeg',
            })
            MusicToRender.music.musicFile = musicFile
            MusicToRender.music.duration = 0
            setIsLoading(false)
            dispatch(AddMusic(MusicToRender.music))
          }
        })
      })
    })
  }


  const [audioElement, setAudioElement] = React.useState<HTMLAudioElement | null>(null)

  const HandlerChangeVolume = (value: number) => {
    if (!audioElement) return
    audioElement.volume = value
    dispatch(SetVolume(value))
  }
  const CleanMusic = () => {
    dispatch(ClearMusic())
    setAudioElement((audioElement) => {
      audioElement?.pause()
      return audioElement
    })
  }

  const HandlerPauseMusic = () => {
    setAudioElement((audioElement) => {
      audioElement?.pause()
      return audioElement
    })
    dispatch(SetIsPlaying(false))
    dispatch(SetIsPaused(true))
  }

  const HandlerUnpauseMusic = () => {
    setAudioElement((audioElement) => {
      audioElement?.play()
      return audioElement
    })
    dispatch(SetIsPlaying(true))
    dispatch(SetIsPaused(false))
  }

  const HandlerTogglePauseMusic = () => {
    if (states.Musics.isPaused) {
      HandlerUnpauseMusic()
    } else {
      HandlerPauseMusic()
    }
  }

  const HandlerPlayMusic = (music: MusicProps) => {
    if (states.Musics.isPlaying) {
      CleanMusic()
    }
    dispatch(SetCurrentMusic({
      ...music,
      cover: `data:image/png;base64,${music.cover}` || '/assets/icons/Alaska.png',
    }))
    // setMusicDurationTime(music.duration)
    setMusicCurrentTime(0)

    if (!music.musicFile) return
    const audio = URL.createObjectURL(music.musicFile)
    setAudioElement(new Audio(audio))
    setAudioElement((audioElement) => {
      audioElement?.play()
      return audioElement
    })
    dispatch(SetIsPlaying(true))
    dispatch(SetProgress(0))
    dispatch(SetIsPaused(false))
    setAudioElement((audioElement) => {
      audioElement?.addEventListener('timeupdate', (ev) => {
        setMusicCurrentTime(audioElement.currentTime)
        dispatch(SetProgress((audioElement.currentTime / music.duration) * 100))
      })
      audioElement?.addEventListener('ended', (ev) => {
        dispatch(SetIsPlaying(false))
        dispatch(SetIsPaused(true))
        HandlerPlayNextMusic()
      })
      audioElement?.addEventListener('pause', (ev) => {
        dispatch(SetIsPaused(true))
      })
      audioElement?.addEventListener('play', (ev) => {
        dispatch(SetIsPaused(false))
      })
      return audioElement
    })
  }

  const HandlerPlayNextMusic = async () => {
    states.Musics.musics.map(async (music, index) => {
      console.log(music)
      if (index === states.Musics.musics.length - 1) {
        const MusicToPlay = states.Musics.musics[0]
        if (!MusicToPlay.musicFile) return
        const MusicDuration = await getMP3Duration(MusicToPlay.musicFile)
        dispatch(SetCurrentPlayingIndex(0))
        HandlerPlayMusic({
          ...MusicToPlay,
          duration: MusicDuration,
        })
      }
      if (index === states.Musics.currentPlayingIndex + 1) {
        const musicToPlay = music
        if (!musicToPlay.musicFile) return
        const MusicDuration = await getMP3Duration(musicToPlay.musicFile)
        HandlerPlayMusic({
          ...musicToPlay,
          duration: MusicDuration,
        })
        dispatch(SetCurrentPlayingIndex(index))
      }
    })
  }

  const HandlerPlayPreviousMusic = async () => {
    states.Musics.musics.map(async (music, index) => {
      if (index === 0) {
        dispatch(SetCurrentPlayingIndex(states.Musics.musics.length - 1))
        const musicToPlay = states.Musics.musics[states.Musics.musics.length - 1]
        if (!musicToPlay.musicFile) return
        const MusicDuration = await getMP3Duration(musicToPlay.musicFile)
        HandlerPlayMusic({
          ...musicToPlay,
          duration: MusicDuration,
        })
      }
      if (index === states.Musics.currentPlayingIndex - 1) {
        const musicToPlay = music
        if (!musicToPlay.musicFile) return
        const MusicDuration = await getMP3Duration(musicToPlay.musicFile)
        HandlerPlayMusic({
          ...musicToPlay,
          duration: MusicDuration,
        })
        dispatch(SetCurrentPlayingIndex(index))
      }
    })
  }




  const [isLoading, setIsLoading] = React.useState(true)
  const [UploadMusicOpen, setUploadMusicOpen] = React.useState(false)
  const [MusicToUpload, setMusicToUpload] = React.useState<File | null>(null)
  const [UploadedSongCover, setUploadedSongCover] = React.useState<string | null>(null)
  const [UploadedSongCoverExtension, setUploadedSongCoverExtension] = React.useState<string | null>(null)
  const [UploadedSongTitle, setUploadedSongTitle] = React.useState<string | null>(null)
  const [UploadedSongArtist, setUploadedSongArtist] = React.useState<string | null>(null)

  const UploadMusicItem = () => {
    return (
      <FileButton
        accept='audio/mpeg  '
        onChange={async (e) => {
          if (e) {
            setUploadMusicOpen(true)
            setMusicToUpload(e)
            console.log(e)
            console.log(convertSizeToKBMBGB(e.size))
            // convertMP3ToBase64(e)
          }
        }} >
        {(props) => <Button {...props}
          className='w-full h-16 flex justify-center items-center my-2 
            bg-slate-50 bg-opacity-50 backdrop-filter backdrop-blur-sm
            hover:bg-slate-200 transition-all duration-300 ease-in-out
            border-dashed border-2 border-slate-300 text-slate-400
            cursor-pointer text-lg font-semibold rounded-md
            
          '
          styles={{
            root: {
              backgroundColor: 'transparent',
              border: '2px solid rgb(203, 213, 225)',
              borderStyle: 'dashed',
              color: 'gray',
              width: '100%',
              height: '64px',
            }
          }}
        >
          <div className='h-full w-full flex justify-center items-center'>
            <span className='i-mdi-upload text-xl mr-2 text-slate-400' />
            <CustomText
              text='Upload Music'
              className='text-lg font-semibold text-slate-400'
            />
          </div>
        </Button>}
      </FileButton>
    )
  }


  const ImageFileToBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader()
      fileReader.readAsDataURL(file)
      fileReader.onload = () => {
        if (fileReader.result) {
          resolve(fileReader.result)
        }
      }
      fileReader.onerror = (error) => {
        reject(error)
      }
    })
  }

  const UploadMusicCoverItem = () => {
    return (
      <FileButton
        accept='image/*'
        onChange={async (file) => {
          if (file) {
            const fileBase64 = await ImageFileToBase64(file)
            if (typeof fileBase64 === 'string') {
              console.log(fileBase64)
              setUploadedSongCover(fileBase64)
              setUploadedSongCoverExtension(getExtension(file.name))
            }
          }
        }} >
        {(props) => <Button {...props}
          className='w-full h-48 flex justify-center items-center my-2 
            bg-slate-50 bg-opacity-50 backdrop-filter backdrop-blur-sm
            hover:bg-slate-200 transition-all duration-300 ease-in-out
            border-dashed border-2 border-slate-300 text-slate-400
            cursor-pointer text-lg font-semibold rounded-md
            
          '
          styles={{
            root: {
              backgroundColor: 'transparent',
              border: '2px solid rgb(203, 213, 225)',
              borderStyle: 'dashed',
              color: 'gray',
              width: '192px',
              height: '192px',
            }
          }}
        >
          <div className='h-full w-full flex flex-col justify-center items-center'>
            {UploadedSongCover
              ?
              <Image
                src={UploadedSongCover}
                alt='music'
                height={192}
                width={192}
              />
              :
              <>
                <span className='i-mdi-upload text-4xl  text-slate-400' />
                <CustomText
                  text='Upload Music Cover'
                  className='text-lg font-semibold text-slate-400 '
                />
              </>
            }
          </div>
        </Button>}
      </FileButton>
    )
  }

  if (isLoading) {
    return (
      <div
        className='absolute w-1/2 h-1/2 top-1/4 left-1/4
      flex flex-col overflow-hidden rounded-lg bg-white
      justify-center items-center'
      >
        <Loader
          size={128}
        />
        <CustomText
          text='Loading Musics...'
          className='text-xl font-semibold mt-2'
        />
      </div>
    )
  }

  return (
    <DefaultWindow
      currentTab={tab}
      currentWindow={window}
      title='Music Library'
      uuid={tab.uuid}
      onClose={() => {
        setMusicCurrentTime(0)
        setUploadMusicOpen(false)
        setMusicToUpload(null)
        setUploadedSongCover(null)
        setUploadedSongCoverExtension(null)
        setUploadedSongTitle(null)
        setUploadedSongArtist(null)
        dispatch(MusicClearEverything())
        CleanMusic()
        console.log('Closing Music Library')
        HandlerChangeVolume(0)
        setAudioElement((audioElement) => {
          audioElement?.pause()
          audioElement?.removeEventListener('timeupdate', (ev) => {
            setMusicCurrentTime(audioElement.currentTime)
            dispatch(SetProgress((audioElement.currentTime / states.Musics.currentMusic.duration) * 100))

          })

          return audioElement
        })

        setAudioElement(null)
      }}
      onMaximize={() => { }}
      onMinimize={() => { }}
      resizable
    >
      <div
        className='
      flex flex-col  bg-white h-full w-full'
      >
        {UploadMusicOpen &&
          <div className='
      absolute z-30 w-full h-full bg-slate-50 
      bg-opacity-80 backdrop-filter backdrop-blur-sm 
      flex justify-center items-center'>
            <div className='p-2 w-64 h-96 flex flex-col bg-white  justify-evenly items-center
          backdrop-filter backdrop-blur-sm rounded-md shadow-xl drop-shadow-md
        '>
              <UploadMusicCoverItem />
              <input
                type='text'
                className='w-48 h-8 border border-slate-300 rounded-md px-2 outline-none'
                placeholder='Song Title'
                onChange={(e) => {
                  setUploadedSongTitle(e.target.value)
                }}
                value={UploadedSongTitle || ''}
                autoFocus
              />
              <input
                type='text'
                className='w-48 h-8 border border-slate-300 rounded-md px-2 outline-none'
                placeholder='Artist Name'
                onChange={(e) => {
                  setUploadedSongArtist(e.target.value)
                }}
                value={UploadedSongArtist || ''}
              />
              <div className='w-48 h-8 flex justify-between items-center'>
                <Button
                  color='red'
                  className='w-1/2 h-full'
                  onClick={() => {
                    setUploadMusicOpen(false)
                  }}
                >
                  <CustomText
                    text='Cancel'
                    className='text-lg font-semibold'
                  />
                </Button>
                <Button
                  color='green'
                  className='w-1/2 h-full'
                  onClick={() => {
                    if (!MusicToUpload) {
                      console.log(MusicToUpload)
                      return
                    }
                    HandlerUploadMusic(MusicToUpload)
                  }}
                >
                  <CustomText
                    text='Upload'
                    className='text-lg font-semibold'
                  />
                </Button>

              </div>
            </div>
          </div>
        }

        <div className='flex flex-col w-full h-full'>
          <div className='w-full h-full flex pt-1 px-1'>
            <div className='w-full h-full  flex-col items-start justify-start'>
              <div className='
              w-full h-10 flex justify-center items-center
              border-b border-slate-300 -ml-0.5
            '>
                <CustomText
                  text='Library'
                  className='text-xl font-semibold'
                />
              </div>
              <div className='w-full h-[calc(100%-40px)] overflow-x-hidden overflow-y-auto'>
                <UploadMusicItem />


                {
                  states.Musics.musics.map((musicItem, index) => {
                    return (
                      <MusicItem
                        index={index}
                        music={musicItem}
                        key={index}
                        {...musicItem}
                        onClick={(music) => {
                          console.log(music.uuid)
                          HandlerPlayMusic(music)
                          dispatch(SetCurrentPlayingIndex(index))
                        }}
                      />
                    )
                  })
                }
              </div>
            </div>
          </div>
          <div className='w-full h-20 flex justify-between px-2 py-1 items-center'>
            <div className='w-3/12  h-full flex justify-evenly items-center'>
              <div className='w-1/3 h-16  flex justify-center items-center'>
                <div className='w-16 h-16 overflow-hidden rounded'>
                  {
                    isExternalSource
                      ?
                      <Image
                        src={'/assets/icons/Alaska.png'}
                        alt='music'
                        height={64}
                        width={64}
                      />
                      :
                      <Image
                        src={states.Musics.currentMusic.cover || '/assets/icons/Alaska.png'}
                        alt='music'
                        height={64}
                        width={64}
                      />
                  }


                </div>
              </div>
              <div className='h-16 w-2/3 flex flex-col items-start px-px pr-1 justify-start'>
                <CustomText
                  text={truncateText(states.Musics.currentMusic.title || 'Unknown Music', 64)}
                  className='text-sm font-semibold'
                />
                <CustomText
                  text={truncateText(states.Musics.currentMusic.artist || 'Unknown artist', 64)}
                  className='text-sm mt-0.5'
                />

              </div>
            </div>
            <div className='w-6/12 h-full flex flex-col  items-center'>
              <div className='w-full h-3/5 flex justify-center items-center'>

                <span
                  className='i-mdi-skip-previous text-4xl mx-1 cursor-pointer
              hover:bg-slate-500 transition-all duration-300 ease-in-out'
                  onClick={HandlerPlayPreviousMusic}
                />

                <div className='
              bg-slate-800 mx-1 h-8 w-8 flex justify-center items-center rounded-full
              cursor-pointer hover:bg-slate-500 transition-all duration-300 ease-in-out
              '
                  onClick={HandlerTogglePauseMusic}
                >
                  {!states.Musics.isPaused ?
                    <span className='i-mdi-pause text-2xl text-white cursor-pointer' />
                    :
                    <span className='i-mdi-play text-2xl text-white cursor-pointer' />
                  }

                </div>

                <span
                  className='i-mdi-skip-next text-4xl mx-1 cursor-pointer
              hover:bg-slate-500 transition-all duration-300 ease-in-out
              '
                  onClick={HandlerPlayNextMusic}
                />

              </div>
              <div className='flex items-center justify-evenly h-2/5 w-full px-2'>
                <div className='w-1/12 flex justify-center'>
                  <CustomText
                    text={secondsToMinutes(musicCurrentTime)}
                    className='text-xs'
                  />
                </div>
                <div className='w-10/12 px-1'>
                  <Progress
                    value={states.Musics.progress}
                    animated
                    
                    color='blue'
                    h={6}
                    radius={6}
                  />
                </div>
                <div className='w-1/12 flex justify-center'>
                  <CustomText
                    text={secondsToMinutes(states.Musics.currentMusic.duration || 0)}
                    className='text-xs'
                  />
                </div>
              </div>
            </div>
            <div className='w-3/12  flex h-full px-1 pl-4'>
              <div className='w-1/6 h-full flex justify-center items-center'>
                <span className='i-mdi-volume-high text-2xl cursor-pointer' />
              </div>
              <div className='w-5/6 h-full flex justify-center items-center pl-1'>
                <Slider
                  h={6}
                  w={'100%'}
                  color='black'
                  value={Number(((states.Musics.volume * 100)* states.System.globalVolumeMultiplier).toFixed(0))}
                  onChange={(value) => {
                    HandlerChangeVolume(value / 100)

                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultWindow>
  )
}

export default MusicLibrary