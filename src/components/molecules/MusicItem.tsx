import { MusicItemProps } from "@/types/programs"
import CustomText from "../atoms/CustomText"
import Image from 'next/image'
import { secondsToMinutes } from "@/utils/date"
import { getMP3Duration, uuid } from "@/utils/file"
import { useEffect, useState } from "react"
import useStore from "@/hooks/useStore"


const MusicItem = ({
  music,
  index,
  onClick,
}: MusicItemProps) => {

  const [seconds, setSeconds] = useState<number>(0)
  

  const {states} = useStore()

  const handlerLoadSeconds = async () => {
    if(!music.musicFile) return
    const seconds = await getMP3Duration(music.musicFile)
    setSeconds(seconds)
  }
  useEffect(() => {
    handlerLoadSeconds()
  },[music.musicFile,states.Musics])
  


  return (
    <div
      className={`w-full h-16 flex justify-start items-center my-1 cursor-pointer
    hover:bg-slate-200 transition-all duration-300 ease-in-out
    `}
      onClick={() => {
        onClick && onClick({
          uuid: uuid(6),
          title: music.title,
          artist: music.artist,
          cover: music.cover,
          duration: seconds,
          musicFile: music.musicFile,
        })
      }}
    >
      <div className='w-16 h-16 overflow-hidden'>
        <Image
          src={`data:image/png;base64,${music.cover}`}
          alt='music'
          height={64}
          width={64}
        />
      </div>
      <div className=' w-[calc(100%-96px)]   h-full flex flex-col justify-start items-start pl-1'>
        <CustomText
          text={music.title}
          className='text-sm font-semibold'
        />
        <CustomText
          text={music.artist}
          className='text-xs'
        />
      </div>
      <div className='h-full w-8 flex justify-center items-end'>
          <CustomText
            text={secondsToMinutes(seconds)}
            className='text-xs mb-px'
          />
      </div>
    </div>
  )
}

export default MusicItem