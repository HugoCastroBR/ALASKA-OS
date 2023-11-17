import type { MouseMenuContext } from '@/types/system'
import React from 'react'
const MouseMenuContext = ({
  x,
  y,
  visible,
}:MouseMenuContext) => {
  if (!visible) return null
  return (
    <div
      className={`
      bg-gray-300 
        drop-shadow-md shadow-md shadow-gray-800 
        flex flex-col w-44 z-40  
        bg-opacity-20 backdrop-filter backdrop-blur-sm
        py-px
    `}
      style={{
        position: 'absolute',
        top: y,
        left: x,
        zIndex: 100,
      }}
    >
      {/* <MouseOptionCopy /> */}
    </div>
  )
}

export default MouseMenuContext