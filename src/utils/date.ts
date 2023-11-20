export const secondsToMinutes = (time: number) => {
  const minutes = Math.floor(time / 60)
  let seconds = `${Math.floor(time % 60)}`
  if (Number(seconds) < 10) {
    seconds = `0${seconds}`
  }
  return `${minutes}:${seconds}`
}