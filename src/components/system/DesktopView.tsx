import React, { useEffect } from 'react'
import { Dropzone } from '@mantine/dropzone';
import { SimpleGrid,Notification } from '@mantine/core';
import Console from './Console';
import useStore from '@/hooks/useStore';
import { desktopPath } from '@/utils/constants';
import useFS from '@/hooks/useFS';
import { getExtension, uuid, verifyIfIsFile} from '@/utils/file';
import DesktopFile from '../molecules/DesktopFile';
import { generateIcon } from '@/utils/icons';
import DesktopFolder from '../molecules/DesktopFolder';
import { ClearFiles, ClearNotification, SetMouseInDesktop, SetMousePath, WindowAddTab } from '@/store/actions';
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
import Settings from './Settings';
import MyMusics from '../programs/MyMusics';
import Gallery from '../programs/Gallery';
import WeatherApp from '../programs/WeatherApp';
import TodoApp from '../programs/TodoApp';
import ClockApp from '../programs/ClockApp';
import CustomText from '../atoms/CustomText';
import FileExplorer from '../programs/FileExplorer';
import { ImageReaderProps } from '@/types/programs';
import MusicLibrary from '../programs/MusicLibrary';
import { Notifications } from '@mantine/notifications';
import TrashFolder from '../programs/TrashFolder';

const DesktopView = () => {


  const {states, dispatch} = useStore()
  const { fs,copyExternalFile,moveFileByPath } = useFS()

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

  
  // const generateGrid = () => {
  //   const grid = []
  //   for(let i = 0; i < 140; i++){
  //     grid.push(
  //     <div 
  //       key={i}
  //       className='
  //       h-28 w-24 border border-slate-100 border-opacity-40
  //       flex flex-col justify-evenly items-center
  //       hover:bg-gray-600 transition-all duration-300 ease-in-out
  //       '>
  //         {i +1}
  //       </div>
  //     )
  //   }
  //   return grid
  // }


  const COMPONENT_MAP: Record<string, React.FC<ImageReaderProps>> = {
    'Trash': TrashFolder,
    'Console': Console,
    'File Explorer': FileExplorer,
    'Browser': Browser,
    'Image Reader': ImageReader,
    'Pokemon Fire Red': PokemonFireRed,
    'Notepad': Notepad,
    'Markdown Editor': MarkdownEditor,
    'Rich Text Editor': RichTextEditor,
    'PDF Reader': PdfReader,
    'Code Editor': CodeEditor,
    'Calendar': CalendarProgram,
    'My Musics': MyMusics,
    'Video Player': VideoPlayer,
    'Calculator': Calculator,
    'Classic Paint': ClassicPaint,
    'Music Player': NativeMusicPlayer,
    'SpreadSheet': SpreadSheet,
    'Settings': Settings,
    'Gallery': Gallery,
    'Weather App': WeatherApp,
    'Todo App': TodoApp,
    'Clock App': ClockApp,
    'Music Library': MusicLibrary,
    
  };
  
  const handleRenderTabs = () => {
    return states.Windows.windows.map((AlaskaWindow) => {
      return AlaskaWindow.tabs.map((tab) => {
        const Component = COMPONENT_MAP[tab.title];
        return Component ? <Component key={tab.uuid} tab={tab} AlaskaWindow={AlaskaWindow} path={tab.value || ''} /> : null;
      });
    });
  };
  



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
      {states.System.notification !== null && 
        <Notification
        className='absolute top-6 right-6'
        color={states.Settings.settings.system.systemHighlightColor}
        title={states.System.notification.title}
        onClose={() => {
          dispatch(ClearNotification())
        }}
        styles={{
          root: {
            position: 'absolute',
            backgroundColor: states.Settings.settings.system.systemBackgroundColor,
            color: states.Settings.settings.system.systemTextColor
          },
          description: {
            color: states.Settings.settings.system.systemTextColor
          },
          icon: {
            color: states.Settings.settings.system.systemTextColor
          },
          title: {
            color: states.Settings.settings.system.systemTextColor
          },
          closeButton: {
            color: states.Settings.settings.system.systemTextColor,
            backgroundColor: states.Settings.settings.system.systemBackgroundColor
          }
        }}
      >
        <CustomText
          text={states.System.notification.message}
          className='font-medium !text-lg'
          style={{
            color: states.Settings.settings.system.systemTextColor
          }}
        />
      </Notification>
      }
      <Notifications
        position='top-right'
        h={80}
        w={320}
        styles={{
          notification:{
            backgroundColor: states.Settings.settings.system.systemBackgroundColor,
            color: states.Settings.settings.system.systemTextColor
          }
        }}
      />

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
          console.log('drop Desktop')
          if(!states.Mouse.mouseInDesktop) return
          if(states.File.selectedFiles.length > 0){
            states.File.selectedFiles.forEach((path) => {
              console.log(path)
              moveFileByPath(path, desktopPath)
              reloadDesktop()
            })
            return
          }else{
            files.forEach((file) => {
              copyExternalFile(file, desktopPath)
              reloadDesktop()
            })
          }
        }}
        className='w-full h-full flex justify-start items-start flex-wrap'
        onClick={(e) => {
          dispatch(SetMouseInDesktop(true));
          dispatch(SetMousePath(''));
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
                      title: 'File Explorer',
                      tab: {
                        uuid: uuid(6),
                        title: 'File Explorer',
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