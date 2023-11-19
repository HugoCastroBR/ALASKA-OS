import { Progress, Slider } from '@mantine/core'
import React, { useEffect } from 'react'
import CustomText from '../atoms/CustomText'
import Image from 'next/image'
import { truncateText } from '@/utils/text'

function Music() {

  const [isPlaying, setIsPlaying] = React.useState(false)
  const [currentSongTitle, setCurrentSongTitle] = React.useState(' Song Title')
  const [currentArtistName, setCurrentArtistName] = React.useState('Artist Name')
  const [currentCover, setCurrentCover] = React.useState('/assets/icons/zero.png')
  const [musicDurationTime, setMusicDurationTime] = React.useState(213)
  const [musicCurrentTime, setMusicCurrentTime] = React.useState(193)
  const [currentProgress, setCurrentProgress] = React.useState(0)
  const [currentVolume, setCurrentVolume] = React.useState(0.5)

  const calculateProgress = () => {
    const progress = (musicCurrentTime / musicDurationTime) * 100
    setCurrentProgress(progress)
  }

  useEffect(() => {
    calculateProgress()
  }, [])

  const transformTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    let seconds = `${Math.floor(time % 60)}`
    if(Number(seconds) < 10){
      seconds = `0${seconds}`
    }
    return `${minutes}:${seconds}`
  }



  return (
    <div
      className='absolute w-1/2 h-1/2 top-1/4 left-1/4
      flex flex-col overflow-hidden rounded-lg bg-white'
    >
      <div className='flex flex-col w-full h-full'>
        <div className='w-full h-5/6 bg-blue-50 flex'>
          <div>
            LIBRARY
          </div>
          <div>
            <div>
              HOME
            </div>
          </div>
          <div>
            QUEUE
            </div>
        </div>
        <div className='w-full h-1/6 flex justify-between px-2 py-1 items-center'>
          <div className='w-3/12  h-full flex justify-evenly items-center'>
            <div className='w-1/3 h-16  flex justify-center items-center'>
              <div className='w-16 h-16 overflow-hidden rounded'>
                <Image
                  src={currentCover || '/assets/icons/Alaska.png'}
                  alt='music'
                  height={64}
                  width={64}
                />
              </div>
            </div>
            <div className='h-16 w-2/3 flex flex-col items-start px-px pr-1 justify-start'>
              <CustomText
                text={truncateText(currentSongTitle, 18)}
                className='text-sm font-semibold'
              />
              <CustomText
                text={truncateText(currentArtistName, 16)}
                className='text-sm mt-0.5'
              />

            </div>
          </div>
          <div className='w-6/12 h-full flex flex-col  items-center'>
            <div className='w-full h-3/5 flex justify-center items-center'>

              <span 
              className='i-mdi-skip-previous text-4xl mx-1 cursor-pointer
              hover:bg-slate-500 transition-all duration-300 ease-in-out' 
              onClick={() => {}}
              />

              <div className='
              bg-slate-800 mx-1 h-8 w-8 flex justify-center items-center rounded-full
              cursor-pointer hover:bg-slate-500 transition-all duration-300 ease-in-out
              '
              onClick={() => {}}
              >
              <span className='i-mdi-play text-2xl text-white cursor-pointer'/>
              </div>

              <span 
              className='i-mdi-skip-next text-4xl mx-1 cursor-pointer
              hover:bg-slate-500 transition-all duration-300 ease-in-out
              ' 
              onClick={() => {}}
              />
              
            </div>
            <div className='flex items-center justify-evenly h-2/5 w-full px-2'>
              <div className='w-1/12 flex justify-center'>
                <CustomText
                text={transformTime(musicCurrentTime)}
                className='text-xs'
                />
              </div>
              <div className='w-10/12 px-1'>
                <Progress
                value={currentProgress}
                color='blue'
                h={6}
                radius={6}
                />
              </div>
              <div className='w-1/12 flex justify-center'>
                <CustomText
                text={transformTime(musicDurationTime)}
                className='text-xs'
                />
                </div>
            </div>
          </div>
          <div className='w-3/12  flex h-full px-1 pl-4'>
            <div className='w-1/6 h-full flex justify-center items-center'>
              <span className='i-mdi-volume-high text-2xl cursor-pointer'/>
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

export default Music