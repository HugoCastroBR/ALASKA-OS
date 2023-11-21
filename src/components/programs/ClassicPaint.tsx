import React from 'react'
import DefaultWindow from '../containers/DefaultWindow'
import { programProps } from '@/types/programs'

const ClassicPaint = ({
  tab,
  window
}:programProps) => {
  return (
    <DefaultWindow
      currentTab={tab}
      currentWindow={window}
      title='Classic Paint'
      uuid={tab.uuid}
      onClose={() => { }}
      onMaximize={() => { }}
      onMinimize={() => { }}
      resizable
    >
      <iframe src="https://jspaint.app" width="100%" height="100%"></iframe>
    </DefaultWindow>
  )
}

export default ClassicPaint