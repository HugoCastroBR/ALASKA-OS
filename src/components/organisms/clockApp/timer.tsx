import CustomText from '@/components/atoms/CustomText'
import useStore from '@/hooks/useStore'
import { CallNotification } from '@/store/actions'
import { rgbaToHex } from '@/utils/style'
import { Carousel } from '@mantine/carousel'
import { ActionIcon, Center, Divider, RingProgress, rem } from '@mantine/core'
import { TimeInput } from '@mantine/dates'
import { IconChevronUp, IconChevronDown, IconClock } from '@tabler/icons-react'
import React, { useEffect, useRef, useState } from 'react'

const TimerTab = () => {

  const { states, dispatch } = useStore()

  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [totalTime, setTotalTime] = useState<number>(1);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [timeToShow, setTimeToShow] = useState<string>('00:00:00');
  const [alarmHour, setAlarmHour] = useState<number>(0);
  const [alarmMinute, setAlarmMinute] = useState<number>(0);
  const [alarmSecond, setAlarmSecond] = useState<number>(0);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const tick = () => {
      setCurrentTime((prevTime) => prevTime + 1);
      generateProgress();
      convertRemainingTimeToTimeToShow();
    };

    if (isRunning) {
      intervalId = setInterval(tick, 1000);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [isRunning, progress, timeToShow]);

  useEffect(() => {
    if (currentTime >= totalTime) {
      setIsRunning(false);
      setCurrentTime(0);
      setProgress(0);
      setTimeToShow('00:00:00');
      handlerCallAlarm()

    }
  }, [currentTime, totalTime]);

  const handleStart = () => {
    if (!isRunning) {
      setIsRunning(true);
      const totalSeconds = alarmHour * 3600 + alarmMinute * 60 + alarmSecond;
      setTotalTime(totalSeconds);
    }
  };

  const handlerCallAlarm = () => {
    dispatch(CallNotification({
      title: 'Timer',
      message: 'Timer is ringing, it is time',
      withCloseButton: true,
    }))
    playAlarmAudio()
  }
  
  const playAlarmAudio = () => {
    const audio = new Audio('assets/sounds/notification.wav');
    audio.volume = 1 * states.System.globalVolumeMultiplier;
    audio.play();
  }

  const handleStop = () => {
    setIsRunning(false);
    setCurrentTime(0);
    setProgress(0);
    setTimeToShow('00:00:00');
  };

  const generateProgress = () => {
    const calculatedProgress = (currentTime / totalTime) * 100;
    setProgress(calculatedProgress);
  };

  const convertRemainingTimeToTimeToShow = () => {
    const remainingTime = totalTime - currentTime;
    const hour = Math.floor(remainingTime / 3600);
    const minute = Math.floor((remainingTime % 3600) / 60);
    const second = Math.floor(remainingTime % 60);

    const hourString = hour > 0 ? `${hour < 10 ? '0' + hour : hour}:` : '00:';
    const minuteString = minute > 0 ? `${minute < 10 ? '0' + minute : minute}:` : '00:';
    const secondString = second > 0 ? `${second < 10 ? '0' + second : second}` : '00';

    setTimeToShow(`${hourString}${minuteString}${secondString}`);
  };



  const ref = useRef<HTMLInputElement>(null);

  const pickerControl = (
    <ActionIcon variant="subtle" color="gray" onClick={() => ref.current?.showPicker()}>
      <IconClock style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
    </ActionIcon>
  );


  return (
    <div
      className='w-full h-full flex flex-col justify-center items-center'
    >
      {!isRunning
        ?
        <div
          className='w-full flex justify-center items-center'
          style={{
            height: '250px'
          }}
        >
          <div
            className='mx-2'
          >
            <TimeInput
            size='lg'
            label='Select time (12h format): '
            placeholder='Select time'
            withSeconds
            className='outline-none'
            ref={ref} 
            onChange={(e) => {
              const [hour, minute, seconds] = e.target.value.split(':');
              setAlarmHour(parseInt(hour));
              setAlarmMinute(parseInt(minute));
              setAlarmSecond(parseInt(seconds));
            }}
            rightSection={pickerControl}
            styles={{
              input: {
                backgroundColor: states.Settings.settings.system.systemBackgroundColor,
                color: states.Settings.settings.system.systemTextColor,
              },
              label: {
                color: states.Settings.settings.system.systemTextColor,
              },
              error: {
                color: states.Settings.settings.system.systemTextColor,
              },

            }}
          />
          </div>
        </div>
        :
        <div
          className='w-full flex justify-center items-center'
          style={{
            height: '250px'
          }}
        >
          <RingProgress
            sections={[{ value: progress, color: states.Settings.settings.system.systemHighlightColor }]}
            size={200}
            label={
              <Center>
                <CustomText
                  text={timeToShow}
                  className='font-medium !text-xl select-none cursor-default'
                  style={{
                    color: states.Settings.settings.system.systemTextColor
                  }}
                />
              </Center>
            }
          />

        </div>
      }
      <div className='w-full h-1/3 flex justify-center items-start pt-8 px-2'>
        <div
          className='w-12 h-12 flex rounded-full justify-center items-center mx-2
        backdrop-filter backdrop-blur-sm shadow-2xl drop-shadow-sm
        hover:filter hover:brightness-150 hover:drop-shadow-md 
        transition-all duration-300 ease-in-out cursor-pointer
        '
          style={{
            backgroundColor: states.Settings.settings.system.systemBackgroundColor
          }}
          onClick={() => {
            if(isRunning){
              handleStop()
            }
            else{
              handleStart()
            }
          }}
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

export default TimerTab