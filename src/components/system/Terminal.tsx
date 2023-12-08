import useStore from '@/hooks/useStore'
import React from 'react'
import CustomText from '../atoms/CustomText'
import useFS from '@/hooks/useFS'
import { useDebouncedState } from '@mantine/hooks'
import { convertSizeToKBMBGB, verifyIfIsFile } from '@/utils/file'

const Terminal = () => {

  type commandArgProps = {
    name: string,
    value?: string
  }

  type commandsProps = {
    command: {
      name: string,
      args?: commandArgProps[]
    }
  }

  const { states, dispatch } = useStore()
  const { fs, readPath } = useFS()

  const [commandsHistory, setCommandsHistory] = React.useState<string[]>([])
  const [inputValue, setInputValue] = useDebouncedState<string>('', 10)

  const [executedCommandsIndex, setExecutedCommandsIndex] = React.useState<number>(0)
  const [executedCommands, setExecutedCommands] = React.useState<{
    name: string;
    args?: commandArgProps[] | undefined;
  }[]>([])

  const AppendToExecutedCommands = (command: {
    name: string;
    args?: commandArgProps[] | undefined;
  }

  ) => {
    setExecutedCommands((prev) => [...prev, command]);
  }

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


  const ProcessColor = ({ text }: { text: string }) => {
    const colorRegex = /color:\s*([^;]*)/; // Regex to extract color value

    try {
      const colorMatch = text.match(colorRegex);

      if (colorMatch && colorMatch[1]) {
        const color = colorMatch[1].trim();
        return (
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
    if (hasColor(text)) {
      console.log('has color')
      AppendToHistory(text)
      command = text.slice(3, text.indexOf('color:') - 4)
    } else {
      command = text
      AppendToHistory(command)
    }
  }

  const [currentPath, setCurrentPath] = React.useState<string>('/')



  const errorPattern = (message: string) => {
    processCommand(`'%c${message}', 'color: red'`)
  }
  const warningPattern = (message: string) => {
    processCommand(`'%c${message}', 'color: orange'`)
  }
  const successPattern = (message: string) => {
    processCommand(`'%c${message}', 'color: green'`)
  }

  const listCommand = (args: commandArgProps[]) => {

    const listDefault = (path: string) => {
      fs?.readdir(path, (err, files) => {
        files?.forEach((file, index) => {
          processCommand(`${index} -- ${file}`)
        })
      })
    }

    const listDetailed = (path: string) => {
      fs?.readdir(path, (err, files) => {
        files?.forEach((file, index) => {
          if (verifyIfIsFile(file)) {
            fs?.stat(`${path}/${file}`, (err, stats) => {
              if (!stats) return
              processCommand(`${index} -- FILE -- ${file} -- ${convertSizeToKBMBGB(stats.size)} -- ${stats?.mtime.getDate()}/${stats?.mtime.getMonth()}/${stats?.mtime.getFullYear()}`)
            })
          }
          else {
            fs?.stat(`${path}/${file}`, (err, stats) => {
              if (!stats) return
              processCommand(`${index} -- DIR -- ${file}  -- ${stats?.mtime.getDate()}/${stats?.mtime.getMonth()}/${stats?.mtime.getFullYear()}`)
            })

          }
        })
      })
    }

    const listTree = (path: string, depth: number = 0) => {
      fs?.readdir(path, (err, paths) => {
        if (err) {
          errorPattern(`Error reading directory ${path}: ${err}`)
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

    if (!args?.[0]?.name) {
      clearCommand()
      listDefault(currentPath)
      return
    }

    if (args[0].name === '-al') {
      clearCommand()
      if (args[1].name || false) {
        listDetailed(args[1].name)
        return
      }else{
        listDetailed(currentPath)
        
      }
      return
    }

    if (args[0].name === '-a') {
      clearCommand()
      if (args[1].name || false) {
        listDefault(args[1].name)
        return
      }else{
        listDefault(currentPath)
        
      }
      return
    }

    if (args[0].name === '-R') {
      clearCommand()
      if (args[1]?.name || false) {
        listTree(args[1].name)
        
      }else{
        listTree(currentPath)
      }

      return
    }

    if (!args[0].name.includes('-')) {
      clearCommand()
      listDefault(args[0].name)
      return
    }

    if (args[0].name === '-h' || args[0].name === '--help') {
      clearCommand()
      processCommand(`Usage: ls [OPTION]`)
      processCommand(`List information about the FILEs (the current directory by default).`)
      processCommand(`Options:`)
      processCommand(`-a, Show hidden files`)
      processCommand(`-al, Show detailed information about files`)
      processCommand(`-R, Show all files recursively`)

      return
    }
  }

  const clearCommand = () => {
    setCommandsHistory([])
  }

  const cdCommand = (args: commandArgProps[]) => {
    const cdDefault = (path: string) => {
      fs?.readdir(`${currentPath}/${path}`.replaceAll('//', '/'), (err) => {
        if (err) {
          fs?.readdir(`${path}`.replaceAll('//', '/'), (err) => {
            if (err) {
              errorPattern(`The system cannot find the path specified.`)
              return
            }

            setCurrentPath(`/${path}`.replaceAll('//', '/'))
          })
        }
        setCurrentPath(`/${currentPath}/${path}`.replaceAll('//', '/'))
      })
    }

    const cdHome = () => {
      clearCommand()
      setCurrentPath('/')
    }

    const cdBack = () => {
      const path = currentPath.split('/')
      if (path.length === 2) return
      clearCommand()
      path.pop()
      setCurrentPath(path.join('/'))
    }

    if (!args?.[0]?.name) {
      clearCommand()
      cdHome()
      return
    }

    if (args[0].name === '/') {
      clearCommand()
      cdHome()
      return
    }

    if (args[0].name === '..') {
      clearCommand()
      cdBack()
      return
    }

    if (args[0].name !== '..' && args[0].name !== '/') {
      clearCommand()
      cdDefault(args[0].name)
      return
    }

    if ((args[0].name as string) === '-h' || (args[0].name as string) === '--help') {
      clearCommand();
      processCommand(`Usage: cd [OPTION]`);
      processCommand(`Change the shell working directory.`);
      processCommand(`Options:`);
      processCommand(`-h, --help, Show this help`);
      processCommand(`.., Go back to the previous directory`);
      processCommand(`/, Go to the root directory`);
      processCommand(`[PATH], Go to the specified directory`);
      return;
    }

  }

  const catCommand = (args: commandArgProps[]) => {
    const catDefault = (path: string) => {
      fs?.readFile(`${currentPath}/${path}`.replaceAll('//', '/'), 'utf-8', (err, data) => {
        if (err) {
          if (err.code === 'EISDIR') {
            errorPattern(`cat: ${currentPath}/${path}: Is a directory`)
            return
          }
          fs?.readFile(`${path}`.replaceAll('//', '/'), 'utf-8', (err, data) => {
            if (err) {
              if (err.code === 'EISDIR') {
                errorPattern(`cat: ${path}: Is a directory`)
                return
              }
              errorPattern(`The system cannot find the path specified.`)
              return
            }
            processCommand(`${data}`)
          })
        }
        processCommand(`${data}`)
      })
    }

    const catCreate = (path: string) => {
      fs?.writeFile(`${currentPath}/${path}`.replaceAll('//', '/'), '', (err) => {
        console.log(`${currentPath}/${path}`.replaceAll('//', '/'))
        if (err) {
          fs?.writeFile(`${path}`.replaceAll('//', '/'), '', (err) => {
            if (err) {
              errorPattern(`The system cannot find the path specified.`)
              return
            }
            successPattern(`File created successfully`)
          })
        }
        successPattern(`File created successfully`)
      })
    }

    const catAppend = (text: string, path: string) => {
      console.log(`${currentPath}/${path}`.replaceAll('//', '/'))
      fs?.appendFile(`${currentPath}/${path}`.replaceAll('//', '/'), `${text}`, (err) => {
        if (err) {
          fs?.appendFile(`${path}`.replaceAll('//', '/'), `${text}`, (err) => {
            if (err) {
              errorPattern(`The system cannot find the path specified.`)
              return
            }
            successPattern(`Text added successfully`)
          })
        }
        successPattern(`Text added successfully`)
      })
    }



    if (args[0].name && !args[1]?.name && !args[2]?.name) {
      catDefault(args[0].name)
      return
    }

    if ((args[1].name === '>') && args[2].name) {
      catCreate(args[2].name)
      return
    }

    if (args[0].name && (args[1].name === '>>') && args[2].name) {
      catAppend(args[0].name, args[2].name)
      return
    }

    if ((args[0].name as string) === '-h' || (args[0].name as string) === '--help') {
      clearCommand();
      processCommand(`Usage: cat [OPTION]`);
      processCommand(`Concatenate FILE(s) to standard output.`);
      processCommand(`Options:`);
      processCommand(`-h, --help, Show this help`);
      processCommand(`[PATH], Show the content of the file`);
      processCommand(` > [PATH], Create a file`);
      processCommand(`[TEXT] >> [PATH], Append the specified text to the file`);
      return;
    }

  }


  const touchCommand = (args: commandArgProps[]) => {
    const touchDefault = (path: string) => {
      fs?.writeFile(`${currentPath}/${path}`.replaceAll('//', '/'), '', (err) => {
        if (err) {
          fs?.writeFile(`${path}`.replaceAll('//', '/'), '', (err) => {
            if (err) {
              errorPattern(`The system cannot find the path specified.`)
              return
            }
            successPattern(`File created successfully`)
          })
        }
        successPattern(`File created successfully`)
      })
    }

    if (args[0].name && !args[1]?.name) {
      touchDefault(args[0].name)
      return
    }

    if ((args[0].name as string) === '-h' || (args[0].name as string) === '--help') {
      clearCommand();
      processCommand(`Usage: touch [OPTION]`);
      processCommand(`Update the access and modification times of each FILE to the current time.`);
      processCommand(`Options:`);
      processCommand(`-h, --help, Show this help`);
      processCommand(`[PATH], Create a file`);
      return;
    }
  }

  const rmCommand = (args: commandArgProps[]) => {
    const rmDefault = (path: string) => {
      if(verifyIfIsFile(path)){
        fs?.unlink(`${currentPath}/${path}`.replaceAll('//', '/'), (err) => {
          if (err) {
            fs?.unlink(`${path}`.replaceAll('//', '/'), (err) => {
              if (err) {
                errorPattern(`The system cannot find the path specified.`)
                return
              }
              successPattern(`File deleted successfully`)
            })
          }
          successPattern(`File deleted successfully`)
        })
      }else{
        fs?.rmdir(`${currentPath}/${path}`.replaceAll('//', '/'), (err) => {
          if (err) {
            fs?.rmdir(`${path}`.replaceAll('//', '/'), (err) => {
              if (err) {
                errorPattern(`The system cannot find the path specified.`)
                return
              }
              successPattern(`Directory deleted successfully`)
            })
          }
          successPattern(`Directory deleted successfully`)
        })
      }
    }

    const rmRecursive = (path: string) => {
      
    }

  }

  const commands = ({
    command
  }: commandsProps) => {
    console.log(command)
    switch (command.name) {
      case 'ls':
        AppendToExecutedCommands(command)
        listCommand(command.args || [])
        break;
      case 'clear':
      case 'cls':
        AppendToExecutedCommands(command)
        clearCommand()
        break;
      case 'cd':
        AppendToExecutedCommands(command)
        cdCommand(command.args || [])
        break;
      case 'cat':
        AppendToExecutedCommands(command)
        catCommand(command.args || [])
        break;
      case 'touch':
        AppendToExecutedCommands(command)
        touchCommand(command.args || [])
        break;
      default:
        AppendToExecutedCommands(command)
        errorPattern(`'${command.name}' is not recognized as an internal or external command, operable program or batch file.`)
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
        <div className='w-full h-[calc(100%-32px)]  overflow-auto flex flex-col '>
          {commandsHistory?.map((item, index) => {

            return (
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
            onKeyUp={(e) => {
              if (e.key === 'ArrowUp') {
                setExecutedCommandsIndex(executedCommands.length - 1)
                if(executedCommandsIndex < 0) return
                setInputValue(`${executedCommands[executedCommandsIndex].name} ${executedCommands[executedCommandsIndex].args?.map((item) => {
                  if(!item.value) return item.name
                  return `${item.name} ${item.value}`
                })} `)
              }
              if (e.key === 'ArrowDown') {
                setExecutedCommandsIndex(executedCommands.length + 1)
                if(executedCommandsIndex > executedCommands.length) return
                setInputValue(`${executedCommands[executedCommandsIndex].name} ${executedCommands[executedCommandsIndex].args?.map((item) => {
                  if(!item.value) return item.name
                  return `${item.name} ${item.value}`
                })} `)
              }
              
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default Terminal