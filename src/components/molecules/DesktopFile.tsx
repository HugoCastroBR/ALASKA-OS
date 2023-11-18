'use client'
import React, { useEffect, useState } from "react"
import { extractParentPath, getExtension, uuid, verifyIfIsImage } from "@/utils/file"
import Image from "next/image"
import CustomText from "../atoms/CustomText"
import { AddSelectedFile, RemoveSelectedFile, WindowAddTab } from "@/store/actions"
import useStore from "@/hooks/useStore"
import useFS from "@/hooks/useFS"
import { desktopFileProps } from "@/types/DesktopItem"
import { Loader } from "@mantine/core"

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

  useEffect(() => {
    if(states.File.selectedFiles.includes(path)){
      setIsItemSelected(true)
    }else{
      setIsItemSelected(false)
    }
  }, [states.File.selectedFiles])

  const CodeExtension = ["js" || "ts" || "css"]

  const [Image64, setImage64] = useState<string | null>(null)



  useEffect(() => {
    fs?.readFile(path,'utf-8', (err, data) => {
      if(data){
        setImage64(data)
      }else{
        console.log(err);
      }
    })
  }, [path,fs])

  const renderIcon = () => {
    if(verifyIfIsImage(title)){
      if(Image64 === null){
        return(
        <div className='w-12 h-12 bg-transparent rounded-md flex justify-center items-center'>
          <Loader size={48} />
        </div>
        )
      }
      return(
        <div className="w-12 h-12 flex items-center justify-center">
          <Image 
          src={`data:image/png;base64,${Image64}`} 
          alt={title} 
          width={48} 
          height={48} 
          loading="eager"
          />
        </div>
      )
    }else{
      return(
        icon && <Image src={icon} alt={title} width={48} height={48} />
      )
    }
  }

  return (
    <>
      <div
        onClick={() => {
          onClick && onClick()
          dispatch(AddSelectedFile(path))
          if (isItemSelected) {
            dispatch(RemoveSelectedFile(path))
          }
        }}
        onDoubleClick={() => {
          verifyIfIsImage(title) && dispatch(WindowAddTab({
            title: 'Image Reader',
            tab: {
              title: 'Image Reader',
              ficTitle: title,
              uuid: uuid(6),
              value: path,
              maximized: false,
              minimized: false
            }
          }))
        }}
        onDragStart={(e) => {
          dispatch(AddSelectedFile(path))
          //from
        }}
        className={`
        h-28 p-px m-px
        flex flex-col justify-evenly items-center cursor-pointer
        hover:bg-cyan-300 transition-all duration-300 ease-in-out
        hover:bg-opacity-30 rounded-md
        ${isItemSelected ? 'bg-white bg-opacity-30 ' : ''}
        `}
      >
        {
          
        }
        {renderIcon()}
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
                  if (err) {
                    console.log(err);
                  } else {
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