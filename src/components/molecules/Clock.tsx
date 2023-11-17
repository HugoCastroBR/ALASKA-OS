import React from 'react'
import CustomText from '../atoms/CustomText'

const Clock = () => {

  const [time, setTime] = React.useState('11:30 AM')
  
  const getTimeEveryMinute = () => {
    const date = new Date()
    const hour = date.getHours()
    let minute = date.getMinutes().toString()
    if(Number(minute) < 10){
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
    <div className='w-20'>
      <CustomText
          text={time}
          className=' cursor-pointer'
        />
    </div>
  )
}

export default Clock