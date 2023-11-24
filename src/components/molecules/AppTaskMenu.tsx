'use client'

import React, { useEffect } from 'react'
import CustomText from '../atoms/CustomText'
import useSettings from '@/hooks/useSettings'

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

  const {settings} = useSettings()

  const [defaultSystemTextColor, setDefaultSystemTextColor] = React.useState(settings?.system?.systemTextColor)
  const [defaultSystemHighlightColor, setDefaultSystemHighlightColor] = React.useState(settings?.system?.systemHighlightColor)
  const [defaultSystemBackgroundColor, setDefaultSystemBackgroundColor] = React.useState(settings?.system?.systemBackgroundColor)
  useEffect(() => {
    if(settings?.system?.systemTextColor === defaultSystemTextColor) return
    setDefaultSystemTextColor(settings?.system?.systemTextColor)
  }, [settings?.system?.systemTextColor, settings?.system.systemHighlightColor, defaultSystemTextColor])

  useEffect(() => {
    if(settings?.system?.systemHighlightColor === defaultSystemHighlightColor) return
    setDefaultSystemHighlightColor(settings?.system?.systemHighlightColor)
  }, [settings?.system?.systemHighlightColor, defaultSystemHighlightColor])

  useEffect(() => {
    if(settings?.system?.systemBackgroundColor === defaultSystemBackgroundColor) return
    setDefaultSystemBackgroundColor(settings?.system?.systemBackgroundColor)
  }, [settings?.system?.systemBackgroundColor, defaultSystemBackgroundColor])

  const [isFileMenuOpen, setIsFileMenuOpen] = React.useState(false)
  const [isCodeMenuOpen, setIsCodeMenuOpen] = React.useState(false)

  return (
    <div className='flex h-6 absolute w-full top-8 items-center z-30'
      style={{
        backgroundColor: defaultSystemBackgroundColor
      }}
    >
      {onRun && (
        <div
          onClick={() => {
            onRun && onRun()
          }}
          className='
          flex justify-center items-center cursor-pointer 
          hover:bg-blue-500 hover:bg-opacity-40 transition-all duration-300 ease-in-out
          px-2 h-6
        '>
          <span className='i-mdi-play-circle-outline mr-1'
          style={{
            color: defaultSystemTextColor
          }}
          ></span>
          <CustomText text='Run'
          style={{
            color: defaultSystemTextColor
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
          hover:bg-blue-500 hover:bg-opacity-40 transition-all duration-300 ease-in-out
          px-2 h-6
        '>
          <span className='i-mdi-code-tags mr-1'
          style={{
            color: defaultSystemTextColor
          }}
          ></span>
          <CustomText text='Code' 
          style={{
            color: defaultSystemTextColor
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
      hover:bg-blue-500 hover:bg-opacity-40 transition-all duration-300 ease-in-out
      px-2 h-6
      '>
        <span className='i-mdi-file-outline  mr-1'
        style={{
          color: defaultSystemTextColor
        }}
        ></span>
        <CustomText text='File' 
          style={{
            color: defaultSystemTextColor
          }}
        />
      </div>
      {/* File DropDown */}
      {isFileMenuOpen &&
        <div
          style={{
            top: '28px'
          }}
          className=' absolute w-32 h-44 bg-slate-300 rounded-sm bg-opacity-50 
          left-0 py-1 flex flex-col backdrop-filter backdrop-blur-sm shadow-lg -mt-1
          '
        >
          <div
            onClick={() => {
              console.log('new tab')
              onNewTab && onNewTab()
              setIsFileMenuOpen(false)
            }}
            className='cursor-pointer h-6 hover:bg-slate-100 hover:bg-opacity-60 transition-all duration-300 pl-1'>
            <CustomText text='New' 
            style={{
              color: defaultSystemTextColor
            }}
            />
          </div>
          <div
            onClick={() => {
              console.log('save')
              onSave && onSave()
              setIsFileMenuOpen(false)
            }}
            className='cursor-pointer h-6 hover:bg-slate-100 hover:bg-opacity-60 transition-all duration-300 pl-1'>
            <CustomText text='Save' 
            style={{
              color: defaultSystemTextColor
            }}
            />
          </div>
          <div
            onClick={() => {
              console.log('save as')
              onSaveAs && onSaveAs()
              setIsFileMenuOpen(false)
            }}
            className='cursor-pointer h-6 hover:bg-slate-100 hover:bg-opacity-60 transition-all duration-300 pl-1'>
            <CustomText text='Save As' 
            style={{
              color: defaultSystemTextColor
            }}
            />
          </div>
        </div>
      }
      {
        isCodeMenuOpen && (
          <div
            style={{
              top: '28px'
            }}
            className=' absolute w-32 h-44 bg-slate-300 rounded-sm bg-opacity-50 
            left-0 py-1 flex flex-col backdrop-filter backdrop-blur-sm shadow-lg -mt-1
            '
          >
            <div
              onClick={() => {
                console.log('Run code')
                onRun && onRun()
                setIsCodeMenuOpen(false)
              }}
              className='cursor-pointer h-6 hover:bg-slate-100 hover:bg-opacity-60 transition-all duration-300 pl-1'>
              <CustomText text='Run Code'
              style={{
                color: defaultSystemTextColor
              }}
              />
            </div>
            <div
              onClick={() => {
                console.log('close console')
                closeConsole && closeConsole()
                setIsCodeMenuOpen(false)
              }}
              className='cursor-pointer h-6 hover:bg-slate-100 hover:bg-opacity-60 transition-all duration-300 pl-1'>
              <CustomText text='Toggle Console' 
              style={{
                color: defaultSystemTextColor
              }}
              />
            </div>
          </div>
        )
      }
      <div
        className='
        flex justify-center items-center cursor-pointer 
        hover:bg-blue-500 hover:bg-opacity-40 transition-all duration-300 ease-in-out
        px-2 h-6
      '>
        <span className='i-mdi-about-outline mr-1'
        style={{
          color: defaultSystemTextColor
        }}
        ></span>
        <CustomText text='About' 
        style={{
          color: defaultSystemTextColor
        }}
        />
      </div>
    </div>
  )
}

export default AppTaskMenu