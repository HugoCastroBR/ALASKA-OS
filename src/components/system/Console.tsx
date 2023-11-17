'use client'
import React, { useState } from 'react'
import DefaultWindow from '../containers/DefaultWindow'
import useConsole from '@/hooks/useConsole'

const Console = () => {

  const { history, AddToHistory,clear } = useConsole()



  return (
    <DefaultWindow 
    title='Console'>
      <div 
      className='w-full h-full
      bg-slate-900 bg-opacity-60 backdrop-filter backdrop-blur-sm
      flex flex-col justify-start items-start overflow-y-auto p-2
      '>
        {history.map((item, index) => (
          <p 
          key={index}
          className='
          text-white text-sm
          px-2
          '
          >{item}</p>
        ))}
        <input 
        className='
        w-full h-8 bg-transparent text-white p-2
        outline-none focus:outline-none mb-2 text-sm
        '
        autoFocus
        type='text'
        onKeyPress={(e) => {
          if(e.key === 'Enter'){
            if(e.currentTarget.value === 'clear'){
              clear()
            }
  
            AddToHistory(e.currentTarget.value)
            e.currentTarget.value = ''
          }
        }}
        />
      </div>
    </DefaultWindow>
  )
}

export default Console