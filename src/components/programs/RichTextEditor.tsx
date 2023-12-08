'use client'
import React, { useEffect, useState } from 'react'
import { RichTextEditor, Link } from '@mantine/tiptap';
import { BubbleMenu, useEditor } from '@tiptap/react';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';
import CustomText from '../atoms/CustomText';
import { Button, Divider, Loader, LoadingOverlay } from '@mantine/core';
import useStore from '@/hooks/useStore';
import useFS from '@/hooks/useFS';
import { removeExtension, extractParentPath, getExtension, toArrayBuffer, base64ToArrayBuffer, htmlToArrayBuffer, htmlToBase64, toBase64, encodedBase64ToArrayBuffer } from '@/utils/file';
import RingLoader from '../atoms/RingLoader';
import { programProps } from '@/types/programs';
import DefaultWindow from '../containers/DefaultWindow';
import AppTaskMenu from '../molecules/AppTaskMenu';
import mammoth from 'mammoth';


const RichTextEditorComponent = ({
  tab,
  AlaskaWindow,
}: programProps) => {



  const [text, setText] = useState<string>('')
  const { fs } = useFS()

  const [saveAsInputOpen, setSaveAsInputOpen] = useState(false);
  const [saveAsName, setSaveAsName] = useState<string>(`${removeExtension(tab.ficTitle || '')}_new`)
  const [isLoading, setIsLoading] = useState(false)
  const [isDocument, setIsDocument] = useState(false)
  const documentsType = ['doc', 'docx']

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ]
    ,
    onUpdate({ editor }) {
      const content = editor.getHTML()
      console.log(content)
      setText(content)
    },
    content: text,
  });
  useEffect(() => {
    if (!tab.value) return
    if (tab.value === '/Desktop') return
    if(documentsType.includes(getExtension(tab.value || '/'))){
      setIsDocument(true)
      setIsLoading(true)
      fs?.readFile(`${tab.value}`,'utf-8', (err, data) => {
        if (err) throw err
        if (data) {

          const arrayBuffer = base64ToArrayBuffer(data)
          console.log(typeof ArrayBuffer)
          mammoth.convertToHtml({ arrayBuffer }).then((result) => {
            const html = result.value 
            console.log(html)
            editor?.commands.setContent(html)
            setText(html)
            setIsLoading(false)
          }).catch((err) => {
            console.log(err)
            setIsLoading(false)
            // Handle the error
          })
        }
        
      })
    }else{
      setIsLoading(true)
      fs?.readFile(`${tab.value}`, 'utf8', (err, data) => {
        if (err) throw err
        if (data) {
          editor?.commands.setContent(data)
          setText(data)
        }
        console.log(data)
        setIsLoading(false)
      })
    }
    
  }, [fs])


  const handlerSaveAs = () => {
    console.log(tab.value)
    if (!tab.value) return
    if (tab.value === '/Desktop') {
      const fileNewName = `${tab.value}/${saveAsName}.rtf`
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

  if (isLoading) {
    return (
      <DefaultWindow
        title='Rich Text Editor'
        className='w-2/4 h-3/5 flex flex-col '
        currentTab={tab}
        currentWindow={AlaskaWindow}
        uuid={tab.uuid}
        resizable>
        <div className='bg-black h-full w-full flex justify-center items-center'>
          <Loader
            color='white'
            size={100}
          />
        </div>
      </DefaultWindow>
    )
  }

  return (
    <>
      {saveAsInputOpen &&
        <DefaultWindow
          currentTab={tab}
          currentWindow={AlaskaWindow}
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
        title={tab.ficTitle || 'Rich Text Editor'}
        className='w-2/4 h-3/5 flex flex-col bg-white '
        currentTab={tab}
        onClose={() => { }}
        onMaximize={() => { }}
        onMinimize={() => { }}
        currentWindow={AlaskaWindow}
        uuid={tab.uuid}
        resizable
      >
        <div className='w-full h-full bg-white pb-16 '>
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
          <div className='h-full w-full overflow-hidden'>
          <RichTextEditor editor={editor}
              className='w-full h-full pt-10 mt-16'

              styles={{
                root:{
                  overflow:'hidden',
                  marginTop:'20px',
                },
                content: {
                  width: '100%',
                  height: '100%',
                  minHeight: '100%',
                  overflow: 'auto',
                  padding: '1rem',
                  marginTop: '60px',
                  border: 'none',
                },
                toolbar: {
                  position: 'fixed',
                  top: 48,
                  zIndex: 10,
                  backgroundColor: '#fff',
                  borderBottom: '1px solid #ddd',
                  width: '100%',
                  padding: '1rem',
                },

              }}
            >
              {editor && (
                <BubbleMenu editor={editor}>
                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Bold />
                    <RichTextEditor.Italic />
                    <RichTextEditor.Link />
                  </RichTextEditor.ControlsGroup>
                </BubbleMenu>
              )}
              <RichTextEditor.Toolbar  >

                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.CodeBlock />
                </RichTextEditor.ControlsGroup>
                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.Bold />
                  <RichTextEditor.Italic />
                  <RichTextEditor.Underline />
                  <RichTextEditor.Strikethrough />
                  <RichTextEditor.ClearFormatting />
                  <RichTextEditor.Highlight />
                  <RichTextEditor.Code />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.H1 />
                  <RichTextEditor.H2 />
                  <RichTextEditor.H3 />
                  <RichTextEditor.H4 />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.Blockquote />
                  <RichTextEditor.Hr />
                  <RichTextEditor.BulletList />
                  <RichTextEditor.OrderedList />
                  <RichTextEditor.Subscript />
                  <RichTextEditor.Superscript />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.Link />
                  <RichTextEditor.Unlink />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.AlignLeft />
                  <RichTextEditor.AlignCenter />
                  <RichTextEditor.AlignJustify />
                  <RichTextEditor.AlignRight />
                </RichTextEditor.ControlsGroup>



              </RichTextEditor.Toolbar>

              <RichTextEditor.Content
                className='!h-full' />
            </RichTextEditor>
          </div>
        </div>
      </DefaultWindow>
    </>
  )
}

export default RichTextEditorComponent