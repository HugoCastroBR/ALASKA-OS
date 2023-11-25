'use client'
import React, { useEffect, useState } from "react"
import { extractParentPath, getExtension, uuid, verifyIfIsImage } from "@/utils/file"
import Image from "next/image"
import CustomText from "../atoms/CustomText"
import { AddSelectedFile, ClearFiles, RemoveSelectedFile, SetIsRename, WindowAddTab } from "@/store/actions"
import useStore from "@/hooks/useStore"
import useFS from "@/hooks/useFS"
import { desktopFileProps } from "@/types/DesktopItem"
import { Loader } from "@mantine/core"
import useSettings from "@/hooks/useSettings"

const DesktopFile = ({
  title,
  icon,
  onClick,
  onDoubleClick,
  path,
  isProgram
}: desktopFileProps) => {

  const { states, dispatch } = useStore()

  const [isItemSelected, setIsItemSelected] = useState(false)
  const [inputValue, setInputValue] = useState(title)
  const [isRename, setIsRename] = useState(false)

  const { fs } = useFS()
  const {settings} = useSettings()

  useEffect(() => {
    if(states.File.selectedFiles.includes(path)){
      setIsItemSelected(true)
    }else{
      setIsItemSelected(false)
    }
  }, [states.File.selectedFiles])

  const CodeExtension = ["js" || "ts" || "css"]

  const [Image64, setImage64] = useState<string | null>(null)


  const handlerOpen = (extension:string) => {
    if(isProgram) return
    switch (extension) {
      case "txt":
        return(
          dispatch(WindowAddTab({
            title: 'Notepad',
            tab: {
              title: 'Notepad',
              ficTitle: title,
              uuid: uuid(6),
              value: path,
              maximized: false,
              minimized: false
            }
          }))
        )
    case 'md':
      return(
        dispatch(WindowAddTab({
          title: 'Markdown Editor',
          tab: {
            title: 'Markdown Editor',
            ficTitle: title,
            uuid: uuid(6),
            value: path,
            maximized: false,
            minimized: false,
          }
        }))
      )
    case 'rtf':
      return(
        dispatch(WindowAddTab({
          title: 'Rich Text Editor',
          tab: {
            title: 'Rich Text Editor',
            ficTitle: title,
            uuid: uuid(6),
            value: path,
            maximized: false,
            minimized: false,
          }
        }))
      )
    case 'pdf':
      return(
        dispatch(WindowAddTab({
          title: 'PDF Reader',
          tab: {
            title: 'PDF Reader',
            ficTitle: title,
            uuid: uuid(6),
            value: path,
            maximized: false,
            minimized: false,
          }
        }))
      )
    case 'mp3':
      return(
        dispatch(WindowAddTab({
          title: 'Music Player',
          tab: {
            title: 'Music Player',
            ficTitle: title,
            uuid: uuid(6),
            value: path,
            maximized: false,
            minimized: false,
          }
        }))
      )
    case 'js':
    case 'ts':
    case 'jsx':
    case 'tsx':
    case 'json':
    case 'html':
    case 'css':
    case 'py':
      return(
        dispatch(WindowAddTab({
          title: 'Code Editor',
          tab: {
            title: 'Code Editor',
            ficTitle: title,
            uuid: uuid(6),
            value: path,
            maximized: false,
            minimized: false,
          }
        }))
      )
    case 'mp4':
      return(
        dispatch(WindowAddTab({
          title: 'Video Player',
          tab: {
            title: 'Video Player',
            ficTitle: title,
            uuid: uuid(6),
            value: path,
            maximized: false,
            minimized: false,
          }
        }))
      )
      case 'xlsx':
      return(
        dispatch(WindowAddTab({
          title: 'SpreadSheet',
          tab: {
            title: 'SpreadSheet',
            ficTitle: title,
            uuid: uuid(6),
            value: path,
            maximized: false,
            minimized: false,
          }
        }))
      )
      
    }
  }

  useEffect(() => {
    if(path === '/') return
    if(!verifyIfIsImage(title)) return
    if(!path) return
    fs?.readFile(path,'utf-8', (err, data) => {
      if(data){
        setImage64(data)
      }else{
        console.log(err);
      }
    })
  }, [path,fs])

  useEffect(() => {
    if(!states.File.setIsRename) return
    if(!states.File.selectedFiles.length) return
    if(states.File.selectedFiles.includes(path)){
      setIsRename(true)
    }
  },[states.File.selectedFiles, states.File.setIsRename])

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

  
  const [fileTextColor, setFileTextColor] = useState(settings?.desktop.desktopIcon.textColor || 'rgba(0, 0, 0, 1)')
  const [defaultSystemHighlightColor, setDefaultSystemHighlightColor] = useState(settings?.system?.systemHighlightColor)
  
  useEffect(() => {
    setFileTextColor(settings?.desktop.desktopIcon.textColor || 'rgba(0, 0, 0, 1)')
  }, [settings?.desktop.desktopIcon.textColor])

  useEffect(() => {
    setDefaultSystemHighlightColor(settings?.system?.systemHighlightColor)
  }, [settings?.system?.systemHighlightColor])

  return (
    <>
      <div
        onClick={() => {
          onClick && onClick()
          if(isProgram) return
          dispatch(AddSelectedFile(path))
          if (isItemSelected) {
            dispatch(RemoveSelectedFile(path))
          }
        }}
        onDoubleClick={() => {
          onDoubleClick && onDoubleClick()
          if(isProgram) return
          if(verifyIfIsImage(title)){
            return(
              dispatch(WindowAddTab({
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
            )
          }
          handlerOpen(getExtension(title))
        }}
        onDragStart={(e) => {
          dispatch(AddSelectedFile(path))
          //from
        }}
        className={`
        h-28 p-px m-px
        flex flex-col justify-evenly items-center cursor-pointer
        hover:bg-cyan-200 transition-all duration-300 ease-in-out
        hover:bg-opacity-60 rounded-md
        
        `}
        style={{
          backgroundColor: isItemSelected ? defaultSystemHighlightColor : 'transparent'
        }}
      >
        {
          
        }
        {renderIcon()}
        {isRename ?
          <input
            className="w-16 h-6 bg-slate-100 text-black rounded bg-opacity-70 text-xs outline-none text-center "
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
                color: `${fileTextColor || 'rgba(0, 0, 0, 1)'}`
              }
            }
          />
        }
      </div>
    </>
  )
}

export default DesktopFile