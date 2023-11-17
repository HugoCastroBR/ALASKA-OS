'use client'

import { explorerProps } from '@/types/programs'
import React, { useEffect, useState } from 'react'
// import WindowBox from '../templates/WindowBox'
import { getExtension, verifyIfIsFile } from '@/utils/file'
import ExplorerActionBar from '../molecules/ExplorerActionBar'
import { Group, FileButton, Button,  SimpleGrid } from '@mantine/core'
import useFS from '@/hooks/useFS'
import { generateIcon } from '@/utils/icons'

import useStore from '@/hooks/useStore'
import DefaultWindow from '../containers/DefaultWindow'
import DesktopFile from '../molecules/DesktopFile'
import DesktopFolder from '../molecules/DesktopFolder'
// import { MouseSetMouseContextPath, MouseSetMousePath } from '@/store/actions'
// import NewDirFileItem from './NewDirFileItem'
// import NewDirFolderItem from './NewDirFolderItem'


const Explorer = ({
  tab,
  window,
  path
}: explorerProps) => {

  const { states, dispatch } = useStore()

  const { fs } = useFS()


  const [dirFiles, setDirFiles] = useState<string[]>([])
  const [currentPath, setCurrentPath] = useState<string>(path)

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
    Reload()
  }, [currentPath])

  const [file, setFile] = useState<File | null>(null);

  const [newFolderInputOpen, setNewFolderInputOpen] = useState(false);
  const [newFileInputOpen, setNewFileInputOpen] = useState(false);


  useEffect(() => {
    Reload()
  }, [fs, currentPath, states.File])

  const uploadFileToDesktop = (fileName: string, fileContent: string) => {
    console.log(fileName)
    const desktopPath = '/Desktop';
  
  
    fs?.writeFile(`${desktopPath}/${fileName}`, fileContent, (err) => {
      if (err) throw err;
      console.log('File Saved!');
    });
  };



  return (
    <DefaultWindow
      currentTab={tab}
      currentWindow={window}
      title='Explorer'
      uuid={tab.uuid}
      onClose={() => { }}
      onMaximize={() => { }}
      onMinimize={() => { }}
      resizable
      className='w-3/5 h-3/5 flex flex-col '
    >
      <div
        className='w-full h-full bg-gray-800 flex flex-col'>
        <div className='flex w-full h-1/6 bg-gray-900 overflow-hidden'>
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
        <div className='flex w-full h-5/6'>
          <div className='w-2/12 pt-2'>
            <Group justify="center">
              <FileButton onChange={async (e) => {
                if(e){
                  const file = e
                  if(file.type === 'text/plain'){
                    const fileContent = await file.text()
                    uploadFileToDesktop(file.name, fileContent)
                    Reload()
                  }
                  if(file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/gif') {
                    const fileContent = await file.arrayBuffer()
                    const fileContentBase64 = Buffer.from(fileContent).toString('base64')
                    uploadFileToDesktop(file.name, fileContentBase64)
                  }if(file.type === 'application/pdf'){
                    const fileContent = await file.arrayBuffer()
                    const fileContentBase64 = Buffer.from(fileContent).toString('base64')
                    uploadFileToDesktop(file.name, fileContentBase64)
                  }
                  else{
                    console.log('not supported')
                    const fileContent = await file.arrayBuffer()
                    const fileContentBase64 = Buffer.from(fileContent).toString('base64')
                    uploadFileToDesktop(file.name, fileContentBase64)
                  }
                }
              }} >
                {(props) => <Button {...props}
                  className={`hover:bg-gray-700 transition-all duration-300 ease-in-out`}
                  styles={{
                    root: {
                      backgroundColor: '#2d374833',
                      border: '1px solid gray',
                      borderStyle: 'dashed',
                      color: 'white',
                      width: '90%'
                    }
                  }}
                >Upload File</Button>}
              </FileButton>
              <Button
                onClick={() => {
                  setNewFileInputOpen(true)
      
                }}
                className={`hover:bg-gray-600 transition-all duration-300 ease-in-out`}
                styles={{
                  root: {
                    backgroundColor: '#2d374833',
                    border: '1px solid gray',
                    color: 'white',
                    width: '90%'
                  }
                }}
              >New File</Button>
              <Button
                onClick={() => {
                  setNewFolderInputOpen(true)
                }}
                className={`hover:bg-gray-600 transition-all duration-300 ease-in-out`}
                styles={{
                  root: {
                    backgroundColor: '#2d374833',
                    border: '1px solid gray',
                    color: 'white',
                    width: '90%'
                  }
                }}
              >New Folder</Button>
            </Group>


          </div>
          <div className='bg-gray-700 w-10/12 flex p-2'>
            <SimpleGrid cols={10} spacing="1px" verticalSpacing="1px">
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
              {/* {newFileInputOpen && 
              <NewDirFileItem
                title='New File'
                icon='/assets/icons/file.png'
                inExplorer
                inExplorerPath={currentPath}
                inExplorerCB={() => {
                  setNewFileInputOpen(false)
                  Reload()
                }}
              />
              }
              {
                newFolderInputOpen && 
                <NewDirFolderItem
                  title='New Folder'
                  icon='/assets/icons/folder.png'
                  inExplorer
                  inExplorerPath={currentPath}
                  inExplorerCB={() => {
                    setNewFolderInputOpen(false)
                    Reload()
                  }}
                />
              } */}
            </SimpleGrid>
          </div>
        </div>
      </div>

    </DefaultWindow>
  )
}

export default Explorer