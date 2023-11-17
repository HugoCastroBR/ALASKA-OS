import React from 'react'
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { SimpleGrid } from '@mantine/core';
import DefaultWindow from '../containers/DefaultWindow';
import Console from './Console';

const DesktopView = () => {

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
        <SimpleGrid cols={20} verticalSpacing={1} spacing={2}>
          <Console/>
          {/* {generateGrid()} */}
        </SimpleGrid>
      </Dropzone>
    </div>
  )
}

export default DesktopView