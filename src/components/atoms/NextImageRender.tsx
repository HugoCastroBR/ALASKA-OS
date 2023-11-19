import React from 'react'
import Image from 'next/image'


export type NextImageRenderProps = {
  src: string
  alt: string
  width: number
  height: number
}
const NextImageRender = ({
  src,
  alt,
  width,
  height
}:NextImageRenderProps) => {
  return (
    <Image
    src={src}
    alt={alt}
    width={width}
    height={height}
    

  />
  )
}

export default NextImageRender