import CustomText from '@/components/atoms/CustomText'
import useStore from '@/hooks/useStore'
import { rgbaToHex } from '@/utils/style'
import React, { useEffect, useState } from 'react'

const StopwatchTab = () => {

  const { states, dispatch } = useStore()
  const [stopwatchTime, setStopwatchTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [intervalId, setIntervalId] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (isRunning) {
      const id = window.setInterval(() => {
        setStopwatchTime((prevTime) => prevTime + 1);
      }, 1000);

      setIntervalId(id);
    } else {
      clearInterval(intervalId);
      setIntervalId(undefined);
    }

    return () => clearInterval(intervalId);
  }, [isRunning]);

  const handlerToggleStopwatch = () => {
    setIsRunning((prevState) => !prevState);
  };

  const handlerResetStopwatch = () => {
    setStopwatchTime(0);
    setIsRunning(false);
  };


const formatTime = (timeInSeconds: number): string => {
  const hours = Math.floor(timeInSeconds / 3600);
  const minutes = Math.floor((timeInSeconds % 3600) / 60);
  const seconds = timeInSeconds % 60;

  const formatTwoDigits = (value: number): string => value.toString().padStart(2, '0');

  return `${formatTwoDigits(hours)}:${formatTwoDigits(minutes)}:${formatTwoDigits(seconds)}`;
};


  const formatNumberToTime = (number: number): string => {
    const hours = Math.floor(number / 3600)
    const minutes = Math.floor((number % 3600) / 60)
    const seconds = Math.floor(number % 60)

    const hoursString = hours > 0 ? `${hours < 10 ? '0' + hours : hours}:` : '00:'
    const minutesString = minutes > 0 ? `${minutes < 10 ? '0' + minutes : minutes}:` : '00:'
    const secondsString = seconds > 0 ? `${seconds < 10 ? '0' + seconds  : seconds}` : '00'

    return `${hoursString}${minutesString}${secondsString}`
  }

  return (
    <div
      className='w-full h-full flex flex-col justify-center items-center'
    >
      <div className='w-full h-2/3'>
        <div className='w-full h-full flex justify-center items-center'>
          <CustomText
            text={formatNumberToTime(stopwatchTime)}
            className='!text-6xl font-medium'
            style={{
              color: states.Settings.settings.system.systemTextColor
            }}
          />
        </div>
      </div>
      <div className='w-full h-1/3 flex justify-center items-start pt-8 px-2'>
      <div 
      className={`
      w-12 h-12 flex rounded-full justify-center items-center mx-2
      backdrop-filter backdrop-blur-sm shadow-2xl drop-shadow-sm
      hover:filter hover:brightness-150 hover:drop-shadow-md 
      transition-all duration-300 ease-in-out cursor-pointer
      `}
      style={{
        backgroundColor: states.Settings.settings.system.systemBackgroundColor,
      }}
      onClick={handlerResetStopwatch}
      >
          <span
            className='i-mdi-restart text-4xl'
            style={{
              color: states.Settings.settings.system.systemTextColor
            }}
          />
        </div>
        <div 
        className='w-12 h-12 flex rounded-full justify-center items-center mx-2
        backdrop-filter backdrop-blur-sm shadow-2xl drop-shadow-sm
        hover:filter hover:brightness-150 hover:drop-shadow-md 
        transition-all duration-300 ease-in-out cursor-pointer
        '
        style={{
          backgroundColor: states.Settings.settings.system.systemBackgroundColor
        }}
        onClick={handlerToggleStopwatch}
        >
          {
            isRunning ?
              <span
                className='i-mdi-pause text-4xl'
                style={{
                  color: states.Settings.settings.system.systemTextColor
                }}
              />
              :
              <span
                className='i-mdi-play text-4xl'
                style={{
                  color: states.Settings.settings.system.systemTextColor
                }}
              />
          }
        </div>
      </div>
    </div>
  )
}

export default StopwatchTab