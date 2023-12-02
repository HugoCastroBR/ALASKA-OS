import React from 'react'
import { Tabs, rem } from '@mantine/core';
import { IconAlarm, IconClock, IconClockPlus , IconHourglass } from '@tabler/icons-react';
import CustomText from '../atoms/CustomText';
import useStore from '@/hooks/useStore';
import ClockTab from '../organisms/clockApp/clockTab';
import StopwatchTab from '../organisms/clockApp/stopwatchTab';
import AlarmTab from '../organisms/clockApp/alarmTab';
import TimerTab from '../organisms/clockApp/timer';
import DefaultWindow from '../containers/DefaultWindow';
import { programProps } from '@/types/programs';

const ClockApp = ({
  tab,
  AlaskaWindow,
}:programProps) => {


  const {states} = useStore()
  
  const iconStyle = { 
    width: rem(24),
    height: rem(24),
    
  };
  

  return (
    <DefaultWindow
      className='!w-1/4 !h-1/2'
      title='Clock App'
      currentTab={tab}
      currentWindow={AlaskaWindow}
      resizable
      uuid={tab.uuid}
      onClose={() => {}}
      onMinimize={() => {}}
    >
      <div className='w-full h-full'
        style={{
          background: states.Settings.settings.system.systemBackgroundColor,
          color: states.Settings.settings.system.systemTextColor
        }}
      >
        <Tabs 
        color={states.Settings.settings.system.systemHighlightColor}
        variant="default" 
        radius="md" 
        defaultValue="clock"
        className='w-full h-full'
        style={{
          background: states.Settings.settings.system.systemBackgroundColor,
        }}
        >
          <Tabs.List grow>
          <Tabs.Tab value="clock" 
            style={{
              backgroundColor: states.Settings.settings.system.systemBackgroundColor,
            }}
            leftSection={<IconClock 
              style={iconStyle} 
              color={states.Settings.settings.system.systemTextColor}
            />}>
              <CustomText
                text='Clock'
                className='font-medium text-lg mt-4'
                style={{
                  color: states.Settings.settings.system.systemTextColor
                }}
              />
            </Tabs.Tab>
            <Tabs.Tab value="alarm" 
            style={{
              backgroundColor: states.Settings.settings.system.systemBackgroundColor,
            }}
            leftSection={<IconAlarm 
              style={iconStyle} 
              color={states.Settings.settings.system.systemTextColor}
            />}>
              <CustomText
                text='Alarm'
                className='font-medium text-lg mt-4'
                style={{
                  color: states.Settings.settings.system.systemTextColor
                }}
              />
            </Tabs.Tab>
            <Tabs.Tab value="stopwatch" 
            style={{
              backgroundColor: states.Settings.settings.system.systemBackgroundColor,
            }}
            leftSection={<IconClockPlus 
              style={iconStyle} 
              color={states.Settings.settings.system.systemTextColor}
            />}>
              <CustomText
                text='Stopwatch'
                className='font-medium text-lg mt-4'
                style={{
                  color: states.Settings.settings.system.systemTextColor
                }}
              />
            </Tabs.Tab>
            <Tabs.Tab value="timer" 
            style={{
              backgroundColor: states.Settings.settings.system.systemBackgroundColor,
            }}
            leftSection={<IconHourglass 
              style={iconStyle} 
              color={states.Settings.settings.system.systemTextColor}
            />}>
              <CustomText
                text='Timer'
                className='font-medium text-lg mt-4'
                style={{
                  color: states.Settings.settings.system.systemTextColor
                }}
              />
            </Tabs.Tab>
          </Tabs.List>
          
          <Tabs.Panel 
          value="clock"
          className='w-full h-full'
          >
            <ClockTab/>
          </Tabs.Panel>
          <Tabs.Panel 
          value="alarm"
          className='w-full h-full'
          >
            <AlarmTab/>
          </Tabs.Panel>
          <Tabs.Panel 
          value="stopwatch"
          className='w-full h-full'
          >
            <StopwatchTab/>
          </Tabs.Panel>
          <Tabs.Panel 
          value="timer"
          className='w-full h-full'
          >
            <TimerTab/>
          </Tabs.Panel>


        </Tabs>
      </div>
    </DefaultWindow>
  )
}

export default ClockApp