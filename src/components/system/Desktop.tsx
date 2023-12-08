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
  //       bg-cover bg-center bg-no-repeat bg-slate-50 transition-all duration-300
  //       '
  //       style={{
  //         backgroundColor: states.Settings.settings.system.systemBackgroundColor || 'white'
  //       }}
  //     >
  //       <Loader 
  //       size={128}
  //       color={states.Settings.settings.system.systemHighlightColor || 'blue'}
  //       className='
  //       transition-all duration-300 
  //       '
  //       />
  //       <CustomText
  //         text={loadingMessages}
  //         className='text-slate-500 font-medium text-lg mt-4 transition-all duration-300'
  //         style={{
  //           color: states.Settings.settings.system.systemTextColor || 'black'
  //         }}
  //       />
  //     </main>
  //   )
  // }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  

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