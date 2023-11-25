import React, { useEffect } from 'react'
import CustomText from '../atoms/CustomText'
import { Indicator } from '@mantine/core'
import { Calendar } from '@mantine/dates'
import useSettings from '@/hooks/useSettings'

const Clock = () => {

  const { settings } = useSettings()

  // const [time, setTime] = React.useState(0)
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false)
  const [hour, setHour] = React.useState(0)
  const [minute, setMinute] = React.useState(0)
  const [second, setSecond] = React.useState(0)
  const [timeFormat, setTimeFormat] = React.useState<string | undefined>(settings?.system.clock.format)

  useEffect(() => {
    if(timeFormat !== settings?.system.clock.format){
      setTimeFormat(settings?.system.clock.format)
    }
  }, [settings?.system.clock.format])

  const [clockTextColor, setClockTextColor] = React.useState(settings?.taskbar.items.color)

  useEffect(() => {
    if(clockTextColor !== settings?.taskbar.items.color){
      setClockTextColor(settings?.taskbar.items.color)
    } 
  }, [settings?.taskbar.items.color])

  const getTime = () => {
    const date = new Date()
    const hour = date.getHours()
    const second = date.getSeconds()
    
    let minute = date.getMinutes().toString()
    setHour(hour)
    setMinute(Number(minute))
    setSecond(second)
  }

  const formatTime = (format: "12" | "24") => {
    let _minute = `${minute}`
    let _second = `${second}`
    if(format === "12"){
      if (minute < 10) {
        _minute = `0${minute}`
      }
      const ampm = hour >= 12 ? 'PM' : 'AM'
      const hour12 = hour % 12
      if(settings?.system.clock.showSeconds){
        if(second < 10){
          _second = `0${second}`
        }
        return `${hour12}:${_minute}:${_second} ${ampm}`
      }
      return `${hour12}:${_minute} ${ampm}`
    }else{
      if (minute < 10) {
        _minute = `0${minute}`
      }
      if(settings?.system.clock.showSeconds){
        if(second < 10){
          _second = `0${second}`
        }
        return `${hour}:${_minute}:${_second}`
      }
      return `${hour}:${_minute}`
    }
  }

  useEffect(() => {
    if(settings?.system.clock.showSeconds){
      setInterval(() => {
        getTime()
      }, 100)
    }else{
      setInterval(() => {
        getTime()
      }, 1000)
    }
  }, [settings?.system.clock.showSeconds])
  

  return (
    <>
      <div 
      className={`absolute bottom-10 bg-white bg-opacity-80 rounded-md w-64 h-64
      ${isCalendarOpen ? 'bottom-10 right-2' : '-right-72'} transition-all duration-500 ease-in-out
      `}>
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
      <div
        onClick={() => setIsCalendarOpen(!isCalendarOpen)}
        className='w-24 cursor-pointer '>
        <CustomText
          className='w-full '
          text={formatTime(timeFormat as "12" | "24")}
          style={{
            color: clockTextColor
          }}
        />
      </div>
    </>
  )
}

export default Clock