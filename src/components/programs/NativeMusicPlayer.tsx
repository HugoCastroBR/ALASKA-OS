import { secondsToMinutes } from '@/utils/date'
import { Slider, Progress } from '@mantine/core'
import React, { useEffect, useRef } from 'react'
import CustomText from '../atoms/CustomText'
import useFS from '@/hooks/useFS'
import { convertBase64ToFile, getExtension, getLastPathSegment } from '@/utils/file'
import { programProps } from '@/types/programs'
import DefaultWindow from '../containers/DefaultWindow'
import useStore from '@/hooks/useStore'

const NativeMusicPlayer = ({
  tab,
  window
}:programProps) => {

  const {fs} = useFS()
  const {states} = useStore()

  const [isPaused, setIsPaused] = React.useState(true)
  const [MusicVolume, setMusicVolume] = React.useState(1)
  const [musicDuration, setMusicDuration] = React.useState(0)
  const [musicCurrentTime, setMusicCurrentTime] = React.useState(0)
  const [isMusicPlaying, setIsMusicPlaying] = React.useState(false)
  const [audioElement, setAudioElement] = React.useState<HTMLAudioElement | null>(null)



  const [musicBase64, setMusicBase64] = React.useState('')
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    loadMusic();
  }, [fs]);

  useEffect(() => {
    if (audioElement) {
      audioElement.volume = MusicVolume * states.System.globalVolumeMultiplier;
    }
  }, [MusicVolume,states.System.globalVolumeMultiplier]);

  const loadMusic = () => {
    if (!tab?.value) return;
    fs?.readFile(tab?.value, 'utf8', (err, data) => {
      if (err) {
        console.log(err)
      }
      if (data) {
        setMusicBase64(data)
        return;
      }
    });
  };

  const handlerPauseMusic = async () => {
    if (isPaused) {
      audioRef.current?.play();
      setIsPaused(false);
      return;
    } else {
      audioRef.current?.pause();
      setIsPaused(true);
      return;
    }
  };


  const handlerPlayMusic = async () => {
    if (isMusicPlaying) {
      handlerPauseMusic();
      return;
    }

    const loadAudio = await convertBase64ToFile(musicBase64, getLastPathSegment(tab?.value || ''), getExtension(tab?.value || '') || '');
    const audio = URL.createObjectURL(loadAudio.file);

    const newAudioElement = new Audio(audio);

    newAudioElement.addEventListener('loadeddata', () => {
      setMusicDuration(newAudioElement.duration || 0);
      setIsMusicPlaying(true);
      setIsPaused(false);
      newAudioElement.play();
    });

    newAudioElement.addEventListener('timeupdate', () => {
      setMusicCurrentTime(newAudioElement.currentTime || 0);
    });

    newAudioElement.addEventListener('ended', () => {
      setIsMusicPlaying(false);
      setIsPaused(true);
    });

    setAudioElement(newAudioElement);
    audioRef.current = newAudioElement;
  };


  const MusicVisualizer = () => {

    return (

      
      <div className='w-full h-full flex justify-center items-center'>
        <span className='i-mdi-music text-6xl mb-8' 
        style={{
          color: states.Settings.settings.system.systemTextColor
        }}
        />
      </div>
    )
  }
  

  return (
    <DefaultWindow
      currentWindow={window}
      currentTab={tab}
      title={tab?.ficTitle || getLastPathSegment(tab?.value || '') || 'Music Player'}
      uuid={tab?.uuid || ''}
      onClose={() => {
        setIsPaused(true);
        setIsMusicPlaying(false);
        setMusicVolume(0);

        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }

        setAudioElement(null);
      }}
      onMinimize={() => { }}
      className='w-2/6 h-2/5 '
    >
      <div className='h-full w-full flex flex-col justify-center items-center'
      style={{
        backgroundColor: states.Settings.settings.system.systemBackgroundColor
      }}
      >
        <MusicVisualizer />
      </div>
      <div
          className={`
          absolute bottom-0 w-full h-16 
          flex-col 
        `}>
          <div className='w-full h-3/5 flex justify-center items-center'>

            <span
              className='i-mdi-skip-previous text-4xl mx-1 cursor-not-allowed
            transition-all duration-300 ease-in-out'
            style={{
              color: states.Settings.settings.system.systemTextColor
            }}
            />


            <div className='
            bg-slate-800 mx-1 h-8 w-8 flex justify-center items-center rounded-full
            cursor-pointer hover:bg-slate-500 transition-all duration-300 ease-in-out
            '

            >
              {!isPaused ?
                <span
                  className='i-mdi-pause text-2xl cursor-pointer'
                  onClick={() => handlerPlayMusic()}
                  style={{
                    color: states.Settings.settings.system.systemTextColor
                  }}
                />
                :
                <span
                  className='i-mdi-play text-2xl cursor-pointer'
                  onClick={() => handlerPlayMusic()}
                  style={{
                    color: states.Settings.settings.system.systemTextColor
                  }}
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
            <div className='w-2/12 h-full flex justify-center items-center  '>
              {/* <span className='i-mdi-todo-add text-xl cursor-pointer' /> */}
            </div>
            <div className='w-1/12 flex justify-center'>
              <CustomText
                text={secondsToMinutes(musicCurrentTime)}
                className='text-xs'
                style={{
                  color: states.Settings.settings.system.systemTextColor
                }}
              />
            </div>
            <div className='w-6/12'>
              <Progress
                value={(musicCurrentTime * 100) / musicDuration}
                color='blue'
                h={6}
                radius={6}
              />
            </div>
            <div className='w-1/12 flex justify-center'>
              <CustomText
                text={secondsToMinutes(musicDuration)}
                className='text-xs'
                style={{
                  color: states.Settings.settings.system.systemTextColor
                }}
              />
            </div>
            <div
              className='w-2/12 h-full flex justify-end cursor-pointer items-center mb-1'
            >
              <div className='w-1/6 h-full flex justify-center items-center mr-0.5'>
                <span className='i-mdi-volume-high text-xl cursor-pointer' 
                style={{
                  color: states.Settings.settings.system.systemTextColor
                }}
                />
              </div>
              <Slider
                h={6}
                w={'80%'}
                color={states.Settings.settings.system.systemTextColor}
                value={Number((MusicVolume * 100).toFixed(0))}
                onChange={(value) => {
                  setMusicVolume(value / 100)
                }}
              />
            </div>
          </div>
        </div>
    </DefaultWindow>
  )
}

export default NativeMusicPlayer