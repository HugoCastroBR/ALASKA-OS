'use client'
import React, { useEffect, useState } from 'react'
import DefaultWindow from '../containers/DefaultWindow'
import useCommands from '@/hooks/useCommands'
import { DefaultWindowProps } from '@/types/containers'
import { consoleProps, programProps } from '@/types/programs'
import { verifyIfIsObject } from '@/utils/file'
import useStore from '@/hooks/useStore'
import useFS from '@/hooks/useFS'

const Console = ({
  tab,
  window,
  vanilla,
  interceptBrowserConsole
}:consoleProps) => {

  const {states, dispatch} = useStore()
  const {fs} = useFS()

  const { history,setHistory, runCommand, currentDirectory, commands } = useCommands()
  const [inputValue, setInputValue] = useState('')
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState<number>(0)

  const ProcessInput = (input: string) => {
    setCommandHistory([])
    runCommand(input)
    setInputValue('')
  }

  const welcomeMessage = () => {
    return `
    \n
      ███ █┼┼ ███ ███ █┼█ ███ ┼┼ ███ ███
      █▄█ █┼┼ █▄█ █▄▄ ██▄ █▄█ ┼┼ █┼█ █▄▄
      █┼█ █▄█ █┼█ ▄▄█ █┼█ █┼█ ┼┼ █▄█ ▄▄█
    \n
    Welcome to the Alaska OS Console!
    Type 'help' to see the list of commands
  `
  }

  useEffect(() => {
    if(vanilla) return
    setHistory([welcomeMessage()])
  }, [fs])

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      ProcessInput(e.currentTarget.value)
    }
  }

  const handleTabPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Tab') {
      return;
    } else {
      e.preventDefault();
    }

    const currentInputValue = inputValue.trim().split(' ')[1];

    

    let matchingCommands = history.filter((command) =>
      command.startsWith(currentInputValue)
    );

    if (matchingCommands.length > 0) {
      // Ordena as correspondências por ordem alfabética
      matchingCommands.sort();

      // Preenche automaticamente com a primeira correspondência
      setInputValue(inputValue.slice(0, inputValue.length - 1) + matchingCommands.toString().split(' ')[0]);
    }
  }

  if(interceptBrowserConsole){
    console.log = (message: string, ...optionalParams: any[]) => {
      setHistory([...history, message]);
    }
  }

  if(vanilla){
    return(
      <div
        className='w-full h-full
      bg-slate-200 bg-opacity-80 
      flex flex-col justify-start items-start overflow-y-auto p-2
      '>
        {history.length > 1 && 
          history.map((item, index) => (
            <p
              key={index}
              className='
            text-black text-xs
            p-1 py-px w-full
            '
            >{`${currentDirectory}> `}{
              verifyIfIsObject(item) ? JSON.stringify(item) : item
            }</p>
          )
        )}
        <div className='flex w-full h-8 items-center'>
          {`${currentDirectory}> `}
          <input
            className='
          w-full h-8 bg-transparent text-black p-2
          outline-none focus:outline-none  text-xs
          '
            autoFocus
            type='text'
            value={`${inputValue}`}
            onChange={(e) => setInputValue(e.currentTarget.value)}
            onKeyPress={handleKeyPress}
            onKeyUp={(e) => {
              if (e.key === 'ArrowUp') {
                if (historyIndex < commandHistory.length) {
                  setInputValue(commandHistory[historyIndex])
                  setHistoryIndex(historyIndex + 1)
                }
              }
              if (e.key === 'ArrowDown') {
                if (historyIndex > 0) {
                  setInputValue(commandHistory[historyIndex - 1])
                  setHistoryIndex(historyIndex - 1)
                }
              }
            }}
            onKeyDown={handleTabPress}
          />
        </div>
      </div>
    )
  }

  return (
    <DefaultWindow
      currentTab={tab}
      currentWindow={window}
      uuid={tab.uuid}
      onClose={() => {}}
      onMaximize={() => {}}
      onMinimize={() => {}}
      resizable
      title='Console'>
      <div
        className='w-full h-full
      flex flex-col justify-start items-start overflow-y-auto p-2
      '
      style={{
        backgroundColor: states.Settings.settings.system.systemBackgroundColor
      }}
      >
        {
        history.length > 0 &&
        history.map((item, index) => (
          <p
            key={index}
            style={{
              color: states.Settings.settings.system.systemTextColor
            
            }}
            className='text-black text-sm p-1 py-px w-full'
          >{`${currentDirectory}> `}{item.split('\n').map((line, lineIndex) => (
            <span 
            key={lineIndex}
            style={{
              color: states.Settings.settings.system.systemTextColor
            }}
            >{line}<br /></span>
          ))}</p>
        )
      )}
          <div className='flex w-full h-8 items-center'
          style={{
            backgroundColor: states.Settings.settings.system.systemBackgroundColor,
            color: states.Settings.settings.system.systemTextColor
          }}
          >
          {`${currentDirectory}> `}
          <input
            className='
          w-full h-8 bg-transparent p-2
          outline-none focus:outline-none  text-sm
          '
            style={{
              color: states.Settings.settings.system.systemTextColor
            }}
            autoFocus
            type='text'
            value={`${inputValue}`}
            onChange={(e) => setInputValue(e.currentTarget.value)}
            onKeyPress={handleKeyPress}
            onKeyUp={(e) => {
              if (e.key === 'ArrowUp') {
                if (historyIndex < commandHistory.length) {
                  setInputValue(commandHistory[historyIndex])
                  setHistoryIndex(historyIndex + 1)
                }
              }
              if (e.key === 'ArrowDown') {
                if (historyIndex > 0) {
                  setInputValue(commandHistory[historyIndex - 1])
                  setHistoryIndex(historyIndex - 1)
                }
              }
            }}
            onKeyDown={handleTabPress}
          />
        </div>
      </div>
    </DefaultWindow>
  )
}

export default Console