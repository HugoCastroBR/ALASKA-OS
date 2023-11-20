import { MusicItemProps } from "@/types/programs"
import CustomText from "../atoms/CustomText"
import Image from 'next/image'
import { secondsToMinutes } from "@/utils/date"
import { getMP3Duration, getMp3SecondsDuration } from "@/utils/file"
import { useEffect, useState } from "react"



const MusicItem = ({
  title,
  artist,
  cover,
  duration,
  currentPlaying = false,
  onClick,
  musicFile,
}: MusicItemProps) => {

  const [seconds, setSeconds] = useState<number>(0)


  const handlerLoadSeconds = async () => {
    if(!musicFile) return
    const seconds = await getMP3Duration(musicFile)
    console.log(seconds)
    setSeconds(seconds)
  }
  useEffect(() => {
    handlerLoadSeconds()
  },[musicFile])
  

  return (
    <div
      className={`w-full h-16 flex justify-start items-center my-1 cursor-pointer
    hover:bg-slate-200 transition-all duration-300 ease-in-out
    ${currentPlaying ? 'bg-slate-100' : ''}
    `}
      onClick={() => {
        onClick && onClick({
          title,
          artist,
          cover,
          duration,
          musicFile,
        })
      }}
    >
      <div className='w-16 h-16 overflow-hidden'>
        <Image
          src={`data:image/png;base64,${cover}`}
          alt='music'
          height={64}
          width={64}
        />
      </div>
      <div className=' w-[calc(100%-96px)]   h-full flex flex-col justify-start items-start pl-1'>
        <CustomText
          text={title}
          className='text-sm font-semibold'
        />
        <CustomText
          text={artist}
          className='text-xs'
        />
      </div>
      <div className='h-full w-8 flex justify-center items-end'>
        {currentPlaying ?
          <span className='i-mdi-volume-high text-xl text-slate-600 mb-1 cursor-pointer' />
          :
          <CustomText
            text={secondsToMinutes(seconds)}
            className='text-xs mb-px'
          />
        }

      </div>
    </div>
  )
}

export default MusicItem