'use client'
import React, { useEffect, useState } from 'react'
import useFS from '@/hooks/useFS'
import { Button, Divider } from '@mantine/core'
import CustomText from '../atoms/CustomText'
import { extractParentPath, getExtension, removeExtension } from '@/utils/file'
import { programProps } from '@/types/programs'
import DefaultWindow from '../containers/DefaultWindow'
import AppTaskMenu from '../molecules/AppTaskMenu'

const Notepad = ({
  tab,
  window,
}: programProps) => {

  const [text, setText] = useState<string>('')
  const { fs } = useFS()
  const [saveAsInputOpen, setSaveAsInputOpen] = useState(false);
  const [saveAsName, setSaveAsName] = useState<string>(`${removeExtension(tab.ficTitle || '')}_new`)
  useEffect(() => {
    if (!tab.value) return
    if (tab.value === '/Desktop') return
    fs?.readFile(`${tab.value}`, 'utf8', (err, data) => {
      if (err) throw err
      if (data) {
        setText(data)
      }
    })
  }, [fs])


  const handlerSaveAs = () => {
    console.log(tab.value)
    if (!tab.value) return
    if (tab.value === '/Desktop') {
      const fileNewName = `${tab.value}/${saveAsName}.txt`
      fs?.writeFile(`${fileNewName}`, text, (err) => {
        if (err) throw err
        console.log('File Saved!')
        setSaveAsInputOpen(false)
      })
    } else {
      const fileNewName = `${extractParentPath(tab.value || '/')}/${saveAsName}.${getExtension(tab.value || '/')}`
      fs?.writeFile(`${fileNewName}`, text, (err) => {
        if (err) throw err
        console.log('File Saved!')
        setSaveAsInputOpen(false)
      })
    }

  }

  return (
    <>
      {saveAsInputOpen &&
        <DefaultWindow
          currentTab={tab}
          currentWindow={window}
          preventDefaultClose
          onClose={() => {
            setSaveAsInputOpen(false)
          }}
          title='Save As'
          uuid={tab.uuid}
          className='absolute !w-64 !h-32 bg-slate-200 bg-opacity-60 flex  !z-40  '>
          <div className='w-full h-full flex flex-col justify-evenly items-end'>
            <input
              autoFocus
              defaultValue={`${removeExtension(tab.ficTitle || '')}_new`}
              onChange={(e) => {
                setSaveAsName(e.target.value)
              }}
              placeholder='File Name'
              className='
              mr-2
              w-60 h-8 bg-gray-200 flex flex-col resize
              outline-none rounded-md border border-gray-400
            '
            />
            <Button
              onClick={() => {
                handlerSaveAs()
              }}
              styles={{
                root: {
                  backgroundColor: 'transparent',
                  color: '#fff',
                  width: '6rem',
                  height: '2rem',
                  marginRight: '8px',
                  borderRadius: '0.25rem',
                  border: '1px solid gray',
                  outline: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease-in-out',
                }
              }}
            >
              <CustomText text='Save' />
            </Button>
          </div>
        </DefaultWindow>
      }
      <DefaultWindow
        currentTab={tab}
        currentWindow={window}
        title={tab.ficTitle || 'Notepad'}
        uuid={tab.uuid}
        onClose={() => { }}
        onMaximize={() => { }}
        onMinimize={() => { }}
        resizable
      >
        <AppTaskMenu

          onSave={() => {
            if (!tab.value) return
            if (tab.value === '/Desktop') return
            fs?.writeFile(`${tab.value}`, text, (err) => {
              if (err) throw err
              console.log('File Saved!')
            })
          }}
          onSaveAs={() => {
            setSaveAsInputOpen(true)
          }}
        />
        <textarea
          value={text}
          autoFocus
          onChange={(e) => {
            setText(e.target.value)
          }}
          className='
          w-full h-full bg-white flex flex-col
          outline-none
          '
        />

      </DefaultWindow>
    </>
  )
}

export default Notepad