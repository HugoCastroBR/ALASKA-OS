import useSettings from '@/hooks/useSettings'
import React, { useEffect } from 'react'


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

  const {settings} = useSettings()
  const [defaultSystemTextColor, setDefaultSystemTextColor] = React.useState(settings?.system?.systemTextColor)
  useEffect(() => {
    setDefaultSystemTextColor(settings?.system?.systemTextColor)
  },[settings?.system?.systemTextColor])

  if(!style){
    return (
      <span className={`
        text-gray-900 font-medium text-sm
      ${className}
      `}
      style={{
        color: defaultSystemTextColor
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