'use client'
import React, { useEffect, useState } from "react"
import { extractParentPath, getExtension, uuid } from "@/utils/file"
import Image from "next/image"
import CustomText from "../atoms/CustomText"
import {  AddSelectedFile, WindowAddTab } from "@/store/actions"
import useStore from "@/hooks/useStore"
import useFS from "@/hooks/useFS"
import { desktopFileProps } from "@/types/DesktopItem"

const DesktopFile = ({
  title,
  icon,
  onClick,
  onDoubleClick,
  path
}: desktopFileProps) => {

  const { states, dispatch } = useStore()

  const [isItemSelected, setIsItemSelected] = useState(false)
  const [inputValue, setInputValue] = useState(title)
  const [isRename, setIsRename] = useState(false)

  const { fs } = useFS()



  const CodeExtension = ["js" || "ts" || "css"]
  return (
    <>
      <div
        onClick={() => {
          onClick && onClick()
          }}
        onDoubleClick={() => {}}
        onDragStart={(e) => {
          dispatch(AddSelectedFile(path))
          //from
        }}
        className={`
        h-28 p-px m-1
        flex flex-col justify-evenly items-center cursor-pointer
        hover:bg-cyan-300 transition-all duration-300 ease-in-out
        hover:bg-opacity-30 rounded-md
        ${isItemSelected ? 'bg-gray-600' : ''}
        `}>
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
    </>
  )
}

export default DesktopFile