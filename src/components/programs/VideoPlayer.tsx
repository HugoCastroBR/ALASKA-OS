import { secondsToMinutes } from '@/utils/date'
import { Loader, Progress, Slider } from '@mantine/core'
import React, { useEffect, useRef } from 'react'
import CustomText from '../atoms/CustomText'
import useFS from '@/hooks/useFS'
import DefaultWindow from '../containers/DefaultWindow'
import { programProps } from '@/types/programs'
import { convertFileExtensionToFileType, getExtension } from '@/utils/file'
import useStore from '@/hooks/useStore'

const VideoPlayer = ({
  tab,
  window
}:programProps) => {

  const { fs } = useFS()
  const {states, dispatch} = useStore()

  const [isPaused, setIsPaused] = React.useState(true)
  const [isFullScreen, setIsFullScreen] = React.useState(false)
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const [videoBase64, setVideoBase64] = React.useState('')
  const [videoDuration, setVideoDuration] = React.useState(0)
  const [videoCurrentTime, setVideoCurrentTime] = React.useState(0)
  const [videoVolume, setVideoVolume] = React.useState(1)
  const [isLoading, setIsLoading] = React.useState(true)

  const LoadVideo = () => {
    if(tab?.value === '/Desktop'){
      setIsLoading(false)
    }
    fs?.readFile(tab?.value || '', 'utf8', (err, data) => {
      if (err){
        setIsLoading(false)
        console.log(err)
      }
      if (data) {
        setVideoBase64(data)
        setIsLoading(false)
        return
      }
    })

  }

  const videoRef = useRef<HTMLVideoElement>(null)



  useEffect(() => {
    videoRef.current?.addEventListener('loadeddata', (e) => {
      setVideoDuration(videoRef.current?.duration || 0)
    })
    videoRef.current?.addEventListener('timeupdate', (e) => {
      setVideoCurrentTime(videoRef.current?.currentTime || 0)
    })
    videoRef.current?.addEventListener('ended', (e) => {
      setIsPaused(true)
    })

  }, [videoBase64])

  useEffect(() => {
    LoadVideo()
  }, [fs])


  const handlerPlayVideo = () => {
    setIsPaused(!isPaused)
    if (isPaused) {
      videoRef.current?.play()
    }
    else {
      videoRef.current?.pause()
    }
  }

  const handlerVolume = (volume: number) => {
    const videoElement = videoRef.current;

    if (videoElement) {
      videoElement.volume = volume;
    }
  }

  const NoVideoProvided = () => {
    return (
      <div className='w-full h-full flex flex-col justify-center items-center'>
        <span className='i-mdi-video-off-outline text-6xl  text-slate-600' />
        <CustomText
          text='No video provided'
          className='text-6xl text-slate-600 mt-2'
        />
      </div>
    )
  }

  if(isLoading){
    return (
      <DefaultWindow
        title={tab?.ficTitle || 'Video Player'}
        currentTab={tab}
        currentWindow={window}
        resizable
        uuid={tab?.uuid || ''}
        onClose={() => {
          setIsPaused(true)
          setIsFullScreen(false)
          setIsMenuOpen(true)
          setVideoCurrentTime(0)
          setVideoDuration(0)
          videoRef.current?.pause()
  
        }}
        onMaximize={() => { }}
        onMinimize={() => { }}
  
      >
        <div className='
          h-full w-full flex flex-col bg-white'>
          <div className='flex justify-center items-center w-full h-full bg-white'>
            <Loader size={64} />
          </div>
        </div>
      </DefaultWindow >
    )
  }

  return (
    <DefaultWindow
      title={tab?.ficTitle || 'Video Player'}
      currentTab={tab}
      currentWindow={window}
      resizable
      uuid={tab?.uuid || ''}
      onClose={() => {
        setIsPaused(true)
        setIsFullScreen(false)
        setIsMenuOpen(true)
        setVideoCurrentTime(0)
        setVideoDuration(0)
        videoRef.current?.pause()

      }}
      onMaximize={() => { }}
      onMinimize={() => { }}

    >
      <div className='
        h-full w-full flex flex-col bg-white'>
        <div className='flex justify-center items-center w-full h-full bg-white-100'>
          {tab.value === '/Desktop' 
          ?
          <NoVideoProvided />
          :
          <video
            className='w-full h-full bg-white'
            src={`data:${convertFileExtensionToFileType(getExtension(tab.value || ''))};base64,${videoBase64}`}
            ref={videoRef}
          />
          }
          
        </div>
        <div
          className={`
          absolute bottom-0 w-full h-20  
          ${!isMenuOpen ? `opacity-100 bg-white` : `opacity-0 hover:opacity-90 backdrop-filter bg-opacity-0`} 
          flex-col transition-all duration-600 ease-in-out 
        `}>
          <div className='w-full h-3/5 flex justify-center items-center'>

            <span
              className='i-mdi-skip-previous text-4xl mx-1 cursor-not-allowed
            bg-slate-300 transition-all duration-300 ease-in-out'
            />


            <div className='
            bg-slate-800 mx-1 h-8 w-8 flex justify-center items-center rounded-full
            cursor-pointer hover:bg-slate-500 transition-all duration-300 ease-in-out
            '

            >
              {!isPaused ?
                <span
                  className='i-mdi-pause text-2xl text-white cursor-pointer'
                  onClick={() => handlerPlayVideo()}
                />
                :
                <span
                  className='i-mdi-play text-2xl text-white cursor-pointer'
                  onClick={() => handlerPlayVideo()}
                />
              }

            </div>

            <span
              className='i-mdi-skip-next text-4xl mx-1 cursor-not-allowed
            bg-slate-300 transition-all duration-300 ease-in-out
          
              '
            />

          </div>
          <div className='flex items-center justify-evenly h-2/5 w-full px-2'>
            <div className='w-2/12 h-full flex justify-center items-center '>
              <div className='w-1/6 h-full flex justify-center items-center mr-0.5'>
                <span className='i-mdi-volume-high text-xl cursor-pointer' />
              </div>
              <Slider
                h={6}
                w={'80%'}
                color='black'
                value={Number(((videoVolume * 100) * states.System.globalVolumeMultiplier).toFixed(0))}
                onChange={(value) => {
                  handlerVolume(value / 100)
                  setVideoVolume(value / 100)
                }}
              />
            </div>
            <div className='w-1/12 flex justify-center'>
              <CustomText
                text={secondsToMinutes(videoCurrentTime)}
                className='text-xs'
              />
            </div>
            <div className='w-6/12'>
              <Progress
                value={(videoCurrentTime * 100) / videoDuration}
                color='blue'
                h={6}
                radius={6}
              />
            </div>
            <div className='w-1/12 flex justify-center'>
              <CustomText
                text={secondsToMinutes(videoDuration)}
                className='text-xs'
              />
            </div>
            <div
              className='w-2/12 flex justify-end cursor-pointer'
              onClick={() => {
                setIsFullScreen(!isFullScreen)
                setIsMenuOpen(!isMenuOpen)
              }}
            >
              {isFullScreen ?
                <span className='i-mdi-fullscreen-exit text-2xl' />
                :
                <span className='i-mdi-fullscreen text-2xl' />
              }

            </div>
          </div>
        </div>
      </div>
    </DefaultWindow >
  )
}

export default VideoPlayer