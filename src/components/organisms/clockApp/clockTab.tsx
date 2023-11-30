import CustomText from '@/components/atoms/CustomText'
import useStore from '@/hooks/useStore'
import React from 'react'

const ClockTab = () => {

  const { states, dispatch } = useStore()
  const [currentTime, setCurrentTime] = React.useState(new Date())

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const getCityTime = (city: string): Date => {
    const timeZone = city;

    const DateTime = currentTime.toLocaleString('en-US', { timeZone });
    return new Date(DateTime);
  };

  const getCityDate = (city: string): string => {
    const timeZone = city;
    const DateTime = currentTime.toLocaleString('en-US', { timeZone });

    const formattedDate = new Date(DateTime)
      .toLocaleDateString('pt-BR', { timeZone, day: '2-digit', month: '2-digit', year: 'numeric' });

    return formattedDate;
  }

  interface TimeItemProps {
    city: string
    time: Date
    date: string
  }


  const TimeItem = ({
    city,
    time,
    date
  }: TimeItemProps) => {

    const timeDifferenceInHours = Math.abs(time.getTime() - currentTime.getTime()) / 36e5;

    return (

      <div className='w-full h-16 flex flex-col pt-1 border-b'
        style={{
          borderBottomColor: states.Settings.settings.system.systemHighlightColor
        }}
      >
        <div className='flex justify-between items-center px-1 my-1 w-full h-1/5 '>
          <div className='h-full flex flex-col w-1/2  items-start'>
            <CustomText
              text={city}
              className='!font-medium !text-base mt-1'
              style={{
                color: states.Settings.settings.system.systemTextColor
              }}
            />
            <CustomText
              text={`${Math.round(timeDifferenceInHours)} hours ahead`}
              className='!font-medium !text-base -mt-1'
              style={{
                color: states.Settings.settings.system.systemTextColor
              }}
            />
          </div>
          <div className='h-full flex flex-col w-1/2 items-end'>
            <CustomText
              text={(new Date(time)).getHours().toString().padStart(2, '0') + ':' + (new Date(time)).getMinutes().toString().padStart(2, '0') + ':' + (new Date(time)).getSeconds().toString().padStart(2, '0')}
              className='!font-medium !text-base mt-1'
              style={{
                color: states.Settings.settings.system.systemTextColor
              }}
            />
            <CustomText
              text={date}
              className='!font-medium !text-base -mt-1'
              style={{
                color: states.Settings.settings.system.systemTextColor
              }}
            />
          </div>
        </div>
      </div>
    )
  }


  return (
    <div className='w-full h-full p-1'>
      <div className='w-full h-full flex flex-col items-center'>
        <div className='w-full h-1/6 flex flex-col items-start mb-2 mt-1'>
          <CustomText
            text='Current Time: '
            className='!font-medium !text-base -mb-1'
          />
          <div className='text-4xl font-bold'>
            <CustomText
              text={(new Date(currentTime)).getHours().toString().padStart(2, '0') + ':' + (new Date(currentTime)).getMinutes().toString().padStart(2, '0')}
              className='!font-bold !text-4xl mt-1'
            />
          </div>
          <div className='text-2xl font-bold -mt-3'>
            <CustomText
              text={getCityDate('America/Sao_Paulo')}
              className='!font-semibold !text-lg'
            />
          </div>
        </div>
        <TimeItem
          city='New York'
          time={getCityTime('America/New_York')}
          date={getCityDate('America/New_York')}
        />
        <TimeItem
          city='London'
          time={getCityTime('Europe/London')}
          date={getCityDate('Europe/London')}
        />
        <TimeItem
          city='São Paulo'
          time={getCityTime('America/Sao_Paulo')}
          date={getCityDate('America/Sao_Paulo')}
        />
        <TimeItem
          city='Tokyo'
          time={getCityTime('Asia/Tokyo')}
          date={getCityDate('Asia/Tokyo')}
        />
        <TimeItem
          city='Sydney'
          time={getCityTime('Australia/Sydney')}
          date={getCityDate('Australia/Sydney')}
        />
      </div>
    </div>
  )
}

export default ClockTab