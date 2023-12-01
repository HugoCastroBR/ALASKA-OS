import CustomText from '@/components/atoms/CustomText'
import useStore from '@/hooks/useStore'
import { CallNotification } from '@/store/actions'
import { rgbaToHex } from '@/utils/style'
import { Carousel } from '@mantine/carousel'
import { Center, Divider, RingProgress } from '@mantine/core'
import { IconChevronUp, IconChevronDown } from '@tabler/icons-react'
import React, { useEffect, useState } from 'react'

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



  const generateCarouselHourItems = () => {
    const items = [
      '00', '01', '02', '03', '04', '05', '06', '07', '08', '09',
      '10', '11', '12', '13', '14', '15', '16', '17', '18', '19',
      '20', '21', '22', '23'
    ]

    return (
      items.map((item, index) => {
        return (
          <div
            key={index}
            className='w-full h-full flex justify-center items-center'>
            <CustomText
              text={item}
              className='font-medium !text-4xl select-none cursor-default'
              style={{
                color: states.Settings.settings.system.systemTextColor
              }}
            />
          </div>
        )
      })
    )
  }

  const generateCarouselMinuteItems = () => {
    const items = [
      '00', '01', '02', '03', '04', '05', '06', '07', '08', '09',
      '10', '11', '12', '13', '14', '15', '16', '17', '18', '19',
      '20', '21', '22', '23', '24', '25', '26', '27', '28', '29',
      '30', '31', '32', '33', '34', '35', '36', '37', '38', '39',
      '40', '41', '42', '43', '44', '45', '46', '47', '48', '49',
      '50', '51', '52', '53', '54', '55', '56', '57', '58', '59'
    ]

    return (
      items.map((item, index) => {
        return (
          <div
            key={index}
            className='w-full h-full flex justify-center items-center'>
            <CustomText
              text={item}
              className='font-medium !text-4xl select-none cursor-default'
              style={{
                color: states.Settings.settings.system.systemTextColor
              }}
            />
          </div>
        )
      })
    )
  }

  const generateCarouselSecondItems = () => {
    const items = [
      '00', '01', '02', '03', '04', '05', '06', '07', '08', '09',
      '10', '11', '12', '13', '14', '15', '16', '17', '18', '19',
      '20', '21', '22', '23', '24', '25', '26', '27', '28', '29',
      '30', '31', '32', '33', '34', '35', '36', '37', '38', '39',
      '40', '41', '42', '43', '44', '45', '46', '47', '48', '49',
      '50', '51', '52', '53', '54', '55', '56', '57', '58', '59'
    ]

    return (
      items.map((item, index) => {
        return (
          <div
            key={index}
            className='w-full h-full flex justify-center items-center'>
            <CustomText
              text={item}
              className='font-medium !text-4xl select-none cursor-default'
              style={{
                color: states.Settings.settings.system.systemTextColor
              }}
            />
          </div>
        )
      })
    )
  }




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
            <Carousel
              slideSize="100%"
              height={125}
              orientation="vertical"
              slideGap="xs"
              dragFree
              onSlideChange={setAlarmHour}
              loop
              previousControlIcon={
                <IconChevronUp
                  size='25px'
                  style={{
                    color: states.Settings.settings.system.systemTextColor
                  }}
                />
              }
              nextControlIcon={
                <IconChevronDown
                  size='25px'
                  style={{
                    color: states.Settings.settings.system.systemTextColor
                  }}
                />
              }
              withControls={true}
              styles={{
                controls: {
                  height: 230,
                },
                control: {
                  marginBottom: 65,
                  marginTop: -40,
                  backgroundColor: states.Settings.settings.system.systemBackgroundColor,
                  color: states.Settings.settings.system.systemTextColor,
                  borderRadius: 4,
                  border: '1px solid rgba(255,255,255,0.1)',
                  width: 50,
                  marginLeft: -12.5,
                },
              }}
            >
              {generateCarouselHourItems()}
            </Carousel>
          </div>
          <Divider
            orientation='vertical'
            h={150}
            mt={50}
            color='rgba(255, 255, 255, 0.2)'
          />
          <div
            className='mx-2'
          >
            <Carousel
              slideSize="100%"
              height={125}
              orientation="vertical"
              slideGap="xs"
              onSlideChange={setAlarmMinute}
              dragFree
              loop
              previousControlIcon={
                <IconChevronUp
                  size='25px'
                  style={{
                    color: states.Settings.settings.system.systemTextColor
                  }}
                />
              }
              nextControlIcon={
                <IconChevronDown
                  size='25px'
                  style={{
                    color: states.Settings.settings.system.systemTextColor
                  }}
                />
              }
              withControls={true}
              styles={{
                controls: {
                  height: 230,
                },
                control: {
                  marginBottom: 65,
                  marginTop: -40,
                  backgroundColor: states.Settings.settings.system.systemBackgroundColor,
                  color: states.Settings.settings.system.systemTextColor,
                  borderRadius: 4,
                  border: '1px solid rgba(255,255,255,0.1)',
                  width: 50,
                  marginLeft: -12.5,
                },
              }}
            >
              {generateCarouselMinuteItems()}
            </Carousel>
          </div>
          <Divider
            orientation='vertical'
            h={150}
            mt={50}
            color='rgba(255, 255, 255, 0.2)'
          />
          <div
            className='mx-2'
          >
            <Carousel
              slideSize="100%"
              height={125}
              orientation="vertical"
              slideGap="xs"
              onSlideChange={setAlarmSecond}
              dragFree
              loop
              previousControlIcon={
                <IconChevronUp
                  size='25px'
                  style={{
                    color: states.Settings.settings.system.systemTextColor
                  }}
                />
              }
              nextControlIcon={
                <IconChevronDown
                  size='25px'
                  style={{
                    color: states.Settings.settings.system.systemTextColor
                  }}
                />
              }
              withControls={true}
              styles={{
                controls: {
                  height: 230,
                },
                control: {
                  marginBottom: 65,
                  marginTop: -40,
                  backgroundColor: states.Settings.settings.system.systemBackgroundColor,
                  color: states.Settings.settings.system.systemTextColor,
                  borderRadius: 4,
                  border: '1px solid rgba(255,255,255,0.1)',
                  width: 50,
                  marginLeft: -12.5,
                },
              }}
            >
              {generateCarouselSecondItems()}
            </Carousel>
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