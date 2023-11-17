import React from 'react'


interface CustomTextProps {
  text: string
  className?: string
}
const CustomText = ({
  text,
  className
}:CustomTextProps) => {
  return (
    <span className={`
      text-gray-900 font-medium text-sm
    ${className}
    `}>
      {text}
    </span>
  )
}

export default CustomText