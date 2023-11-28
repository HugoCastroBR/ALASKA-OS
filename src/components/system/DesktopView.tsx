import React, { useEffect } from 'react'
import { Dropzone } from '@mantine/dropzone';
import { SimpleGrid } from '@mantine/core';
import Console from './Console';
import useStore from '@/hooks/useStore';
import { desktopPath } from '@/utils/constants';
import useFS from '@/hooks/useFS';
import { getExtension, uuid, verifyIfIsFile, verifyIfIsImage, wait } from '@/utils/file';
import DesktopFile from '../molecules/DesktopFile';
import { generateIcon } from '@/utils/icons';
import DesktopFolder from '../molecules/DesktopFolder';
import Explorer from '../programs/Explorer';
import { ClearFiles, SetIsSystemLoaded, WindowAddTab } from '@/store/actions';
import Browser from '../programs/Browser';
import ImageReader from '../programs/ImageReader';
import PokemonFireRed from '../Games/PokemonFireRed';
import Notepad from '../programs/Notepad';
import MouseMenuContext from './MouseMenuContext';
import MarkdownEditor from '../programs/MarkdownEditor';
import RichTextEditor from '../programs/RichTextEditor';
import PdfReader from '../programs/PdfReader';
import CodeEditor from '../programs/CodeEditor';
import NewDirFileItem from '../molecules/NewDirFileItem';
import NewDirFolderItem from '../molecules/NewDirFolderItem';
import CalendarProgram from '../programs/Calendar';
import VideoPlayer from '../programs/VideoPlayer';
import Calculator from '../programs/Calculator';
import ClassicPaint from '../programs/ClassicPaint';
import NativeMusicPlayer from '../programs/NativeMusicPlayer';
import SpreadSheet  from '../programs/SpreadSheet';
import useSettings from '@/hooks/useSettings';
import Settings from './Settings';
import MyMusics from '../programs/MyMusics';
import Gallery from '../programs/Gallery';
import WeatherApp from '../programs/WeatherApp';

const DesktopView = () => {


  const {settings} = useSettings()
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
      fs.readdir(desktopPath, async (err, files) => {
        if(err){
          console.log(err);
        }else{
          setDesktopItems(files || [])
        }
      })
    }
  },[fs,states.Windows, states.File,states.Mouse])

  
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
          case 'Image Reader':
            return(
              <ImageReader
                key={index}
                tab={tab}
                path={tab.value || ''}
                window={window}
              />
            )
          case 'Pokemon Fire Red':
            return(
              <PokemonFireRed
                key={index}
                tab={tab}
                window={window}
              />
            )
          case 'Notepad':
              return(
                <Notepad
                  key={index}
                  tab={tab}
                  window={window}
                />
              )
          case 'Markdown Editor':
            return(
              <MarkdownEditor
                key={index}
                tab={tab}
                window={window}
              />
            )
          case 'Rich Text Editor':
            return(
              <RichTextEditor
                key={index}
                tab={tab}
                window={window}
              />
            )
          case 'PDF Reader':
            return (
              <PdfReader
                key={index}
                tab={tab}
                window={window}
              />
            )
          case 'Code Editor':
            return(
              <CodeEditor
              key={index}
              tab={tab}
              window={window}
            />
            )
          case 'Calendar':
            return(
              <CalendarProgram
                key={index}
                tab={tab}
                window={window}
              />
            )
          case 'My Musics':
            return(
              <MyMusics
                key={index}
                tab={tab}
                window={window}
              />
            )
          case 'Video Player':
            return(
              <VideoPlayer
                key={index}
                tab={tab}
                window={window}
              />
            )
          case 'Calculator':
            return(
              <Calculator
                key={index}
                tab={tab}
                window={window}
              />
            )
          case 'Classic Paint':
            return(
              <ClassicPaint
                key={index}
                tab={tab}
                window={window}
              />
            )
          case 'Music Player':
            return(
              <NativeMusicPlayer
                key={index}
                tab={tab}
                window={window}
              />
            )
          case 'SpreadSheet':
            return(
              <SpreadSheet
                key={index}
                tab={tab}
                window={window}
              />
            )
          case 'Settings':
            return(
              <Settings
                key={index}
                tab={tab}
                window={window}
              />
            )
          case 'Gallery':
            return(
              <Gallery
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

  const handlerUploadImageToDesktop = async (file: File) => {

    const fileContent = await file.arrayBuffer()
    const fileContentBase64 = Buffer.from(fileContent).toString('base64')
    
    fs?.writeFile(`${desktopPath}/${file.name}`, fileContentBase64, (err) => {
      if (err) throw err;
      console.log('File Saved!');
      reloadDesktop()
    })
  };

  const handlerUploadPDFToDesktop = async (file: File) => {
    const fileContent = await file.arrayBuffer()
    const fileContentBase64 = Buffer.from(fileContent).toString('base64')
    
    fs?.writeFile(`${desktopPath}/${file.name}`, fileContentBase64, (err) => {
      if (err) throw err;
      console.log('File Saved!');
      reloadDesktop()
    })
  }

  const handlerUploadMp4ToDesktop = async (file: File) => {
    const fileContent = await file.arrayBuffer()
    const fileContentBase64 = Buffer.from(fileContent).toString('base64')
    
    fs?.writeFile(`${desktopPath}/${file.name}`, fileContentBase64, (err) => {
      if (err) throw err;
      console.log('File Saved!');
      reloadDesktop()
    })
  }

  const handlerUploadMusicToDesktop = async (file: File) => {
    const fileContent = await file.arrayBuffer()
    const fileContentBase64 = Buffer.from(fileContent).toString('base64')
    
    fs?.writeFile(`${desktopPath}/${file.name}`, fileContentBase64, (err) => {
      if (err) throw err;
      console.log('File Saved!');
      reloadDesktop()
    })
  }

  const handleGeneralUploadToDesktop = async (file: File) => {
    const fileContent = await file.arrayBuffer()
    const fileContentBase64 = Buffer.from(fileContent).toString('base64')
    
    fs?.writeFile(`${desktopPath}/${file.name}`, fileContentBase64, (err) => {
      if (err) throw err;
      console.log('File Saved!');
      reloadDesktop()
    })
  }


  const [isRightMenuOpen, setIsRightMenuOpen] = React.useState(false)
  const [x, setX] = React.useState(0)
  const [y, setY] = React.useState(0)

  const reloadPath = (path:string) => {
    fs?.readdir(path, (err, files) => {
      if(err){
        console.log(err);
      }else{
        if(path === desktopPath){
          setDesktopItems(files || [])
        }
      }
    })
  }

  

  return (
    <div 
    id='desktop-view'
    className='w-full 
    overflow-hidden
    '
    onContextMenu={(e) => {
      e.preventDefault()
      setX(e.pageX)
      setY(e.pageY)
      setIsRightMenuOpen(true)
    }}
    onClick={() => {
      setIsRightMenuOpen(false)
    }}
    style={{
      height: 'calc(100vh - 40px)',
      
    }}

    >
      <MouseMenuContext
          onRefresh={() => {
            reloadPath('/Desktop')
          }}
          visible={isRightMenuOpen}
          x={x}
          y={y}
        />
      <Dropzone 
        disabled={!states.Mouse.mouseInDesktop}
        onDrop={(files) => {
          if(!states.Mouse.mouseInDesktop) return
          if(states.File.selectedFiles.length > 0){
            return
          }else{
            files.forEach((file) => {
              if(getExtension(file.name) === 'txt'){
                handlerUploadTXTToDesktop(file)
              }
              if(verifyIfIsImage(file.name)){
                handlerUploadImageToDesktop(file)
              }
              if(getExtension(file.name) === 'pdf'){
                handlerUploadPDFToDesktop(file)
              }
              if(getExtension(file.name) === 'mp4'){
                handlerUploadMp4ToDesktop(file)
              }
              if(getExtension(file.name) === 'mp3' || getExtension(file.name) === 'wav'){
                handlerUploadMusicToDesktop(file)
              }else{
                handleGeneralUploadToDesktop(file)
              }
            })
          }
        }}
        className='w-full h-full flex justify-start items-start flex-wrap'
        onClick={(e) => {
          e.stopPropagation()
          setIsRightMenuOpen(false)
        }}
        onDoubleClick={
          (e) => {
            e.stopPropagation()
            dispatch(ClearFiles())
          }
        }
      >

        <WeatherApp />
        {handleRenderTabs()}
        
        <SimpleGrid cols={{xs: 7, base: 8, sm: 10,md: 12, lg: 15,xl:20 }} 
        spacing={5} verticalSpacing={5}
        id='desktop'
        className='flex flex-col  flex-wrap w-full h-full px-2 py-2'
        style={{
          
        }}
        >
          {states.Windows.windows.map((window, index) => {
            if(window.showOnDesktop){
              return(
                <DesktopFile
                  key={index}
                  path='/'
                  icon={window.icon || '/assets/icons/Alaska.png'}
                  title={window.title}
                  isProgram
                  onDoubleClick={() => {
                    console.log('open window')
                    dispatch(WindowAddTab({
                      title: window.title,
                      tab: {
                        uuid: uuid(6),
                        title: window.title,
                        maximized: false,
                        minimized: false,
                        value: '/Desktop'
                      }
                    }))
                  }}
                />
              )
            }
            
          })}
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
            {(states.File.setIsNewFile && states.Mouse.mouseInDesktop) && (
              <NewDirFileItem
                title='New File'
                icon='/assets/icons/file.png'
              />
            )}
            {(states.File.setIsNewFolder && states.Mouse.mouseInDesktop) && (
              <NewDirFolderItem
                title='New Folder'
                icon='/assets/icons/folder.png'
              />
            )}
        </SimpleGrid>
        {/* <SimpleGrid cols={19} verticalSpacing={2} spacing={2}>
          {generateGrid()}
        </SimpleGrid> */}
      </Dropzone>
    </div>
  )
}

export default DesktopView