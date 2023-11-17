'use client'

import React from 'react'
import StartMenu from './StartMenu'
import Image from 'next/image'
import useStore from '@/hooks/useStore'
import { programProps } from '@/types/programs'
import { ClearAllFocused, WindowToggleMinimizeTab } from '@/store/actions'



const TaskBarItem = ({tab,window,}:programProps) => {

  const {states, dispatch} = useStore()

  return (
    <div 
    onClick={() => {
      dispatch(WindowToggleMinimizeTab({
        title: window.title,
        uuid: tab.uuid,
      }))
      if(tab.focused){
        dispatch(ClearAllFocused())
      }
    }}
    className={`
      flex items-center w-36 bg-slate-50 h-10
      bg-opacity-50 backdrop-filter backdrop-blur-sm
      justify-between px-2 mx-px cursor-pointer
      transition-all duration-100 ease-in-out
      ${tab.focused ? 'border-b-4 border-cyan-400  ' : ''}
      `}
      >
      <Image
        src={window.icon || '/assets/icons/Alaska.png'}
        alt={tab.ficTitle || tab.title}
        width={20}
        height={20}
      />
      {tab.ficTitle || tab.title}
    </div>
  )
}



const TaskBar = () => {

  const {states, dispatch} = useStore()

  const handleRenderTabs = () => {
    return states.Windows.windows.map((window, index) => {
      return window.tabs.map((tab, index) => {
        return (
          <TaskBarItem
            key={index}
            tab={tab}
            window={window}
          />
        )
      })
    
    })
}

  return (
    <footer
      className='fixed bottom-0 left-0 w-full h-10 
    bg-opacity-20 backdrop-filter backdrop-blur-sm 
    border-t border-white border-opacity-20 flex justify-start items-center
    '
    >
      <div className='w-11/12 flex h-full justify-start items-center flex-wrap overflow-hidden'>
        <StartMenu />
        {handleRenderTabs()}
      </div>
      <div className='w-1/12 h-full flex justify-end items-center pr-1'>
        <div className='flex w-1/2 items-center justify-evenly'>

        </div>
        <div className='flex w-1/2 items-center justify-evenly'>

        </div>
      </div>
    </footer>
  )
}

export default TaskBar