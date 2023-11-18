/* eslint-disable react-hooks/rules-of-hooks */
'use client'
import useStore from '@/hooks/useStore'
import useFS from '@/hooks/useFS'
import type { MouseMenuContext } from '@/types/system'
import { verifyIfIsFile } from '@/utils/file'
import React from 'react'
import CustomText from '../atoms/CustomText'
import { mouseContextMenuOptionsProps } from '@/types/mouse'
import { ClearFiles } from '@/store/actions'
const MouseMenuContext = ({
  x,
  y,
  visible,
}:MouseMenuContext) => {
  if (!visible) return null


  const { states, dispatch } = useStore()
  const { fs } = useFS()
  const MouseOption = ({
    className,
    title,
    onClick,
    disabled,
  }: mouseContextMenuOptionsProps) => {
    return (
      <div
        onClick={(e) => {
          if (disabled) return
          e.preventDefault()
          onClick && onClick()
        }}
        className={`${disabled ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}
        text-white text-sm flex items-center hover:bg-blue-500 
        transition-all duration-300 ease-in-out cursor-pointer 
        w-44 h-6 -ml-1
        `}
      >
        <span className={`${className} text-lg`}></span>
        <CustomText
          text={title}
        />
      </div>
    )
  }
  
  const MouseOptionDelete = () => {
    return (
      <MouseOption
        title='Delete'
        disabled={states.File.selectedFiles.length === 0}
        onClick={() => {
          states.File.selectedFiles.forEach((item) => {
            if (verifyIfIsFile(item)) {
              fs?.unlink(item, (err) => {
                if (err) {
                  fs?.rmdir(item, (err) => {
                    if (err) throw err
                    console.log('deleted folder');
                  })
                } else {
                  console.log('deleted file');
                }

              })
            } else {
              fs?.rmdir(item, (err) => {
                if (err) {
                  fs?.unlink(item, (err) => {
                    if (err) throw err
                    console.log('deleted file');
                  })
                } else {
                  console.log('deleted folder');
                }


              })
            }
            dispatch(ClearFiles())
          })
        }}
        className='i-mdi-delete'
      />
    )
  }

  

  return (
    <div
      className={`
      bg-gray-300 
        backdrop-filter backdrop-blur-sm shadow-md
        flex flex-col w-44 z-40  
        bg-opacity-20 
        p-1
    `}
      style={{
        position: 'absolute',
        top: y,
        left: x,
        zIndex: 100,
      }}
    > 
      <MouseOptionDelete />

      {/* <MouseOptionCopy /> */}
    </div>
  )
}

export default MouseMenuContext