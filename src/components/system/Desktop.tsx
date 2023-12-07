'use client'
import React,{useEffect} from 'react'
import TaskBar from './TaskBar'
import DesktopView from './DesktopView'
import useStore from '@/hooks/useStore'
import { SetCopiedFiles, SettingsSetSettings } from '@/store/actions'
import useFS from '@/hooks/useFS'
import useProcess from '@/hooks/useProcess'
import { Loader } from '@mantine/core'
import CustomText from '../atoms/CustomText'
import { useHotkeys } from '@mantine/hooks'
const Desktop = () => {

  const { states, dispatch } = useStore()
  const {loadingMessages} = useProcess()


  const { fs,copyFileByPath,deleteFileByPath,moveFileByPath } = useFS()


  useEffect(() => {
    if (fs) {
      fs?.readFile('settings.json', 'utf8', (err, data) => {
        if (err) {
          console.log(err)
          return
        }
        if (!data) {
          return
        }
        console.log('Settings loaded!');
        const _settings = JSON.parse(data)
        dispatch(SettingsSetSettings(_settings))
      })
    }
  }, [fs])



  // if(!states.System.isSystemLoaded){
  //   return (
  //     <main
  //       className='
  //       min-h-full min-w-full w-screen h-screen overflow-hidden flex flex-col justify-center items-center
  //       bg-cover bg-center bg-no-repeat bg-slate-50
  //       '
  //     >
  //       <Loader size={128} />
  //       <CustomText
  //         text={loadingMessages}
  //         className='text-slate-500 font-medium text-lg mt-4'
  //         style={{
  //           color: 'rgba(0,0,0,1)'
  //         }}
  //       />
  //     </main>
  //   )
  // }

  useHotkeys([
    ['ctrl+c', () => {
      dispatch(SetCopiedFiles())
    
    }],
    ['ctrl+v', () => {
      const pasteTo = states.Mouse.mousePathHistory[states.Mouse.mousePathHistory.length - 1]
      if(states.File.copiedFiles.length){
        states.File.copiedFiles.forEach((path) => {
          copyFileByPath(path, pasteTo)
        })
      }
    }],
    ['ctrl+x', () => {
      const pasteTo = states.Mouse.mousePathHistory[states.Mouse.mousePathHistory.length - 1]
      if(states.File.copiedFiles.length){
        states.File.copiedFiles.forEach((path) => {
          moveFileByPath(path, pasteTo)
        })
      }
    }],
    ['DELETE', () => {
      states.File.selectedFiles.forEach((path) => {
        deleteFileByPath(path)
      })
    }]
  ])

  return (
    <main
      className='
      min-h-full min-w-full w-screen h-screen overflow-hidden flex flex-col justify-between
      bg-cover bg-center bg-no-repeat
      '
      style={
        {
          background: states.Settings.settings.desktop.wallpaper.enabled ? `url(${states.Settings.settings.desktop.wallpaper.image64}) ` : 'transparent',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }
      }
      
    >

      <DesktopView/>
      <TaskBar/>
    </main>
  )
}

export default Desktop