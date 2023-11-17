import React from 'react'
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { SimpleGrid } from '@mantine/core';
import DefaultWindow from '../containers/DefaultWindow';
import Console from './Console';
import useStore from '@/hooks/useStore';

const DesktopView = () => {


  const {states, dispatch} = useStore()

  const generateGrid = () => {
    const grid = []
    for(let i = 0; i < 160; i++){
      grid.push(
      <div 
        key={i}
        className='
        h-28 w-24 border border-slate-100 border-opacity-40
        flex flex-col justify-evenly items-center
        hover:bg-gray-600 transition-all duration-300 ease-in-out
        '>
          {i +1}
        </div>
      )
    }
    return grid
  }

  const handleRenderTabs = () => {
    return states.Windows.windows.map((window, index) => {
      return window.tabs.map((tab, index) => {
        switch (tab.title) {
          case 'Console':
            return(
              <Console
              key={index}
              tab={tab}
              window={window}
            />
            )
            
          default:
            return (<></>)
        }
      })
    })
  }

  return (
    <div 
    id='desktop-view'
    className='w-full 
    overflow-hidden
    '
    style={{
      height: 'calc(100vh - 40px)'
    }}
    >
      <Dropzone
        onDrop={(files) => console.log(files)}
        className='w-full h-full flex justify-center items-center'
        onClick={(e) => e.stopPropagation()}
      >
        {handleRenderTabs()}
        <SimpleGrid cols={20} verticalSpacing={1} spacing={2}>

          {/* {generateGrid()} */}
        </SimpleGrid>
      </Dropzone>
    </div>
  )
}

export default DesktopView