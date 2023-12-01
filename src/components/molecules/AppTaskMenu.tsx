'use client'

import React, { useEffect } from 'react'
import CustomText from '../atoms/CustomText'
import useStore from '@/hooks/useStore'

const AppTaskMenu = ({
  onSave,
  onSaveAs,
  onNewTab,
  onRun,
  codeMode,
  closeConsole
}: {
  onRun?: () => void
  onSave?: () => void
  onSaveAs?: () => void
  onNewTab?: () => void
  closeConsole?: () => void
  codeMode?: boolean
}) => {


  const { states, dispatch } = useStore()
  const [isFileMenuOpen, setIsFileMenuOpen] = React.useState(false)
  const [isCodeMenuOpen, setIsCodeMenuOpen] = React.useState(false)
  

  return (
    <div className='sticky flex h-6  w-full  items-center z-30'
      style={{
        backgroundColor: states.Settings?.settings.system?.systemBackgroundColor || 'rgba(0, 0, 0, 0.2)'
      }}
    >
      {onRun && (
        <div
          onClick={() => {
            onRun && onRun()
          }}
          className='
          flex justify-center items-center cursor-pointer 
          hover:bg-opacity-40 transition-all duration-300 ease-in-out
          px-2 h-6
        '
          style={{
            backgroundColor: states.Settings?.settings.system?.systemBackgroundColor || 'rgba(0, 0, 0, 0.2)'
          }}
        >
          <span className='i-mdi-play-circle-outline mr-1'
          style={{
            color: states.Settings?.settings.system?.systemTextColor || 'white'
          }}
          ></span>
          <CustomText text='Run'
          style={{
            color: states.Settings?.settings.system?.systemTextColor || 'white'
          }}
          />
        </div>

      )}
      {codeMode && (
        <div
          onClick={() => {
            setIsCodeMenuOpen(!isCodeMenuOpen)
          }}
          className='
          flex justify-center items-center cursor-pointer 
          hover:bg-opacity-40 transition-all duration-300 ease-in-out
          px-2 h-6
          '
          style={{
            backgroundColor: states.Settings?.settings.system?.systemBackgroundColor || 'rgba(0, 0, 0, 0.2)'
          
          }}
          >
          <span className='i-mdi-code-tags mr-1'
          style={{
            color: states.Settings.settings.system.systemTextColor || 'white'
          }}
          ></span>
          <CustomText text='Code' 
          style={{
            color: states.Settings.settings.system.systemTextColor || 'white'
          }}
          />
        </div>
      )}
      <div
        onClick={() => {
          setIsFileMenuOpen(!isFileMenuOpen)
        }}
        className='
        flex justify-center items-center cursor-pointer 
        hover:bg-opacity-40 transition-all duration-300 ease-in-out
        px-2 h-6
        '
        style={{
          backgroundColor: states.Settings?.settings.system?.systemBackgroundColor || 'rgba(0, 0, 0, 0.2)'
        
        }}
        >
        <span className='i-mdi-file-outline  mr-1'
        style={{
          color: states.Settings.settings.system.systemTextColor || 'white'
        }}
        ></span>
        <CustomText text='File' 
          style={{
            color: states.Settings.settings.system.systemTextColor || 'white'
          }}
        />
      </div>
      {/* File DropDown */}
      {isFileMenuOpen &&
        <div
          style={{
            backgroundColor: states.Settings.settings.system.systemBackgroundColor || 'rgba(0, 0, 0, 0.2)',
            top: '28px'
          }}
          className=' absolute w-32 h-44 rounded-sm bg-opacity-50 
          left-0 py-1 flex flex-col backdrop-filter backdrop-blur-sm shadow-lg -mt-1
          '
          
        >
          <div
            onClick={() => {
              console.log('new tab')
              onNewTab && onNewTab()
              setIsFileMenuOpen(false)
            }}
            className='cursor-pointer h-6 hover:bg-opacity-60 transition-all duration-300 pl-1'>
            <CustomText text='New' 
            style={{
              color: states.Settings.settings.system.systemTextColor || 'white'
            }}
            />
          </div>
          <div
            onClick={() => {
              console.log('save')
              onSave && onSave()
              setIsFileMenuOpen(false)
            }}
            className='cursor-pointer h-6 hover:bg-opacity-60 transition-all duration-300 pl-1'>
            <CustomText text='Save' 
            style={{
              color: states.Settings.settings.system.systemTextColor || 'white'
            }}
            />
          </div>
          <div
            onClick={() => {
              console.log('save as')
              onSaveAs && onSaveAs()
              setIsFileMenuOpen(false)
            }}
            className='cursor-pointer h-6 hover:bg-opacity-60 transition-all duration-300 pl-1'>
            <CustomText text='Save As' 
            style={{
              color: states.Settings.settings.system.systemTextColor || 'white'
            }}
            />
          </div>
        </div>
      }
      {
        isCodeMenuOpen && (
          <div
            style={{
              backgroundColor: states.Settings.settings.system.systemBackgroundColor || 'rgba(0, 0, 0, 0.2)',
              top: '28px'
            }}
            className=' absolute w-32 h-44  rounded-sm bg-opacity-50 
            left-0 py-1 flex flex-col backdrop-filter backdrop-blur-sm shadow-lg -mt-1
            '

          >
            <div
              onClick={() => {
                console.log('Run code')
                onRun && onRun()
                setIsCodeMenuOpen(false)
              }}
              className='cursor-pointer h-6 hover:bg-opacity-60 transition-all duration-300 pl-1'>
              <CustomText text='Run Code'
              style={{
                color: states.Settings.settings.system.systemTextColor || 'white'
              }}
              />
            </div>
            <div
              onClick={() => {
                console.log('close console')
                closeConsole && closeConsole()
                setIsCodeMenuOpen(false)
              }}
              className='cursor-pointer h-6 hover:bg-opacity-60 transition-all duration-300 pl-1'>
              <CustomText text='Toggle Console' 
              style={{
                color: states.Settings.settings.system.systemTextColor || 'white'
              }}
              />
            </div>
          </div>
        )
      }
      <div
        className='
        flex justify-center items-center cursor-not-allowed 
        hover:bg-opacity-40 transition-all duration-300 ease-in-out
        px-2 h-6 opacity-70
      '>
        <span className='i-mdi-about-outline mr-1'
        style={{
          color: states.Settings.settings.system.systemTextColor || 'white'
        }}
        ></span>
        <CustomText text='About' 
        style={{
          color: states.Settings.settings.system.systemTextColor || 'white'
        }}
        />
      </div>
    </div>
  )
}

export default AppTaskMenu