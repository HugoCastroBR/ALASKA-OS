'use client'

import React, { useState } from "react"
import Image from "next/image"
import useStore from "@/hooks/useStore"
import useFS from "@/hooks/useFS"
const NewDirFileItem = ({
  title,
  icon,
  inExplorer,
  inExplorerCB,
  inExplorerPath
}: {
  title: string
  icon?: string
  inExplorer?: boolean
  inExplorerCB?: () => void
  inExplorerPath?: string
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
          className="w-16 h-6 bg-slate-200 text-black text-xs outline-none text-center "
          onChange={(e) => setInputValue(e.target.value)}
          autoFocus
          value={inputValue}
          onKeyPress={(e) => {
            if(!inExplorer){
              if (e.key === 'Enter') {
                console.log("TODO: Create new file");
              }
            }else{
              if (e.key === 'Enter') {
                fs?.writeFile(`${inExplorerPath}/${inputValue}`, '', () => {
                  inExplorerCB && inExplorerCB()
                })
              }
            }
          }}

        />

      </div>
    </>
  )
}

export default NewDirFileItem
