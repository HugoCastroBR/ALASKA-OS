'use client'
import React, { useEffect } from 'react'
import DefaultWindow from '../containers/DefaultWindow'
import { Divider } from '@mantine/core'
import { programProps } from '@/types/programs'
import useStore from '@/hooks/useStore'
import { WindowSetTabFocused } from '@/store/actions'

const Browser = ({
  tab,
  AlaskaWindow,
}: programProps) => {

  const { states, dispatch } = useStore()

  const [sites, setSites] = React.useState<string[]>(
    [
      'https://www.google.com/webhp?igu=1',
      'https://www.wikipedia.org/',
      'https://archive.org/',
      'https://windows96.net/'
    ]
  )

  const [history, setHistory] = React.useState<string[]>([])
  const [currentSite, setCurrentSite] = React.useState<string>('https://www.google.com/webhp?igu=1')
  const [isLocal, setIsLocal] = React.useState<boolean>(false)
  const [url, setUrl] = React.useState<string>('https://www.google.com/webhp?igu=1')

  React.useEffect(() => {
    setHistory([...history, currentSite])
  }, [currentSite])

  useEffect(() => {
    if(tab.value === '/Desktop'){
      setIsLocal(false)
      setUrl('https://www.google.com/webhp?igu=1')
      setCurrentSite('https://www.google.com/webhp?igu=1')
    }else{
      setIsLocal(true)
    }
  }, [tab.value])


  return (
    <DefaultWindow
      currentTab={tab}
      currentWindow={AlaskaWindow}
      title='Browser'
      resizable
      uuid={tab.uuid}
      onClose={() => { }}
      onMaximize={() => { }}
      onMinimize={() => { }}
    >
      <div className='w-full  h-20 flex flex-col p-1 bg-slate-200  justify-start'>
        <div className='
        w-full h-3/5  rounded-md flex items-center 
        bg-slate-200 bg-opacity-40
        
        '>
          <div className='w-2/12 h-full flex justify-evenly items-center  '>
            <span
              onClick={() => {
                setCurrentSite(history[history.length - 2])
                setUrl(history[history.length - 2])
              }}
              className='
            i-mdi-arrow-left text-xl cursor-pointer hover:text-blue-500 transition-all duration-300 ease-in-out
            '></span>
            <span
              onClick={
                () => {
                  setCurrentSite(history[history.length - 1])
                  setUrl(history[history.length - 1])
                }
              }
              className='
            i-mdi-arrow-right text-xl cursor-pointer hover:text-blue-500 transition-all duration-300 ease-in-out
            '></span>
            <span
              onClick={() => {
                setCurrentSite(currentSite)
                
              }}
              className='
            i-mdi-refresh text-2xl cursor-pointer hover:text-blue-500 transition-all duration-300 ease-in-out
            '
            ></span>
          </div>
          <div className='w-full h-full flex items-center justify-start px-1'>
            <input
              placeholder='Search or enter website name'
              className='
            w-full h-2/3 bg-slate-100 border border-slate-200 border-opacity-40 p-0.5  rounded-md
            focus:outline-none 
            '
              onChange={(e) => {
                // setCurrentSite(e.target.value)
                setUrl(e.target.value)
              
              }}
              value={!isLocal ? url : tab.ficTitle}
              
              type='text'
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  setIsLocal(false)
                  setCurrentSite(url)
                }
              
              }}
            />
          </div>
        </div>
        <Divider className='w-full' />
        <div className='h-2/5 w-6/12 flex pl-1' >
          <div
            onClick={() => {
              setIsLocal(false)
              setCurrentSite(sites[0])
              setUrl(sites[0])
            }}
            className='
          w-1/12 h-full flex justify-center items-center cursor-pointer
          hover:bg-blue-400 hover:bg-opacity-40 transition-all duration-300 ease-in-out m-px
          '>
            <span className='i-mdi-google text-xl text-black'></span>

          </div>
          <div
            onClick={() => {
              setIsLocal(false)
              setCurrentSite(sites[1])
              setUrl(sites[1])
            }}
            className='
          w-1/12 h-full flex justify-center items-center cursor-pointer
          hover:bg-blue-400 hover:bg-opacity-40 transition-all duration-300 ease-in-out m-px
          '>
            <span className='i-mdi-wikipedia text-xl text-black'></span>
          </div>
          <div
            onClick={() => {
              setIsLocal(false)
              setCurrentSite(sites[2])
              setUrl(sites[2])
            }}
            className='
          w-1/12 h-full flex justify-center items-center cursor-pointer
          hover:bg-blue-400 hover:bg-opacity-40 transition-all duration-300 ease-in-out m-px
          '>
            <span className='i-mdi-archive-outline text-xl text-black'></span>
          </div>
          <div
            onClick={() => {
              setIsLocal(false)
              setCurrentSite(sites[3])
              setUrl(sites[3])
            }}
            className='
          w-1/12 h-full flex justify-center items-center cursor-pointer
          hover:bg-blue-400 hover:bg-opacity-40 transition-all duration-300 ease-in-out m-px
          '>
            <span className='i-mdi-windows-classic text-xl text-black'></span>
          </div>
        </div>
      </div>
      <div className='h-full'>
        {!isLocal ?
          <iframe
            onClick={() => {
              dispatch(WindowSetTabFocused({
                title: AlaskaWindow.title || '',
                uuid: tab.uuid || '',
              }))
            }}
            src={currentSite}
            className='w-full h-full'
          />
          :
          <iframe
            onClick={() => {
              dispatch(WindowSetTabFocused({
                title: AlaskaWindow.title || '',
                uuid: tab.uuid || '',
              }))
            }}
            srcDoc={tab.value}
            className='w-full h-full bg-white'
          />
        }
      </div>
    </DefaultWindow>
  )
}

export default Browser