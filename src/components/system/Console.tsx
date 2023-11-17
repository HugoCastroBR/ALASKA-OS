'use client'
import React, { useState } from 'react'
import DefaultWindow from '../containers/DefaultWindow'
import useCommands from '@/hooks/useCommands'
import { DefaultWindowProps } from '@/types/containers'
import { programProps } from '@/types/programs'

const Console = ({
  tab,
  window,
}:programProps) => {

  const { history, runCommand, currentDirectory, commands } = useCommands()
  const [inputValue, setInputValue] = useState('')
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState<number>(0)

  const ProcessInput = (input: string) => {
    setCommandHistory([...commandHistory, input])
    runCommand(input)
    setInputValue('')
  }


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



  return (
    <DefaultWindow
      currentTab={tab}
      currentWindow={window}
      uuid={tab.uuid}
      onClose={() => {}}
      onMaximize={() => {}}
      onMinimize={() => {}}
      title='Console'>
      <div
        className='w-full h-full
      bg-slate-200 bg-opacity-40 
      flex flex-col justify-start items-start overflow-y-auto p-2
      '>
        {history.map((item, index) => (
          <p
            key={index}
            className='
          text-black text-sm
          p-1 py-px w-full
          '
          >{`${currentDirectory}> `}{item}</p>
        ))}
        <div className='flex w-full h-8 items-center'>
          {`${currentDirectory}> `}
          <input
            className='
          w-full h-8 bg-transparent text-black p-2
          outline-none focus:outline-none  text-sm
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
    </DefaultWindow>
  )
}

export default Console