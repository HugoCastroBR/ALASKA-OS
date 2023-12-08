import useStore from '@/hooks/useStore'
import React from 'react'
import CustomText from '../atoms/CustomText'
import useFS from '@/hooks/useFS'
import { useDebouncedState } from '@mantine/hooks'
import { convertSizeToKBMBGB, verifyIfIsFile } from '@/utils/file'

const Terminal = () => {

  const { states, dispatch } = useStore()
  const { fs,readPath } = useFS()

  const [commandsHistory, setCommandsHistory] = React.useState<string[]>([])
  const [inputValue, setInputValue] = useDebouncedState<string>('', 10)

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // processCommand(e.currentTarget.value)
      commands({
        command: {
          name: e.currentTarget.value.split(' ')[0],
          args: [...e.currentTarget.value.split(' ').slice(1).map((item) => {
            return {
              name: item.split(' ')[0],
              value: item.split('-')[1]
            }
          })]
        }
      })
    }
    setInputValue('')
  }

  


  const hasColor = (input: string): boolean => {
    const colorRegex = /%c.*color:\s*[^;]+/;
    return colorRegex.test(input);
  };


  const ProcessColor = ({text}:{text:string}) => {
    const colorRegex = /color:\s*([^;]*)/; // Regex to extract color value

    try {
        const colorMatch = text.match(colorRegex);

        if (colorMatch && colorMatch[1]) {
            const color = colorMatch[1].trim();
            return(
              <CustomText
                className='!text-xs m-0.5'
                text={`${text.slice(3, text.indexOf('color:') - 4)}`}
                style={{
                  color: color.slice(0, color.length - 1)
                }}
              />
            )
        }
    } catch (error) {
        console.error('Error extracting color:', error);
    }
    return (
      <CustomText
        className='!text-xs m-0.5'
        text={`${text}`}
        style={{
          color: states.Settings.settings.system.systemTextColor
        }}
      />
    );
};


  const AppendToHistory = (command: string) => {
    setCommandsHistory((prev) => [...prev, command]);
  };

  const processCommand = (text: string) => {
    let command = ''
    if(hasColor(text)) {
      console.log('has color')
      AppendToHistory(text)
      command = text.slice(3, text.indexOf('color:') - 4)
    }else{
      command = text
      AppendToHistory(command)
    }
  }

  const [currentPath, setCurrentPath] = React.useState<string>('/')

  type commandArgProps = {
    name:string,
    value?:string
  }

  type commandsProps = {
    command:{
      name:string,
      args?:commandArgProps[]
    }
  }

  const listCommand = (args:commandArgProps[]) => {
    console.log(args)

    const listDefault = (path:string) => {
      fs?.readdir(path, (err, files) => {
        files?.forEach((file,index) => {
          processCommand(`${index} -- ${file}`)
        })
      })
    }

    const listDetailed = (path:string) => {
      fs?.readdir(path, (err, files) => {
        files?.forEach((file,index) => {
          if(verifyIfIsFile(file)){
            fs?.stat(`${path}/${file}`, (err, stats) => {
              if(!stats) return
              processCommand(`${index} -- FILE -- ${file} -- ${convertSizeToKBMBGB(stats.size)} -- ${stats?.mtime.getDate()}/${stats?.mtime.getMonth()}/${stats?.mtime.getFullYear()}`)
            })
          }
          else{
            fs?.stat(`${path}/${file}`, (err, stats) => {
              if(!stats) return
              processCommand(`${index} -- DIR -- ${file}  -- ${stats?.mtime.getDate()}/${stats?.mtime.getMonth()}/${stats?.mtime.getFullYear()}`)
            })
            
          }
        })
      })
    }

    const listTree = (path: string, depth: number = 0) => {
      fs?.readdir(path, (err, paths) => {
          if (err) {
              console.error(`Error reading directory ${path}:`, err);
              return;
          }
          paths?.forEach((item, index) => {
              const fullPath = `${path}/${item}`;
              const isFile = verifyIfIsFile(fullPath);
  
              // const prefix = '_'.repeat(depth); // Adjust the indentation based on the depth
              fs?.stat(fullPath, (err, stats) => {
              if (isFile) {
                processCommand(`F - ${stats?.mtime.getDate()}/${stats?.mtime.getMonth()}/${stats?.mtime.getFullYear()} - ${item} - ${convertSizeToKBMBGB(stats?.size || 0)} - ${fullPath}`);
              } else {
                processCommand(`D - ${stats?.mtime.getDate()}/${stats?.mtime.getMonth()}/${stats?.mtime.getFullYear()} - ${item} - ${fullPath}`);
                listTree(fullPath, depth + 1); // Recursive call for subdirectories
              }
            });
          });
      });
  };
    
    if(!args?.[0]?.name){
      listDefault(currentPath)
      return
    }

    if(args[0].name === '-al'){
      listDetailed(currentPath)
      return
    }

    if(args[0].name === '-a'){
      listDefault(currentPath)
      return
    }

    if(args[0].name === '-R'){
      listTree(currentPath)
      return
    }

  }
  const commands = ({
    command
  }: commandsProps) => {
    console.log(command)
    switch (command.name) {
      case 'ls':
        listCommand(command.args || [])
        break;
      default:
        processCommand(`'%c${command.name} is not a command', 'color: red'`)
        break;
    }
  }

  return (
    <div
      className='absolute w-1/2 h-1/2 top-1/4 left-1/4
      flex flex-col  overflow-hidden
      rounded-lg'
    >
      <div 
      className='w-full h-full
      flex flex-col overflow-hidden
      p-1
      '
      style={{
        backgroundColor: states.Settings.settings.system.systemBackgroundColor
      }}
      >
        <div className='w-full h-[calc(100%-32px)] overflow-auto flex flex-col'>
          {commandsHistory?.map((item, index) => {

            return(
              <ProcessColor
                key={index}
                text={`${item}`.replaceAll('//', '/')}
              />
            )
          })}
        </div>
        <div
          className='sticky w-full h-8 flex items-center justify-start'
        >
          <div className='w-auto h-full pr-1 mt-2'>
            <CustomText
              className='!text-xs'
              text={`C:${currentPath}> `.replaceAll('//', '/')}
            />
          </div>
          <input
            className='w-full h-8 bg-transparent text-sm outline-none mt-0.5'
            type='text'
            autoFocus
            onChange={(e) => setInputValue(e.currentTarget.value)}
            value={`${inputValue}`}
            style={{
              color: states.Settings.settings.system.systemTextColor
            }}
            onKeyPress={handleKeyPress}
          />
        </div>
      </div>
    </div>
  )
}

export default Terminal