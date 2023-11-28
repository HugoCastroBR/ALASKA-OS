import React, { useEffect, useState } from 'react';
import CustomText from '../atoms/CustomText';
import { Indicator } from '@mantine/core';
import { Calendar } from '@mantine/dates';
import useStore from '@/hooks/useStore';

const Clock = () => {
  const { states } = useStore();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [time, setTime] = useState(new Date());

  const formatTime = (format: '12' | '24') => {
    const hour = time.getHours();
    const minute = time.getMinutes().toString().padStart(2, '0');
    const second = time.getSeconds().toString().padStart(2, '0');

    if (format === '12') {
      const hour12 = hour % 12 || 12;
      const ampm = hour >= 12 ? 'PM' : 'AM';

      return states.Settings.settings?.system.clock.showSeconds
        ? `${hour12}:${minute}:${second} ${ampm}`
        : `${hour12}:${minute} ${ampm}`;
    } else {
      return states.Settings.settings?.system.clock.showSeconds
        ? `${hour}:${minute}:${second}`
        : `${hour}:${minute}`;
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, states.Settings.settings?.system.clock.showSeconds ? 100 : 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [states.Settings.settings?.system.clock.showSeconds]);

  return (
    <>
      <div
        className={`absolute bottom-10 bg-white bg-opacity-80 rounded-md w-64 h-64
          ${isCalendarOpen ? 'bottom-10 right-2' : '-right-72'} transition-all duration-500 ease-in-out
        `}
      >
        <Calendar
          renderDay={(date) => {
            const day = date.getDate();
            const currentDay = new Date().getDate();
            return (
              <Indicator size={6} color="blue" offset={-2} disabled={day !== currentDay}>
                <div>{day}</div>
              </Indicator>
            );
          }}
        />
      </div>
      <div onClick={() => setIsCalendarOpen(!isCalendarOpen)} className="w-24 cursor-pointer">
        <CustomText
          className="w-full"
          text={formatTime(states.Settings.settings?.system.clock.format as '12' | '24')}
          style={{
            color: states.Settings.settings?.system.systemTextColor,
          }}
        />
      </div>
    </>
  );
};

export default Clock;
