'use client'
import React,{useEffect} from 'react'
import MouseMenuContext from '@/components/system/MouseMenuContext'
import TaskBar from './TaskBar'
import DesktopView from './DesktopView'
import useSettings from '@/hooks/useSettings'
import useStore from '@/hooks/useStore'
import { SettingsSetSettings } from '@/store/actions'
import useFS from '@/hooks/useFS'
const Desktop = () => {

  const { settings } = useSettings()
  const { states, dispatch } = useStore()

  const { fs } = useFS()

  const [isLoading, setIsLoading] = React.useState(false)

  useEffect(() => {
    if (fs) {
      fs?.readFile('settings.json', 'utf8', (err, data) => {
        if (err) {
          console.log(err)
          setIsLoading(false)
          return
        }
        if (!data) {
          setIsLoading(false)
          return
        }
        console.log('Settings loaded!');
        const _settings = JSON.parse(data)
        dispatch(SettingsSetSettings(_settings))
        setIsLoading(false)
      })
    }
  }, [fs])

  const [wallpaper64, setWallpaper64] = React.useState(settings?.desktop.wallpaper.image64 || '')
  const [isWallpaperEnabled, setIsWallpaperEnabled] = React.useState(settings?.desktop.wallpaper.enabled || false)

  useEffect(() => {
    setWallpaper64(settings?.desktop.wallpaper.image64 || '')
    setIsWallpaperEnabled(settings?.desktop.wallpaper.enabled || false)
  }, [settings?.desktop.wallpaper])


  return (
    <main
      className='
      min-h-full min-w-full w-screen h-screen overflow-hidden flex flex-col justify-between
      bg-cover bg-center bg-no-repeat
      '
      style={
        {
          background: isWallpaperEnabled ? `url(${wallpaper64}) ` : 'transparent',
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