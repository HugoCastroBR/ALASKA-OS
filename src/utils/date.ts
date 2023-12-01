export const secondsToMinutes = (time: number) => {
  const minutes = Math.floor(time / 60)
  let seconds = `${Math.floor(time % 60)}`
  if (Number(seconds) < 10) {
    seconds = `0${seconds}`
  }
  return `${minutes}:${seconds}`
}

export const format12hourTo24hour = (time: string) => {
  const [hour, minute, period] = time.split('')
  let hour24 = Number(hour)
  if (period === 'PM') {
    hour24 += 12
  }
  if(hour24 === 24) {
    hour24 = 0
  }
  return `${hour24.toString().padStart(2,'0')}:${minute.toString().padStart(2,'0')}`
}