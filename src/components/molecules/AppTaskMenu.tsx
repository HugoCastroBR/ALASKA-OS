'use client'

import React from 'react'
import CustomText from '../atoms/CustomText'

const AppTaskMenu = ({
  onSave,
  onSaveAs,
  onNewTab
}:{
  onSave?: () => void
  onSaveAs?: () => void
  onNewTab?: () => void
}) => {

  const [isFileMenuOpen, setIsFileMenuOpen] = React.useState(false)

  return (
    <div className='flex h-6 absolute w-full top-8 bg-white items-center z-30'>
      <div
        onClick={() => {
          setIsFileMenuOpen(!isFileMenuOpen)
        }}
        className='
      flex justify-center items-center cursor-pointer 
      hover:bg-blue-500 hover:bg-opacity-40 transition-all duration-300 ease-in-out
      px-2 h-6
      '>
        <span className='i-mdi-file-outline text-black mr-1'></span>
        <CustomText text='File' />
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
            <CustomText text='New' />
          </div>
          <div
            onClick={() => {
              console.log('save')
              onSave && onSave()
              setIsFileMenuOpen(false)
            }}
            className='cursor-pointer h-6 hover:bg-slate-100 hover:bg-opacity-60 transition-all duration-300 pl-1'>
            <CustomText text='Save' />
          </div>
          <div
            onClick={() => {
              console.log('save as')
              onSaveAs && onSaveAs()
              setIsFileMenuOpen(false)
            }}
            className='cursor-pointer h-6 hover:bg-slate-100 hover:bg-opacity-60 transition-all duration-300 pl-1'>
            <CustomText text='Save As' />
          </div>
        </div>

      }
      <div
        className='
        flex justify-center items-center cursor-pointer 
        hover:bg-blue-500 hover:bg-opacity-40 transition-all duration-300 ease-in-out
        px-2 h-6
      '>
        <span className='i-mdi-about-outline text-black mr-1'></span>
        <CustomText text='About' />
      </div>
    </div>
  )
}

export default AppTaskMenu