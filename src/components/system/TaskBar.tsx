import React from 'react'
import StartMenu from './StartMenu'



const TaskBarItem = () => {
  return (
    <div className='          
    flex items-center w-36 bg-slate-50 
    bg-opacity-50 backdrop-filter backdrop-blur-sm
    justify-between px-2 mx-px h-full cursor-pointer'>
    <span className='i-mdi-folder text-2xl'
    style={{
      color: '#42A3F2'
    }}
    >TaskBarItem</span>
      Item
    </div>
  )
}

const TaskBar = () => {
  return (
    <footer
      className='fixed bottom-0 left-0 w-full h-10 
    bg-opacity-20 backdrop-filter backdrop-blur-sm
    border-t border-white border-opacity-20 flex justify-start items-center
    '
    >
      <div className='w-11/12 flex h-full justify-start items-center flex-wrap overflow-hidden'>
        <StartMenu />

        <TaskBarItem />
      </div>
      <div className='w-1/12 bg-red-50 h-full flex justify-end items-center pr-1'>
        Tools
      </div>
    </footer>
  )
}

export default TaskBar