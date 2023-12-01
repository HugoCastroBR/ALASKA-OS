'use client'

import React, {  useState } from "react"
import Image from "next/image"
import useStore from "@/hooks/useStore"
import useFS from "@/hooks/useFS"
import { ApiError } from "next/dist/server/api-utils"
import { ClearFiles, SetIsNewFolder } from "@/store/actions"
const NewDirFolderItem = ({
  title,
  icon,

}: {
  title: string
  icon?: string
}) => {

  const {fs} = useFS()

  const { states, dispatch } = useStore()
  const [inputValue, setInputValue] = useState('')

  return (
    <>
      <div
        className={`
        h-24 px-4
        flex flex-col justify-evenly items-center cursor-pointer
        transition-all duration-300 ease-in-out
        mt-2
        `}
      >
        {icon && <Image src={icon} alt={title} width={48} height={48} />}
        <input 
          className="w-16 h-6 bg-slate-100 bg-opacity-70 rounded text-black text-xs outline-none text-center "
          onChange={(e) => setInputValue(e.target.value)}
          autoFocus
          value={inputValue}
          onKeyPress={(e) => {
            if(e.key === 'Enter'){
              fs?.mkdir(`${states.Mouse.mouseInDesktop ? '/Desktop' : states.Mouse.mousePath}/${inputValue}`, (err:ApiError) => {
                if(err){
                  console.log(err);
                }else{
                  console.log('created');
                }
                dispatch(ClearFiles())
                dispatch(SetIsNewFolder(false))
              })
            }
          }}
        />
      </div>
    </>
  )
}

export default NewDirFolderItem
