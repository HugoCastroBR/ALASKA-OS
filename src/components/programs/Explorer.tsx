'use client'

import { explorerProps } from '@/types/programs'
import React, { useEffect, useState } from 'react'
import { getExtension, verifyIfIsFile } from '@/utils/file'
import ExplorerActionBar from '../molecules/ExplorerActionBar'
import { Group, FileButton, Button, SimpleGrid } from '@mantine/core'
import useFS from '@/hooks/useFS'
import { generateIcon } from '@/utils/icons'
import useStore from '@/hooks/useStore'
import DefaultWindow from '../containers/DefaultWindow'
import DesktopFile from '../molecules/DesktopFile'
import DesktopFolder from '../molecules/DesktopFolder'
import CustomText from '../atoms/CustomText'
import NewDirFileItem from '../molecules/NewDirFileItem'
import NewDirFolderItem from '../molecules/NewDirFolderItem'
import { Dropzone } from '@mantine/dropzone'
import { SetMouseInDesktop, SetMousePath, WindowSetTabFocused } from '@/store/actions'



const Explorer = ({
  tab,
  window,
}: explorerProps) => {

  const { states, dispatch } = useStore()

  const { fs } = useFS()


  const [dirFiles, setDirFiles] = useState<string[]>([])
  const [currentPath, setCurrentPath] = useState<string>(tab.value || '/')

  useEffect(() => {
    fs?.readdir(currentPath, (err, files) => {
      if (err) throw err
      if (files) {

        setDirFiles(files)
      }
    })
  }, [fs])

  const Reload = async () => {
    await fs?.readdir(currentPath, (err, files) => {
      if (err) throw err
      if (files) {
        setDirFiles(files)
      }
    })
  }


  useEffect(() => {
    console.log(tab.value)
    Reload()
  }, [currentPath])

  const [file, setFile] = useState<File | null>(null);

  const [newFolderInputOpen, setNewFolderInputOpen] = useState(false);
  const [newFileInputOpen, setNewFileInputOpen] = useState(false);


  useEffect(() => {
    Reload()
  }, [fs, currentPath, states.File, states.Mouse])

  const uploadFileToDesktop = (fileName: string, fileContent: string) => {
    console.log(fileName)
    const desktopPath = '/Desktop';


    fs?.writeFile(`${desktopPath}/${fileName}`, fileContent, (err) => {
      if (err) throw err;
      console.log('File Saved!');
    });
  };

  const uploadFileToCurrentPath = (fileName: string, fileContent: string) => {
    console.log(currentPath)
    fs?.writeFile(`${currentPath}/${fileName}`, fileContent, (err) => {
      if (err) throw err;
      console.log('File Saved!');
    });
  }



  return (
    <DefaultWindow
      currentTab={tab}
      currentWindow={window}
      uuid={tab.uuid}
      onClose={() => { }}
      onMaximize={() => { }}
      onMinimize={() => { }}
      resizable
      title='Explorer'
    >
      <div
        className='w-full h-full flex flex-col bg-opacity-40 backdrop-blur-md'
        style={{
          backgroundColor: states.Settings.settings.system.systemBackgroundColor
        }}
        >
        <div className='flex w-full h-20  overflow-hidden'>
          <ExplorerActionBar
            onReload={Reload}
            onBack={() => {
              if (currentPath.split('/').slice(0, -1).join('/') === '') {
                setCurrentPath('/')
              } else {
                setCurrentPath(currentPath.split('/').slice(0, -1).join('/'))
              }
            }}
            path={currentPath}
          />
        </div>
        <div className='flex w-full h-full'>
          <div className='w-2/12 pt-2  bg-opacity-40 '
            style={{
              backgroundColor: states.Settings.settings.system.systemBackgroundColor
            }}
          >

            <Group justify="center">
              <FileButton onChange={async (e) => {
                if (e) {
                  const file = e
                  if (file.type === 'text/plain') {
                    const fileContent = await file.text()
                    uploadFileToDesktop(file.name, fileContent)
                    Reload()
                  }
                  if (file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/gif') {
                    const fileContent = await file.arrayBuffer()
                    const fileContentBase64 = Buffer.from(fileContent).toString('base64')
                    uploadFileToDesktop(file.name, fileContentBase64)
                  } if (file.type === 'application/pdf') {
                    const fileContent = await file.arrayBuffer()
                    const fileContentBase64 = Buffer.from(fileContent).toString('base64')
                    uploadFileToDesktop(file.name, fileContentBase64)
                  }
                  else {
                    console.log('not supported')
                    const fileContent = await file.arrayBuffer()
                    const fileContentBase64 = Buffer.from(fileContent).toString('base64')
                    uploadFileToDesktop(file.name, fileContentBase64)
                  }
                }
              }} >
                {(props) => <Button {...props}
                  className={`hover:bg-slate-100  transition-all duration-300 ease-in-out`}
                  styles={{
                    root: {
                      backgroundColor: 'transparent',
                      border: '1px solid white',
                      borderStyle: 'dashed',
                      color: states.Settings.settings.system.systemTextColor,
                      width: '90%'
                    }
                  }}
                >
                  <CustomText
                    text='Upload File'
                    className='text-white text-xs'
                  />
                </Button>}
              </FileButton>
              <Button
                onClick={() => {
                  setNewFileInputOpen(true)

                }}
                className={`hover:bg-slate-100  transition-all duration-300 ease-in-out`}
                styles={{
                  root: {
                    backgroundColor: 'transparent',
                    border: '1px solid white',
                    color: states.Settings.settings.system.systemTextColor,
                    width: '90%'
                  }
                }}
              >  <CustomText
                  text='New File'
                  className='text-xs'
                  style={{
                    color: states.Settings.settings.system.systemTextColor
                  }}
                /></Button>
              <Button
                onClick={() => {
                  setNewFolderInputOpen(true)
                }}
                className={`hover:bg-slate-100  transition-all duration-300 ease-in-out`}
                styles={{
                  root: {
                    backgroundColor: 'transparent',
                    border: '1px solid white',
                    color: states.Settings.settings.system.systemTextColor,
                    width: '90%'
                  }
                }}
              >  <CustomText
                  text='New Folder'
                  className='text-xs'
                  style={{
                    color: states.Settings.settings.system.systemTextColor
                  }}
                /></Button>
            </Group>


          </div>
          <Dropzone
            className='w-10/12  h-full flex  bg-opacity-40'
            style={{
              backgroundColor: states.Settings.settings.system.systemBackgroundColor
            }}
            onMouseEnter={() => {
              dispatch(SetMouseInDesktop(false))
              dispatch(SetMousePath(currentPath))
            }}
            onMouseLeave={() => {
              dispatch(SetMouseInDesktop(true))
              dispatch(SetMousePath(''))
            }}
            onDragOver={(e) => {
              e.stopPropagation()
              e.preventDefault()
              dispatch(SetMouseInDesktop(false))
              dispatch(SetMousePath(currentPath))
            }}
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
              dispatch(WindowSetTabFocused({
                title: window.title || '',
                uuid: tab.uuid || '',
              }))

            }}
            onDrop={(files) => {
              if (files) {
                files.forEach((file) => {
                  if (file.type === 'text/plain') {
                    file.text().then((text) => {
                      uploadFileToCurrentPath(file.name, text)
                      Reload()
                    })
                  }
                  if (file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/gif') {
                    file.arrayBuffer().then((buffer) => {
                      const fileContentBase64 = Buffer.from(buffer).toString('base64')
                      uploadFileToCurrentPath(file.name, fileContentBase64)
                      Reload()
                    })
                  }
                  if (file.type === 'application/pdf') {
                    file.arrayBuffer().then((buffer) => {
                      const fileContentBase64 = Buffer.from(buffer).toString('base64')
                      uploadFileToCurrentPath(file.name, fileContentBase64)
                      Reload()
                    })
                  }
                })

              }

            }}
          >
            <div className=' w-full flex justify-start items-start flex-wrap h-auto p-2'>

              {
                dirFiles.map((file, index) => {
                  if (verifyIfIsFile(file)) {
                    return (
                      <DesktopFile
                        key={`${file}-${index}`}
                        title={file}
                        icon={generateIcon(getExtension(file)) || '/assets/icons/file.png'}
                        path={`${currentPath}/${file}`.replaceAll('//', '/')}
                      />
                    )
                  } else {
                    return (
                      <DesktopFolder
                        onDoubleClick={async () => {
                          setCurrentPath(`${currentPath}/${file}`.replaceAll('//', '/'))
                        }}
                        key={`${file}-${index}`}
                        title={file}
                        icon='/assets/icons/folder.png'
                        path={`${currentPath}/${file}`.replaceAll('//', '/')}
                      />
                    )
                  }
                })
              }

              {(states.File.setIsNewFile && !states.Mouse.mouseInDesktop) && (
                <NewDirFileItem
                  title='New File'
                  icon='/assets/icons/file.png'
                />
              )}
              {(states.File.setIsNewFolder && !states.Mouse.mouseInDesktop) && (
              <NewDirFolderItem
                title='New Folder'
                icon='/assets/icons/folder.png'
              />
            )}
            </div>
          </Dropzone>
        </div>
      </div>
    </DefaultWindow>
  )
}

export default Explorer