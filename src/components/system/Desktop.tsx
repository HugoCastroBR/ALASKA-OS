'use client'
import React from 'react'
import MouseMenuContext from '@/components/system/MouseMenuContext'
import TaskBar from './TaskBar'
import DesktopView from './DesktopView'
const Desktop = () => {



  

  return (
    <main
      className='
      min-h-full min-w-full w-screen h-screen overflow-hidden flex flex-col justify-between
      '
      
    >
      <DesktopView/>
      <TaskBar/>
    </main>
  )
}

export default Desktop