import React, { useEffect } from 'react'
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { SimpleGrid } from '@mantine/core';
import DefaultWindow from '../containers/DefaultWindow';
import Console from './Console';
import useStore from '@/hooks/useStore';
import useCommands from '@/hooks/useCommands';
import { desktopPath } from '@/utils/constants';
import useFS from '@/hooks/useFS';
import { getExtension, uuid, verifyIfIsFile } from '@/utils/file';
import DesktopFile from '../molecules/DesktopFile';
import { generateIcon } from '@/utils/icons';
import DesktopFolder from '../molecules/DesktopFolder';
import Explorer from '../programs/Explorer';
import { ClearFiles, WindowAddTab } from '@/store/actions';
import path from 'path';
import Browser from '../programs/Browser';

const DesktopView = () => {


  const {states, dispatch} = useStore()
  const { fs } = useFS()

  const [desktopItems, setDesktopItems] = React.useState<string[]>([]);

  const reloadDesktop = () => {
    fs?.readdir(desktopPath, (err, files) => {
      if(err){
        console.log(err);
      }else{
        setDesktopItems(files || [])
      }
    })
  }

  useEffect(() => {
    if(fs){
      fs.readdir(desktopPath, (err, files) => {
        if(err){
          console.log(err);
        }else{
          setDesktopItems(files || [])
        }
      })
    }
  },[fs,states.Windows, states.File])

  const refreshDesktopEvery30Seconds = () => {
    setInterval(() => {
      reloadDesktop()
    }, 30000);
  }

  refreshDesktopEvery30Seconds()


  const generateGrid = () => {
    const grid = []
    for(let i = 0; i < 140; i++){
      grid.push(
      <div 
        key={i}
        className='
        h-28 w-24 border border-slate-100 border-opacity-40
        flex flex-col justify-evenly items-center
        hover:bg-gray-600 transition-all duration-300 ease-in-out
        '>
          {i +1}
        </div>
      )
    }
    return grid
  }

  const handleRenderTabs = () => {
    return states.Windows.windows.map((window, index) => {
      return window.tabs.map((tab, index) => {
        switch (tab.title) {
          case 'Console':
            return(
              <Console
              key={index}
              tab={tab}
              window={window}
            />
            )
          case 'Explorer':
            return(
              <Explorer
                key={index}
                tab={tab}
                window={window}
              />
            )
          case 'Browser':
            return(
              <Browser
                key={index}
                tab={tab}
                window={window}
              />
            )
          default:
            return (<></>)
        }
      })
    })
  }

  const handlerUploadTXTToDesktop = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = (e.target?.result || '').toString();
      const fileName = file.name;
      console.log(text, fileName);
      fs?.writeFile(`${desktopPath}/${fileName}`, text, (err) => {
        if (err) throw err;
        console.log('File Saved!');
        reloadDesktop()
      })
      
    };
    reader.readAsText(file);
  }

  return (
    <div 
    id='desktop-view'
    className='w-full 
    overflow-hidden
    '
    style={{
      height: 'calc(100vh - 40px)'
    }}
    >
      <Dropzone
        onDrop={(files) => {
          if(states.File.selectedFiles.length > 0){
            return
          }else{
            if(getExtension(files[0].name) === 'txt'){
              handlerUploadTXTToDesktop(files[0])

              
            }
          }
        }}
        className='w-full h-full flex justify-start items-start'
        onClick={(e) => e.stopPropagation()}
        onDoubleClick={
          (e) => {
            e.stopPropagation()
            dispatch(ClearFiles())
          }
        }
      >
        {handleRenderTabs()}
        
        {desktopItems.map((item, index) => {
              if(verifyIfIsFile(item)){
                return(
                  <DesktopFile
                    key={index}
                    title={item}
                    path={`${desktopPath}/${item}`}
                    icon={generateIcon(getExtension(item)) || '/assets/icons/file.png'}
                  />
                )
                
              }else{
                return(
                  <DesktopFolder
                  onDoubleClick={() => {
                    dispatch(WindowAddTab({
                      title: 'Explorer',
                      tab: {
                        uuid: uuid(6),
                        title: 'Explorer',
                        maximized: false,
                        minimized: false,
                        value: `${desktopPath}/${item}`
                      }
                    }))
                  }}
                  key={index}
                  title={item}
                  path={`${desktopPath}/${item}`}
                  icon={generateIcon(getExtension(item)) || '/assets/icons/folder.png'}
                />
                )
              }
            })}
        {/* <SimpleGrid cols={19} verticalSpacing={2} spacing={2}>
          {generateGrid()}
        </SimpleGrid> */}
      </Dropzone>
    </div>
  )
}

export default DesktopView