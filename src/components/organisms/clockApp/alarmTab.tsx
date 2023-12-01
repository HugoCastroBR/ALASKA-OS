import CustomText from '@/components/atoms/CustomText';
import useStore from '@/hooks/useStore';
import React, { useState } from 'react';
import { Button, Divider } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';

const AlarmTab: React.FC = () => {
  const { states, dispatch } = useStore();
  const [alarmHour, setAlarmHour] = useState<number>(0);
  const [alarmMinute, setAlarmMinute] = useState<number>(0);

  const generateCarouselItems = (maxValue: number, setValue: React.Dispatch<React.SetStateAction<number>>) => {
    const items = Array.from({ length: maxValue + 1 }, (_, index) => index);

    return items.map((item, index) => (
      <div
        key={index}
        className='w-full h-full flex justify-center items-center'
        onClick={() => setValue(item)}
        style={{
          cursor: 'pointer',
        }}
      >
        <CustomText
          text={item.toString().padStart(2, '0')}
          className='font-medium !text-4xl select-none cursor-default'
          style={{
            color: states.Settings.settings.system.systemTextColor,
          }}
        />
      </div>
    ));
  };

  return (
    <div className='w-full h-full flex flex-col'>
      <div
        className='w-full flex justify-center items-center'
        style={{
          height: '250px',
        }}
      >
        <div className='mr-2'>
          <Carousel
            slideSize='100%'
            height={125}
            orientation='vertical'
            slideGap='xs'
            dragFree
            onSlideChange={setAlarmHour}
            loop
            previousControlIcon={
              <IconChevronUp
                size='25px'
                style={{
                  color: states.Settings.settings.system.systemTextColor,
                }}
              />
            }
            nextControlIcon={
              <IconChevronDown
                size='25px'
                style={{
                  color: states.Settings.settings.system.systemTextColor,
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
            {generateCarouselItems(23, setAlarmHour)}
          </Carousel>
        </div>
        <Divider orientation='vertical' h={150} mt={50} color='rgba(255, 255, 255, 0.2)' />
        <div className='ml-2'>
          <Carousel
            slideSize='100%'
            height={125}
            orientation='vertical'
            slideGap='xs'
            onSlideChange={setAlarmMinute}
            dragFree
            loop
            previousControlIcon={
              <IconChevronUp
                size='25px'
                style={{
                  color: states.Settings.settings.system.systemTextColor,
                }}
              />
            }
            nextControlIcon={
              <IconChevronDown
                size='25px'
                style={{
                  color: states.Settings.settings.system.systemTextColor,
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
            {generateCarouselItems(59, setAlarmMinute)}
          </Carousel>
        </div>
      </div>
      <div className='w-full h-1/3 flex justify-center items-center'>
        <Button
          color={states.Settings.settings.system.systemTextColor}
          onClick={() => {
            const formattedAlarmHour = alarmHour.toString().padStart(2, '0');
            const formattedAlarmMinute = alarmMinute.toString().padStart(2, '0');
            localStorage.setItem('alarm', `${formattedAlarmHour}:${formattedAlarmMinute}`);
          }}
        >
          <CustomText
            text='Set Alarm'
            className='font-medium !text-lg'
            style={{
              color: states.Settings.settings.system.systemTextColor,
            }}
          />
        </Button>
      </div>
    </div>
  );
};

export default AlarmTab;
