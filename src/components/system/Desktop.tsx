'use client'
import React from 'react'
import MouseMenuContext from '@/components/system/MouseMenuContext'
import TaskBar from './TaskBar'
import DesktopView from './DesktopView'
const Desktop = () => {

  const [isRightMenuOpen, setIsRightMenuOpen] = React.useState(false)
  const [x, setX] = React.useState(0)
  const [y, setY] = React.useState(0)

  

  return (
    <main
      className='
      min-h-full min-w-full w-screen h-screen overflow-hidden flex flex-col justify-between
      '
      onContextMenu={(e) => {
        e.preventDefault()
        setX(e.pageX)
        setY(e.pageY)
        setIsRightMenuOpen(true)
      }}
      onClick={() => {
        setIsRightMenuOpen(false)
      }}
    >
        <MouseMenuContext
          visible={isRightMenuOpen}
          x={x}
          y={y}
        />
      <DesktopView/>
      <TaskBar/>
    </main>
  )
}

export default Desktop