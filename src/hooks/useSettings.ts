import { SettingsSetSettings } from "@/store/actions"
import { SettingsProps } from "@/types/settings"
import { useState, useEffect } from "react"
import useFS from "./useFS"
import useStore from "./useStore"
export default function useSettings(){

  const {fs} = useFS()
  const { states , dispatch } = useStore()
  const [isLoadingSettings, setIsLoadingSettings] = useState(false)
  const [loadedSuccessfullySettings, setLoadedSuccessfullySettings] = useState<boolean | undefined>(undefined)


  const settings = states.Settings.settings

  useEffect(() => {
    console.log("Settings Changed")
  }, [states.Settings.settings])


  const setSettings = (value: SettingsProps) => {
    console.log("Settings Changed")
    dispatch(SettingsSetSettings(value))
  }



  const startLoadingSettings = () => {
    setIsLoadingSettings(true)
    if (fs) {
      fs?.readFile('settings.json', 'utf8', (err, data) => {
        if (err) {
          console.log(err)
          setLoadedSuccessfullySettings(false)
          setIsLoadingSettings(false)
        }
        if(!data){
          setLoadedSuccessfullySettings(false)
          setIsLoadingSettings(false)
          return
        }
        const _settings = JSON.parse(data)
        setSettings(_settings)
        dispatch(SettingsSetSettings(_settings))
        setLoadedSuccessfullySettings(true)
        setIsLoadingSettings(false)
      })
    }
  }




  return  {settings,setSettings,isLoadingSettings,loadedSuccessfullySettings,startLoadingSettings}

}