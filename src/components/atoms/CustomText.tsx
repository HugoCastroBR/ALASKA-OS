import React from 'react'


interface CustomTextProps {
  text: string
  className?: string,
  style?: React.CSSProperties
}
const CustomText = ({
  text,
  className,
  style
}:CustomTextProps) => {
  return (
    <span className={`
      text-gray-900 font-medium text-sm
    ${className}
    `}
    style={style}
    >
      {text}
    </span>
  )
}

export default CustomText