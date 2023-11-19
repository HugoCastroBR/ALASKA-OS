import { programProps } from '@/types/programs'
import React, { useEffect, useState } from 'react'
import DefaultWindow from '../containers/DefaultWindow'
import MDEditor, { selectWord } from "@uiw/react-md-editor";
import { removeExtension, extractParentPath, getExtension } from '@/utils/file';
import { Button, Divider } from '@mantine/core';
import CustomText from '../atoms/CustomText';
import AppTaskMenu from '../molecules/AppTaskMenu';
import useFS from '@/hooks/useFS';

const MarkdownEditor = ({
  tab,
  window,
}: programProps) => {

  const { fs } = useFS()


  useEffect(() => {
    if (!tab.value) return
    if (tab.value === '/Desktop') return
    fs?.readFile(`${tab.value}`, 'utf8', (err, data) => {
      if (err) throw err
      if (data) {
        setContent(data)
      }
    })
  }, [fs])


  const [content, setContent] = React.useState(tab.content || '')


  const [saveAsInputOpen, setSaveAsInputOpen] = useState(false);
  const [saveAsName, setSaveAsName] = useState<string>(`${removeExtension(tab.ficTitle || '')}_new`)
  const handlerSaveAs = () => {
    console.log(tab.value)
    if (!tab.value) return
    if (tab.value === '/Desktop') {
      const fileNewName = `${tab.value}/${saveAsName}.md`
      fs?.writeFile(`${fileNewName}`, content, (err) => {
        if (err) throw err
        console.log('File Saved!')
        setSaveAsInputOpen(false)
      })
    } else {
      const fileNewName = `${extractParentPath(tab.value || '/')}/${saveAsName}.${getExtension(tab.value || '/')}`
      fs?.writeFile(`${fileNewName}`, content, (err) => {
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
        title={tab.ficTitle || tab.title}
        resizable
        uuid={tab.uuid}
        onClose={() => { }}
        onMaximize={() => { }}
        onMinimize={() => { }}
      >
        <AppTaskMenu

          onSave={() => {
            if (!tab.value) return
            if (tab.value === '/Desktop') return
            fs?.writeFile(`${tab.value}`, content, (err) => {
              if (err) throw err
              console.log('File Saved!')
            })
          }}
          onSaveAs={() => {
            setSaveAsInputOpen(true)
          }}
        />

        <div data-color-mode="light" className='w-full h-full !z-10 mt-6'>
          <MDEditor style={{ zIndex: 1 }} className='w-full h-full !z-10' height={'100%'} value={content} onChange={(content) => {
            setContent(content || '')
          }} />
        </div>
      </DefaultWindow>
    </>
  )
}

export default MarkdownEditor