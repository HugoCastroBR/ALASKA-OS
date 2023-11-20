'use client'
import { Button, FileButton, Loader, Progress, Slider } from '@mantine/core'
import React, { useEffect } from 'react'
import CustomText from '../atoms/CustomText'
import Image from 'next/image'
import { truncateText } from '@/utils/text'
import {  base64ToFile, convertSizeToKBMBGB, getExtension, uuid } from '@/utils/file'
import useFS from '@/hooks/useFS'
import { ApiError } from 'next/dist/server/api-utils'
import { secondsToMinutes } from '@/utils/date'
import { MusicItemProps, MusicProps } from '@/types/programs'
import MusicItem from '../molecules/MusicItem'
import useStore from '@/hooks/useStore'
import { AddMusic, AddToQueue, SetCurrentMusic, SetIsPaused, SetIsPlaying, SetProgress } from '@/store/actions'

function MusicPlayer() {

  const { fs } = useFS()
  const {states, dispatch} = useStore()

  const [musicCurrentTime, setMusicCurrentTime] = React.useState(0)
  const [currentVolume, setCurrentVolume] = React.useState(0.5)
  const [searchInputValue, setSearchInputValue] = React.useState('')
  const [queue, setQueue] = React.useState<MusicProps[]>([])



  useEffect(() => {
    LoadMusicFiles()
  }, [fs])








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
              })
            })
          })

        })
      }
    }

  }

  




  const LoadMusicFiles = () => {
    console.log('Loading Musics')

    
    fs?.readdir('/Musics', (err, folders) => {
      if (err) throw err
      if (folders?.length === 0) return
      folders?.map((folder) => {
        let MusicToRender = {} as MusicItemProps
        fs?.readFile(`/Musics/${folder}/about.txt`, 'utf8', (err, data) => {
          if (err) throw err
          if (data) {
            const aboutJson = JSON.parse(data)
            MusicToRender.artist = aboutJson.artist
            MusicToRender.title = aboutJson.title
          }
        })
        fs?.readFile(`/Musics/${folder}/image.png`, 'utf8', (err, data) => {
          if (err) throw err
          if (data) {
            MusicToRender.cover = data
          }
        })
        fs?.readFile(`/Musics/${folder}/music.mp3`, 'utf8', (err, data) => {
          if (err) throw err
          if (data) {
            const musicFile = base64ToFile(data, {
              fileName: 'music.mp3',
              fileType: 'audio/mpeg',
            })
            MusicToRender.musicFile = musicFile
            MusicToRender.duration = 213
            setIsLoading(false)
            dispatch(AddMusic(MusicToRender))
          }
        })
      })
    })
  }
  

  

  const [audioElement, setAudioElement] = React.useState<HTMLAudioElement | null>(null)

  useEffect(() => {
    if(!states.Musics.isPaused){
      setAudioElement((audioElement) => {
        audioElement?.play()
        return audioElement
      })
    }else{
      setAudioElement((audioElement) => {
        audioElement?.pause()
        return audioElement
      })
    }
  }, [states.Musics.isPaused])
  const HandlerPlayMusic = (music:MusicProps) => {
    console.log('Play Music')
    dispatch(SetCurrentMusic({
      ...music,
      cover: `data:image/png;base64,${music.cover}`|| '/assets/icons/Alaska.png',
    }))
    // setMusicDurationTime(music.duration)
    setMusicCurrentTime(0)
    
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
        console.log('Music Ended')
        dispatch(SetIsPlaying(false))
        dispatch(SetIsPaused(true))
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

// audioElement.ontimeupdate = (ev) => {
//       setMusicCurrentTime(audioElement.currentTime)
//       dispatch(SetProgress((audioElement.currentTime / music.duration) * 100))
//     }


  // const EverySecondAddToMusicCurrentTime = () => {
  //   setInterval(() => {
  //     calculateMusicCurrentTime()
  //   }, 1000)
  // }



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
    return(
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
    <div
      className='absolute w-1/2 h-1/2 top-1/4 left-1/4
      flex flex-col overflow-hidden rounded-lg bg-white'
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
        <div className='w-full h-5/6 flex pt-1 px-1'>
          <div className='w-3/12 h-full  flex-col items-start justify-start'>
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
                states.Musics.musics.map((musicItem,index) => {
                  return(
                    <MusicItem
                    key={index}
                    {...musicItem}
                    onClick={(music) => {
                      dispatch(AddToQueue(music))
                    }}
                    />
                  )
                })
              }
            </div>
          </div>
          <div className='w-6/12 h-full flex flex-col px-2 pt-1 '>
            <div className='pb-1 flex h-8 w-full justify-center items-center'>
              <input
                type='text'
                className='w-2/3 h-8 border border-slate-300 rounded-md px-2 outline-none'
                placeholder='Search'
                value={searchInputValue}
                onChange={(e) => setSearchInputValue(e.target.value)}
                autoFocus
              />
            </div>
            <div className='w-full h-full overflow-x-hidden overflow-y-auto flex flex-wrap  pt-2'>
              
{/* TODOOoooo Render Musics */}

            </div>
          </div>
          <div className='w-3/12 h-full'>
            <div className='
              w-full h-10 flex justify-center items-center
              border-b border-slate-300 -ml-0.5
            '>
              <CustomText
                text='Queue'
                className='text-xl font-semibold'
              />
            </div>
            <div className='w-full h-[calc(100%-40px)] overflow-x-hidden overflow-y-auto'>
              
              {
                states.Musics.queue.map((music) => {
                  return(
                    <MusicItem
                    {...music}
                    onClick={(music) => {
                      HandlerPlayMusic(music)
                    }}
                    />
                  )
                })
              }
            </div>
          </div>
        </div>
        <div className='w-full h-1/6 flex justify-between px-2 py-1 items-center'>
          <div className='w-3/12  h-full flex justify-evenly items-center'>
            <div className='w-1/3 h-16  flex justify-center items-center'>
              <div className='w-16 h-16 overflow-hidden rounded'>
                <Image
                  src={states.Musics.currentMusic.cover || '/assets/icons/Alaska.png'}
                  alt='music'
                  height={64}
                  width={64}
                />
              </div>
            </div>
            <div className='h-16 w-2/3 flex flex-col items-start px-px pr-1 justify-start'>
              <CustomText
                text={truncateText(states.Musics.currentMusic.title , 18)}
                className='text-sm font-semibold'
              />
              <CustomText
                text={truncateText(states.Musics.currentMusic.artist , 16)}
                className='text-sm mt-0.5'
              />

            </div>
          </div>
          <div className='w-6/12 h-full flex flex-col  items-center'>
            <div className='w-full h-3/5 flex justify-center items-center'>

              <span
                className='i-mdi-skip-previous text-4xl mx-1 cursor-pointer
              hover:bg-slate-500 transition-all duration-300 ease-in-out'
                onClick={() => { }}
              />

              <div className='
              bg-slate-800 mx-1 h-8 w-8 flex justify-center items-center rounded-full
              cursor-pointer hover:bg-slate-500 transition-all duration-300 ease-in-out
              '
                onClick={() => {
                  if (states.Musics.isPaused) {
                    dispatch(SetIsPaused(false))
                  } else {
                    dispatch(SetIsPaused(true))
                  }
                }}
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
                onClick={() => { }}
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
                  color='blue'
                  h={6}
                  radius={6}
                />
              </div>
              <div className='w-1/12 flex justify-center'>
                <CustomText
                  text={secondsToMinutes(states.Musics.currentMusic.duration)}
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
                value={currentVolume * 100}
              />
            </div>
          </div>
        </div>
      </div>


    </div>
  )
}

export default MusicPlayer