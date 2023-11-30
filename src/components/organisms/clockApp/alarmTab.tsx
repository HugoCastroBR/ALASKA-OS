import CustomText from '@/components/atoms/CustomText'
import useStore from '@/hooks/useStore'
import { CallNotification } from '@/store/actions'
import { Button, Divider } from '@mantine/core'
import { Carousel } from '@mantine/carousel';
import React from 'react'
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';


const AlarmTab = () => {

  const { states, dispatch } = useStore()
  const [alarmHour, setAlarmHour] = React.useState<number>(0)
  const [alarmMinute, setAlarmMinute] = React.useState<number>(0)


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
      '20', '21', '22', '23','24', '25', '26', '27', '28', '29',
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
    <div className='w-full h-full flex flex-col'>
      <div 
      className='w-full flex justify-center items-center'
      style={{
        height: '250px'
      }}
      >
        <div
          className='mr-2'
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
          className='ml-2'
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
      </div>
      <div className='w-full h-1/3 flex justify-center items-center'>
        <Button
          color={states.Settings.settings.system.systemTextColor}
          onClick={() => {

            const formattedAlarmHour = alarmHour.toString().padStart(2, '0')
            const formattedAlarmMinute = alarmMinute.toString().padStart(2, '0')
            localStorage.setItem('alarm', `${formattedAlarmHour}:${formattedAlarmMinute}`)

          }}
        >
          <CustomText
            text='Set Alarm'
            className='font-medium !text-lg'
            style={{
              color: states.Settings.settings.system.systemTextColor
            }}
          />
        </Button>
      </div>
    </div>
  )
}

export default AlarmTab