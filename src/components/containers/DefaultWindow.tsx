import { DefaultWindowProps } from '@/types/containers'
import React from 'react'
import Draggable from 'react-draggable'



const DefaultWindow = ({
  title,
  children
}:DefaultWindowProps) => {


  return (
    <Draggable
      handle='.handle'
      bounds='#desktop-view'
    >
      <section
        className='
        absolute w-1/2 h-1/2 top-1/4 left-1/4
        flex flex-col  overflow-hidden
        shadow-2xl 
        hover:resize
      '
      >
        <div
          className='
          w-full h-8 bg-slate-50 bg-opacity-50 backdrop-filter backdrop-blur-sm
          flex items-center justify-between px-2 cursor-move handle fixed z-20
      '>
          {title}
          <div className='flex justify-end items-center'>
            <span className='i-mdi-minus text-2xl
            mx-px cursor-pointer hover:text-blue-500 transition-all duration-300 ease-in-out
          '/>
            <span className='i-mdi-window-maximize text-2xl
            mx-px cursor-pointer hover:text-blue-500 transition-all duration-300 ease-in-out
          '/>
            <span className='i-mdi-close text-2xl
            mx-px cursor-pointer hover:text-blue-500 transition-all duration-300 ease-in-out
          '/>
          </div>
        </div>
        <div className='w-full h-full pt-8'>
          {children}
        </div>
      </section>
    </Draggable>
  )
}

export default DefaultWindow