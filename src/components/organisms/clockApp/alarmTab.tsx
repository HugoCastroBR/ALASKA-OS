import CustomText from '@/components/atoms/CustomText';
import useStore from '@/hooks/useStore';
import React, { useEffect, useRef, useState } from 'react';
import { ActionIcon, Button, Divider, rem } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import { IconChevronDown, IconChevronUp, IconClock } from '@tabler/icons-react';
import { TimeInput } from '@mantine/dates';
import { format12hourTo24hour } from '@/utils/date';

const AlarmTab: React.FC = () => {
  const { states, dispatch } = useStore();
  const [alarmHour, setAlarmHour] = useState<number>(0);
  const [alarmMinute, setAlarmMinute] = useState<number>(0);
  const [alreadySetAlarm, setAlreadySetAlarm] = useState<boolean>(false);


  const ref = useRef<HTMLInputElement>(null);

  const pickerControl = (
    <ActionIcon variant="subtle" color="gray" onClick={() => ref.current?.showPicker()}>
      <IconClock style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
    </ActionIcon>
  );

  useEffect(() => {
    verifyIfAlarmIsSet();
  }	, []);

  const verifyIfAlarmIsSet = () => {
    const alarm = localStorage.getItem('alarm');
    if (alarm) {
      const [hour, minute] = alarm.split(':');
      setAlarmHour(parseInt(hour));
      setAlarmMinute(parseInt(minute));
      setAlreadySetAlarm(true);
    }
  }

  return (
    <div className='w-full h-full flex flex-col'>
      <div
        className='w-full flex justify-center items-center'
        style={{
          height: '250px',
        }}
      >
        <div className='mr-2'>
          {
            alreadySetAlarm && 
            <CustomText
              text={`You have already set an alarm for ${alarmHour}:${alarmMinute}`}
              className='font-medium !text-xs'
              style={{
                color: states.Settings.settings.system.systemTextColor,
              }}
            />
          }
          <TimeInput
            size='lg'
            label='Select time (12h format): '
            placeholder='Select time'
            withSeconds={false}
            className='outline-none'
            ref={ref} 
            onChange={(e) => {
              verifyIfAlarmIsSet();
              const [hour, minute] = e.target.value.split(':');
              setAlarmHour(parseInt(hour));
              setAlarmMinute(parseInt(minute));
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
      <div className='w-full h-1/3 flex justify-center items-center -mt-12'>
        <Button
          color={states.Settings.settings.system.systemTextColor}
          onClick={() => {
            
            localStorage.setItem('alarm', `${alarmHour}:${alarmMinute}`);
            // localStorage.setItem('alarm', `${formattedAlarmHour}:${formattedAlarmMinute}`);
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
