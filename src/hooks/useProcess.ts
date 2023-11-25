import { usePython } from 'react-py';
import { useEffect, useState } from "react"
import useSettings from './useSettings';
import useStore from './useStore';
import useFS from './useFS';
import { wait } from '@/utils/file';
import { SetIsSystemLoaded } from '@/store/actions';


export default function useProcess(){

    const {fs, isLoadingFS} = useFS()
    const { runPython,isLoading, isReady,prompt,stdout,stderr } = usePython()
    const { isLoadingSettings,startLoadingSettings,loadedSuccessfullySettings } = useSettings()
    const { states , dispatch } = useStore()
    const [countPythonExecution, setCountPythonExecution] = useState(0)

    const [currentLoadingProcess, setCurrentLoadingProcess] = useState(0)
    const [loadingMessages, setLoadingMessages] = useState<string>('Hi, I am loading... it make take a while.')


    const startLoading = async () => {
      runPythonScript('print("Python Loading")')
      setCurrentLoadingProcess(0)
      startLoadingSettings()
      await wait(3000)
      if(isLoading){
        console.log('Python is loading')
        setLoadingMessages('Python is loading')
      }
      if(isReady){
        console.log('Python is ready')
        setLoadingMessages('Python is ready')
      }
      if(isLoadingSettings === true){
        console.log('Loading Settings')
        setLoadingMessages('Loading Settings')
      }
      if(loadedSuccessfullySettings === false){
        console.log('Settings not Loaded')
        setLoadingMessages('Settings not Loaded')
      }
      if(loadedSuccessfullySettings === true){
        console.log('Settings Loaded')
        setLoadingMessages('Settings Loaded')
      }
      if(isLoadingFS === true){
        console.log('Loading file system')
        setLoadingMessages('Loading file system')
      }
      if(fs){
        console.log('File System loaded')
        setLoadingMessages('File System loaded')
      }
      if(fs === undefined){
        console.log('File System not loaded')
        setLoadingMessages('File System not loaded')
      }
      await wait(2000)
      dispatch(SetIsSystemLoaded(true))
    }

    useEffect(() => {
      startLoading()
    }, [fs])

    const handlerRunFirstExecution = async (script:string) => {
      await wait(2000)
      runPython(script)
      setCountPythonExecution(countPythonExecution + 1)
    }

    const runPythonScript=  (script: string) => {
      if(isLoading){
        console.log('python is loading')
        return
      }
      if(countPythonExecution > 0){
        runPython(script)
        if(stdout){
          console.log(stdout)
        }
        if(stderr){
          console.log(stderr)
        }
      }
      if(isReady && countPythonExecution === 0){
        handlerRunFirstExecution(script)
      }
    }


  return {currentLoadingProcess,runPythonScript,loadingMessages}
}