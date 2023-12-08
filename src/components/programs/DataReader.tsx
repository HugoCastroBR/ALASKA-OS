import useStore from '@/hooks/useStore'
import React, { useEffect } from 'react'
import { JsonViewer, defineDataType } from '@textea/json-viewer'
import { programProps } from '@/types/programs'
import DefaultWindow from '../containers/DefaultWindow'
import useFS from '@/hooks/useFS'

const DataReader = ({
  AlaskaWindow,
  tab,
}:programProps) => {

  const {states, dispatch} = useStore()
  const {fs} = useFS()

  const [data, setData] = React.useState<any>(null)

  useEffect(() => {
    if(!fs) return
      if(tab.value){
      fs.readFile(tab.value, 'utf-8', (err, data) => {
        if(err) return console.error(err)
        if(data){
          try {
            setData(JSON.parse(data))
          } catch (error) { 
            console.log(error);
            setData(data)
          }
        }
      })
    }
    
  },[tab.value, tab.content,fs])

  return (
    <DefaultWindow
      currentWindow={AlaskaWindow}
      currentTab={tab}
      title={tab.ficTitle || tab.title}
      resizable
      onClose={() => {}}
      onMinimize={() => {}}
      onMaximize={() => {}}
      uuid={tab.uuid}
    >
      <div
        className='w-full h-full flex flex-col justify-center items-center overflow-auto'
        style={{
          backgroundColor: 'white',
        }}
      >
        <JsonViewer
          displayDataTypes
          displaySize
          style={{
            width: '100%',
            height: '100%',
          }}
          className='overflow-auto h-full w-full'
          value={data} // JSON object
        />
      </div>
    </DefaultWindow>
  )
}

export default DataReader