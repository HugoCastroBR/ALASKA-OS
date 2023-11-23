'use client'
import { ImageReaderProps } from '@/types/programs'
import React, { useEffect, useState } from 'react'
import CustomText from '../atoms/CustomText'
import useFS from '@/hooks/useFS'
import useStore from '@/hooks/useStore'
import NextImageRender from '../atoms/NextImageRender'
import DefaultWindow from '../containers/DefaultWindow'

const ImageReader = ({
  tab,
  window,
  path
}:ImageReaderProps) => {


  const [image, setImage] = useState<string | null>(null)
  const {states, dispatch} = useStore()
  const [width, setWidth] = useState<number>(0)
  const [height, setHeight] = useState<number>(0)
  const [margin, setMargin] = useState<number>(0)
  const [imageProvided, setImageProvided] = useState(false)
  const {fs} = useFS()

  useEffect(() => {
    fs?.readFile(path, 'utf8', (err, data) => {
      if (err) {
        console.log(err)
      }
      if (data) {
        setImage(data)
        setImageProvided(true)
      }
    })
  }, [fs])

  useEffect(() => {
    if(image){
      const img = new Image()
      img.src = `data:image/png;base64,${image}`
      img.onload = () => {
        if(img.width < 64 || img.height < 64){
          setMargin(128)
        }
        if(img.width > 2000 || img.height > 2000){
          setWidth(img.width / 4)
          setHeight(img.height / 4)
          return
        }
        if(img.width > 1512 || img.height > 1512){
          setWidth(img.width / 2)
          setHeight(img.height / 2)
          return
        }
        if(img.width > 1028 || img.height > 1028){
          setWidth(img.width / 1.8)
          setHeight(img.height / 1.8 )
          return
        }
        if(img.width > 812 || img.height > 812){
          setWidth(img.width / 1.4)
          setHeight(img.height / 1.4 )
          return
        }
        setWidth(img.width)
        setHeight(img.height)
        
      }
    }
  }, [image])


  return (
    <DefaultWindow
      currentTab={tab}
      currentWindow={window}
      title={tab.ficTitle || tab.title}
      onClose={() => {}}
      onMaximize={() => {}}
      onMinimize={() => {}}
      uuid={tab.uuid}
      resizable
      >
      <div className='flex  overflow-hidden justify-center items-center bg-slate-100 bg-opacity-60
      max-w-full max-h-full h-full w-full
      '>
        {
          !imageProvided 
          ?
          <div className='h-full w-full flex flex-col items-center justify-center'>
            <span
              className='i-mdi-image-off text-4xl text-slate-700'
            />
            <CustomText
            text='No Image Provided'
            className='text-2xl font-semibold text-slate-700'
            />
          </div>
          :
          <NextImageRender
          src={`data:image/png;base64,${image}`}
          width={width}
          height={height}
          alt='image'
          />
        }
        
      </div>
    </DefaultWindow>
  )
}

export default ImageReader