'use client'

import React, { useEffect } from 'react'
import StartMenu from './StartMenu'
import Image from 'next/image'
import useStore from '@/hooks/useStore'
import { programProps } from '@/types/programs'
import { ClearAllFocused, SetGlobalVolumeMultiplier, WindowRemoveTab, WindowToggleMinimizeTab } from '@/store/actions'
import Clock from '../molecules/Clock'
import { truncateText } from '@/utils/text'
import CustomText from '../atoms/CustomText'
import { Slider } from '@mantine/core'



const TaskBarItem = ({ tab, window, }: programProps) => {

  const { states, dispatch } = useStore()

  return (
    <div
      onClick={() => {
        dispatch(WindowToggleMinimizeTab({
          title: window.title,
          uuid: tab.uuid,
        }))
        if (tab.focused) {
          dispatch(ClearAllFocused())
        }
      }}
      className={`
      flex items-center w-40 bg-slate-50 h-10
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
      <CustomText
        text={truncateText(tab.ficTitle || tab.title, 12)}
        className='text-xs'
      />
      <div
        onClick={(e) => {
          e.stopPropagation()
          dispatch(WindowRemoveTab({
            title: window.title,
            uuid: tab.uuid,
          }))

        }}
        className='h-4 w-4 bg-transparent flex justify-center items-center
      rounded-sm hover:bg-cyan-400 hover:bg-opacity-30 transition-all
      duration-200 ease-in-out
      '>
        <span className='i-mdi-close text-lg' ></span>
      </div>
    </div>
  )
}



const TaskBar = () => {

  const { states, dispatch } = useStore()
  const [globalVolume, setGlobalVolume] = React.useState(100)
  const [isVolumeOpen, setIsVolumeOpen] = React.useState(false)

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

  useEffect(() => {
    handlerChangeGlobalVolume(globalVolume)
  }, [globalVolume])

  const handlerChangeGlobalVolume = (value: number) => {
    dispatch(SetGlobalVolumeMultiplier(value / 100))
  }

  return (
    <footer
      className='fixed bottom-0 left-0 w-full h-10 
    bg-opacity-20 backdrop-filter backdrop-blur-sm 
    border-t border-white border-opacity-20 flex justify-start items-center
    '
    >
      <div className={`absolute w-40 h-10  bottom-10 
      bg-white flex justify-evenly items-center rounded-md
      backdrop-filter backdrop-blur-sm shadow-sm bg-opacity-20
      transition-all duration-300 ease-in-out
      ${isVolumeOpen ? 'right-0' : '-right-40'}
      `}>
        <Slider 
        value={Number(globalVolume.toFixed(0))}
        onChange={(value) => setGlobalVolume(value)}
        w={100}
        />
      </div>
      <div className='w-10/12 flex h-full justify-start items-center flex-wrap overflow-hidden'>
        <StartMenu />
        {handleRenderTabs()}
      </div>
      <div className='w-2/12 h-full flex justify-end items-center pr-1'>
        <div className='flex w-1/4 items-center justify-evenly'>

          <span
            className='i-mdi-volume-high text-lg cursor-pointer'
            onClick={() => setIsVolumeOpen(!isVolumeOpen)}
          />
        </div>
        <div className='flex w-1/4 items-center justify-end'>
          <Clock />
        </div>
      </div>
    </footer>
  )
}

export default TaskBar