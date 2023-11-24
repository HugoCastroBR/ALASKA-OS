import { SettingsSetSettings } from "@/store/actions"
import { SettingsProps } from "@/types/settings"
import { useState, useEffect } from "react"
import useFS from "./useFS"
import useStore from "./useStore"
export default function useSettings(){

  const {fs} = useFS()
  const { states , dispatch } = useStore()
  const [settings, setSettings] = useState<SettingsProps>()

  useEffect(() => {
    setSettings(states.Settings.settings)
  }, [states.Settings])


  useEffect(() => {
    if (fs) {
      fs?.readFile('settings.json', 'utf8', (err, data) => {
        if (err) {
          console.log(err)
        }
        if(!data){
          return
        }
        const _settings = JSON.parse(data)
        setSettings(_settings)
        dispatch(SettingsSetSettings(_settings))
      })
    }
  }, [])




  return  {settings,setSettings}

}