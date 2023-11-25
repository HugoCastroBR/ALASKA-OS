
import { programProps } from '@/types/programs'
import React, { useEffect, useState } from 'react'
import DefaultWindow from '../containers/DefaultWindow'
import Editor, { useMonaco } from '@monaco-editor/react';
import { Button, Loader } from '@mantine/core';
import { extractParentPath, getExtension, removeExtension } from '@/utils/file';
import useFS from '@/hooks/useFS';
import AppTaskMenu from '../molecules/AppTaskMenu';
import CustomText from '../atoms/CustomText';
import Console from '../system/Console';
import useCommands from '@/hooks/useCommands';
import useStore from '@/hooks/useStore';
import { usePython } from 'react-py';
import useProcess from '@/hooks/useProcess';
const CodeEditor = ({
  tab,
  window
}: programProps) => {

  const monaco = useMonaco()
  const { fs } = useFS()
  const { stdout } = usePython()
  const { runPythonScript } = useProcess()
  const { states, dispatch } = useStore()
  const { setHistory } = useCommands()

  const [language, setLanguage] = React.useState('javascript')
  const [loading, setLoading] = React.useState(true);
  const [content, setContent] = React.useState(tab.content || '')



  const getLanguage = (path: string) => {
    const extension = getExtension(path)
    switch (extension) {
      case 'js':
        return 'javascript'
      case 'ts':
        return 'typescript'
      case 'css':
        return 'css'
      case 'html':
        return 'html'
      case 'json':
        return 'json'
      case 'tsx':
        return 'typescript'
      case 'jsx':
        return 'javascript'
      case 'py':
        return 'python'
      default:
        return 'javascript'
    }
  }


  useEffect(() => {
    setLanguage(getLanguage(tab.value || 'js'))
  }, [tab])


  useEffect(() => {
    if (!tab.value) {
      setLoading(false)
      return
    }
    if (tab.value === '/Desktop') {
      setLoading(false)
      return
    }
    fs?.readFile(`${tab.value}`, 'utf8', (err, data) => {
      if (err) throw err
      if (data) {
        // console.log(data)
        if (!content) {
          setContent(data)
        }

      }
    })
    setLoading(false)
  }, [monaco, fs, tab])

  const [saveAsInputOpen, setSaveAsInputOpen] = useState(false);
  const [saveAsName, setSaveAsName] = useState<string>(`${removeExtension(tab.ficTitle || '')}_new`)
  const handlerSaveAs = () => {
    console.log(tab.value)
    if (!tab.value) return
    if (tab.value === '/Desktop') {
      const fileNewName = `${tab.value}/${saveAsName}.${getExtension(tab.value || 'no.js')}}`
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

  const [consoleOpen, setConsoleOpen] = useState(true)

  if (loading) {
    return (
      <DefaultWindow
        currentTab={tab}
        currentWindow={window}
        title='Code Editor'
        uuid={tab.uuid}
        resizable
        onClose={() => { }}
        onMaximize={() => { }}
        onMinimize={() => { }}
      >
        <div
          className='w-full h-full flex items-center justify-center
      bg-white bg-opacity-40 
      '>
          <Loader size={128} />
        </div>
      </DefaultWindow>
    )
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
        title='Code Editor'
        uuid={tab.uuid}
        resizable
        onClose={() => { }}
        onMaximize={() => { }}
        onMinimize={() => { }}
      >
        <AppTaskMenu
          codeMode
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
          onRun={ () => {
            setHistory([])
            // console.log(content)
            if (language === 'python') {
              runPythonScript(content)
              return
            }
            
            eval(content)
          }}
          closeConsole={() => {
            setConsoleOpen(!consoleOpen)
          }}
        />
        <div className='w-full h-full mt-6 flex flex-col'>
          <Editor
            height={`${consoleOpen ? '67%' : '100%'}`}
            language={language}
            theme="vs-light"
            loading={
              <div className='w-full h-4/6 bg-bg-slate-200 bg-opacity-80  flex items-center justify-center '>
                <Loader size={128} />
              </div>}
            options={{
              autoIndent: 'full',
              contextmenu: true,
              fontFamily: 'monospace',
              fontSize: 13,
              lineHeight: 24,
              hideCursorInOverviewRuler: true,
              matchBrackets: 'always',
              minimap: {
                enabled: true,
              },
              scrollbar: {
                horizontalSliderSize: 4,
                verticalSliderSize: 18,
              },
              selectOnLineNumbers: true,
              roundedSelection: false,
              readOnly: false,
              cursorStyle: 'line',
              automaticLayout: true,
            }}
            value={content}
            onChange={(value) => setContent(value || '')}
          />
          {consoleOpen &&
            <div className='h-2/6 w-full'>
              <Console
                tab={tab}
                window={window}
                key={tab.uuid}
                vanilla
                interceptBrowserConsole
              />
            </div>
          }
        </div>
      </DefaultWindow>
    </>
  )
}

export default CodeEditor