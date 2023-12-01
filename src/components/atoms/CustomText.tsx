import useStore from '@/hooks/useStore'
import React from 'react'


interface CustomTextProps {
  text: string
  className?: string,
  style?: React.CSSProperties
  onClick?: () => void
}
const CustomText = ({
  text,
  className,
  style,
  onClick,
}:CustomTextProps) => {

  const {states} = useStore()


  if(!style){
    return (
      <span className={`
        text-gray-900 font-medium text-sm
      ${className}
      `}
      style={{
        color: states.Settings.settings.system.systemTextColor
      }}
      onClick={onClick}
      >
        {text}
      </span>
    )
  }
  return (
    <span className={`
      text-gray-900 font-medium text-sm
    ${className}
    `}
    onClick={onClick}
    style={style}
    >
      {text}
    </span>
  )
}

export default CustomText