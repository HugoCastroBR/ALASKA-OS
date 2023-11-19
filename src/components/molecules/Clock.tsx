import React from 'react'
import CustomText from '../atoms/CustomText'
import { Indicator } from '@mantine/core'
import { Calendar } from '@mantine/dates'

const Clock = () => {

  const [time, setTime] = React.useState('11:30 AM')
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false)

  const getTimeEveryMinute = () => {
    const date = new Date()
    const hour = date.getHours()
    let minute = date.getMinutes().toString()
    if (Number(minute) < 10) {
      minute = `0${minute}`
    }
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12
    setTime(`${hour12}:${minute} ${ampm}`)
  }

  React.useEffect(() => {
    setInterval(() => {
      getTimeEveryMinute()
    }, 1000)
  }, [])

  return (
    <>
      {
        isCalendarOpen
        &&
        <div className='absolute bottom-10 bg-white bg-opacity-80 rounded-md'>
          <Calendar
            renderDay={(date) => {
              const day = date.getDate()
              const currentDay = new Date().getDate()
              return (
                <Indicator size={6} color="blue" offset={-2} disabled={day !== currentDay}>
                  <div>{day}</div>
                </Indicator>
              );
            }}
          />
        </div>
        }
      <div
        onClick={() => setIsCalendarOpen(!isCalendarOpen)}
        className='w-20 cursor-pointer'>
        <CustomText
          text={time}
        />
      </div>
    </>
  )
}

export default Clock