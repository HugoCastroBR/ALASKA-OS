'use client'

import React, { useState } from "react"
import { extractParentPath, getLastPathSegment } from "@/utils/file"
import Image from "next/image"
import CustomText from "../atoms/CustomText"
import useStore from "@/hooks/useStore"
import useFS from "@/hooks/useFS"
import { desktopFolderProps } from "@/types/DesktopFolder"
import { Dropzone } from "@mantine/dropzone"
import { ClearFiles } from "@/store/actions"

const DesktopFolder = ({
  title,
  icon,
  onClick,
  onDoubleClick,
  path
}: desktopFolderProps) => {

  const { states, dispatch } = useStore()
  const [isItemSelected, setIsItemSelected] = useState(false)
  const [inputValue, setInputValue] = useState(title)
  const [isRename, setIsRename] = useState(false)

  const { fs } = useFS()


  return (
    <Dropzone
      onClick={(e) => e.stopPropagation()}
      onDoubleClick={(e) => {
        e.stopPropagation()
        onDoubleClick && onDoubleClick()
      }}
      onDrop={(files) => {
        const from = states.File.selectedFiles[0]
        const to = `${path}/${getLastPathSegment(states.File.selectedFiles[0])}`
        console.log(from, to);
        fs?.rename(from, to, (err) => {
          if(err){
            console.log(err);
          }else{
            console.log('Moved');
          }
          dispatch(ClearFiles())
        })
      }}
    >
      <div
        onClick={() => {
          onClick && onClick()
        }}
        className={`
        h-28 p-px m-1
        flex flex-col justify-evenly items-center cursor-pointer
        hover:bg-cyan-300 transition-all duration-300 ease-in-out
        hover:bg-opacity-30 rounded-md
        ${isItemSelected ? 'bg-gray-600' : ''}
        `}
      >
        {icon && <Image src={icon} alt={title} width={48} height={48} />}
        {isRename ?
          <input
            className="w-16 h-6 bg-gray-800 text-white text-xs outline-none text-center "
            onChange={(e) => setInputValue(e.target.value)}
            autoFocus
            value={inputValue}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                const renameFrom = path
                const renameTo = `${extractParentPath(path)}/${inputValue}`
                fs?.rename(renameFrom, renameTo, (err) => {
                  if(err){
                    console.log(err);
                  }else{
                    console.log('renamed');
                  }
                })
              }
            }}
          />
          :
          <CustomText
            text={title}
            className="break-words w-20 text-xs text-center"
          />
        }
      </div>
    </Dropzone>
  )
}

export default DesktopFolder
