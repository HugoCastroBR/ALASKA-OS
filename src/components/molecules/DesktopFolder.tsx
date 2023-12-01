'use client'

import React, { useEffect, useState } from "react"
import { extractParentPath, getLastPathSegment } from "@/utils/file"
import Image from "next/image"
import CustomText from "../atoms/CustomText"
import useStore from "@/hooks/useStore"
import useFS from "@/hooks/useFS"
import { desktopFolderProps } from "@/types/DesktopFolder"
import { Dropzone } from "@mantine/dropzone"
import { AddSelectedFile, ClearFiles, RemoveSelectedFile, SetIsRename, WindowAddTab } from "@/store/actions"
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

  useEffect(() => {
    if(states.File.selectedFiles.includes(path)){
      setIsItemSelected(true)
    }else{
      setIsItemSelected(false)
    }
  }, [states.File.selectedFiles])

  useEffect(() => {
    if(!states.File.setIsRename) return
    if(!states.File.selectedFiles.length) return
    if(states.File.selectedFiles.includes(path)){
      setIsRename(true)
    }
  },[states.File.selectedFiles, states.File.setIsRename])


  return (
    <Dropzone
      onClick={(e) => {
        e.stopPropagation()
        e.preventDefault()
        dispatch(AddSelectedFile(path))
        if(isItemSelected){
          dispatch(RemoveSelectedFile(path))
        }
      }}
      onDoubleClick={(e) => {
        e.stopPropagation()
        onDoubleClick && onDoubleClick()
        
      }}
      onDrop={(files) => {
        if(!states.File.selectedFiles[0]) return
        if(states.File.selectedFiles.length > 1){
          states.File.selectedFiles.forEach((file) => {
            const from = file
            const to = `${path}/${getLastPathSegment(file)}`
            fs?.rename(from, to, (err) => {
              if(err){
                console.log(err);
              }else{
                console.log('Moved');
              }
              dispatch(ClearFiles())
            })
          })
        }
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
        h-28 p-px m-px
        flex flex-col justify-evenly items-center cursor-pointer
        hover:bg-cyan-200 transition-all duration-300 ease-in-out
        hover:bg-opacity-60 rounded-md
        `}
        style={{
          backgroundColor: isItemSelected ? states.Settings.settings.system.systemHighlightColor : 'transparent'
        }}
      >
        {icon && <Image src={icon} alt={title} width={48} height={48} />}
        {isRename ?
          <input
            className="w-16 h-6 bg-slate-100 bg-opacity-70 rounded text-black text-xs outline-none text-center "
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
                    setIsRename(false)
                    dispatch(SetIsRename(false))
                    dispatch(ClearFiles())
                  }
                })
              }
            }}
          />
          :
          <CustomText
            text={title}
            className="break-words w-20 text-xs text-center"
            style={
              {
                color: `${states.Settings.settings.system.systemTextColor || 'rgba(0, 0, 0, 1)'}`
              }
            }
          />
        }
      </div>
    </Dropzone>
  )
}

export default DesktopFolder
