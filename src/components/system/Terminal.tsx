import useStore from '@/hooks/useStore'
import React, { useEffect } from 'react'
import CustomText from '../atoms/CustomText'
import useFS from '@/hooks/useFS'
import { useDebouncedState, useNetwork, useOs } from '@mantine/hooks'
import { convertSizeToKBMBGB, getLastPathSegment, uuid, verifyIfIsFile } from '@/utils/file'
import { ApiError } from 'browserfs/dist/node/core/api_error'
import { RemoveTabByUuid, WindowAddTab } from '@/store/actions'
import { consoleProps, programProps } from '@/types/programs'
import DefaultWindow from '../containers/DefaultWindow'

const Terminal = ({
  AlaskaWindow,
  tab,
  interceptBrowserConsole,
  vanilla
}:consoleProps) => {

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

  const { states, dispatch } = useStore()
  const { fs, copyFileByPath } = useFS()

  const networkStatus = useNetwork()
  const os = useOs()
  const [inputValue, setInputValue] = useDebouncedState<string>('', 0)

  const endRef = React.useRef<HTMLDivElement>(null)
  const [commandsHistory, setCommandsHistory] = React.useState<string[]>([])

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

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth',block: 'end',})
  }, [commandsHistory])

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

  useEffect(() => {
    welcomeMessage()
  }, [fs])

  
  const handleTabPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Tab') {
      return;
    } else {
      e.preventDefault();
    }
  
    fs?.readdir(currentPath, (err, files) => {
      if (err) {
        warningPattern(`The system cannot find the path specified.`);
        return;
      }
  
      const currentInputValue = inputValue.trim().split(' ')[1];
      let matchingCommands = files?.filter((command) =>
        command.startsWith(currentInputValue)
      );
  
      if (!matchingCommands || matchingCommands.length === 0) {
        return;
      }
  
      if (matchingCommands.length === 1) {
        setInputValue(`${inputValue.trim().split(' ')[0]} ${matchingCommands[0]} `);
      } else if (matchingCommands.length > 1) {
        // if more than one command matches, cycle through them on subsequent Tab presses
        const currentIndex = matchingCommands.indexOf(currentInputValue as string);
        const nextIndex = (currentIndex !== -1 ? currentIndex + 1 : 0) % matchingCommands.length;
        setInputValue(`${inputValue.trim().split(' ')[0]} ${matchingCommands[nextIndex]} `);
      }
    });
  };
  


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
      if (args[1]?.name || false) {
        listDetailed(args[1].name)
        return
      }else{
        listDetailed(currentPath)
        
      }
      return
    }

    if (args[0].name === '-a') {
      clearCommand()
      if (args[1]?.name || false) {
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

    const rmTree = (path: string) => {
      const fullPath = `${currentPath}/${path}`.replaceAll('//', '/');
    
      fs?.rmdir(fullPath, (err) => {
        if (err) {
          if (err.code === 'ENOENT') {
            // errorPattern(`The system cannot find the path specified.`);
            return;
          } else if (err.code === 'ENOTEMPTY') {
            // Directory not empty, remove its contents first
            fs?.readdir(fullPath, (err, files) => {
              if (err) {
                // errorPattern(`Error reading directory: ${err.message}`);
                return;
              }
    
              files?.forEach((file) => {
                const filePath = `${fullPath}/${file}`.replaceAll('//', '/');
                if (verifyIfIsFile(filePath)) {
                  // Remove file
                  fs?.unlink(filePath, (err) => {
                    if (err) {
                      // errorPattern(`Error deleting file ${file}: ${err.message}`);
                    }
                  });
                } else {
                  // Recursively remove subdirectory
                  rmTree(`${path}/${file}`);
                }
              });
    
              // After removing contents, attempt to remove the directory again
              rmTree(path);
            });
            return;
          } else {
            // errorPattern(`Error deleting directory: ${err.message}`);
            return;
          }
        }
    
        successPattern(`Directory deleted successfully`);
      });
    };

    const rmTreeForce = (path: string) => {
      const fullPath = `${currentPath}/${path}`.replaceAll('//', '/');
      fs?.rmdir(fullPath, (err) => {
        if (err) {
          if (err.code === 'ENOENT') {
            // errorPattern(`The system cannot find the path specified.`);
            return;
          } else if (err.code === 'ENOTEMPTY') {
            // Directory not empty, remove its contents first
            fs?.readdir(fullPath, (err, files) => {
              if (err) {
                // errorPattern(`Error reading directory: ${err.message}`);
                return;
              }
    
              files?.forEach((file) => {
                const filePath = `${fullPath}/${file}`.replaceAll('//', '/');
                if (verifyIfIsFile(filePath)) {
                  // Remove file
                  fs?.unlink(filePath, (err) => {
                    if (err) {
                      // errorPattern(`Error deleting file ${file}: ${err.message}`);
                    }
                  });
                } else {
                  // Recursively remove subdirectory
                  rmTree(`${path}/${file}`);
                }
              });
    
              // After removing contents, attempt to remove the directory again
              rmTree(path);
            });
            return;
          } else {
            // errorPattern(`Error deleting directory: ${err.message}`);
            return;
          }
        }
    
        successPattern(`Directory deleted successfully`);
      });
    }

    if (args[0].name && !args[1]?.name) {
      rmDefault(args[0].name)
      return
    }

    if (args[0].name === '-R') {
      rmTree(args[1].name)
      return
    }

    if(args[0].name === '-rf'){
      rmTreeForce(args[1].name)
      return
    }


    if((args[0].name as string) === '-h' || (args[0].name as string) === '--help'){
      clearCommand();
      processCommand(`Usage: rm [OPTION]`);
      processCommand(`Remove (unlink) the FILE(s).`);
      processCommand(`Options:`);
      processCommand(`-h, --help, Show this help`);
      processCommand(`-R, Remove the directory and its contents recursively`);
      processCommand(`[PATH], Remove the file`);
      return;
    }

  }

  const mkdirCommand = (args: commandArgProps[]) => {
    const mkdirDefault = (path: string) => {
      fs?.mkdir(`${currentPath}/${path}`.replaceAll('//', '/'), (err:ApiError) => {
        if (err) {
          fs?.mkdir(`${path}`.replaceAll('//', '/'), (err:ApiError) => {
            if (err) {
              errorPattern(`The system cannot find the path specified.`)
              return
            }
            successPattern(`Directory created successfully`)
          })
        }
        successPattern(`Directory created successfully`)
      })
    }

    if (args[0].name && !args[1]?.name) {
      mkdirDefault(args[0].name)
      return
    }

    if ((args[0].name as string) === '-h' || (args[0].name as string) === '--help') {
      clearCommand();
      processCommand(`Usage: mkdir [DIRECTORY]`);
      processCommand(`Create the DIRECTORY, if they do not already exist.`);
      processCommand(`Options:`);
      processCommand(`-h, --help, Show this help`);
      processCommand(`[PATH], Create the directory`);
      return;
    }
  }

  const historyCommand = (args: commandArgProps[]) => {
    console.log(args)
    if (!args[0]) {
      clearCommand()
      executedCommands?.forEach((item, index) => {
        processCommand(`${index} -- ${item}`)
      })
      return
    }
    if (args[0]?.name === '-c') {
      clearCommand()
      setExecutedCommands([])
      return
    }

    if ((args[0]?.name as string) === '-h' || (args[0]?.name as string) === '--help') {
      clearCommand();
      processCommand(`Usage: history [OPTION]`);
      processCommand(`Show the history of commands executed.`);
      processCommand(`Options:`);
      processCommand(`-h, --help, Show this help`);
      processCommand(`-c, Clear the history`);
      return;
    }
  }

  const mvCommand = (args: commandArgProps[]) => {
    const mvDefault = (path: string, newPath: string) => {
      fs?.rename(`${currentPath}/${path}`.replaceAll('//', '/'), `${currentPath}/${newPath}`.replaceAll('//', '/'), (err) => {
        if (err) {
          fs?.rename(`${path}`.replaceAll('//', '/'), `${newPath}`.replaceAll('//', '/'), (err) => {
            if (err) {
              errorPattern(`The system cannot find the path specified.`)
              return
            }
            successPattern(`File moved successfully`)
          })
        }
        successPattern(`File moved successfully`)
      })
    }

    if (args[0].name && args[1]?.name) {
      mvDefault(args[0].name, args[1].name)
      return
    }

    if ((args[0].name as string) === '-h' || (args[0].name as string) === '--help') {
      clearCommand();
      processCommand(`Usage: mv [OPTION]`);
      processCommand(`Move (rename) the FILE(s).`);
      processCommand(`Options:`);
      processCommand(`-h, --help, Show this help`);
      processCommand(`[PATH] [NEW PATH], Move the file to the new path`);
      return;
    }
  }

  const cpCommand = (args: commandArgProps[]) => {
    
    const cpDefault = (path: string, newPath: string) => {
      console.log(`${currentPath}/${path}`.replaceAll('//', '/'), `${newPath}`.replaceAll('//', '/') )

      fs?.readFile(`${currentPath}/${path}`.replaceAll('//', '/'), 'utf-8', (err, data) => {
        if(err){
          errorPattern(err.message)
        }
        if(!data){
          warningPattern(`The file is empty`)
          fs?.writeFile(`${newPath}`.replaceAll('//', '/'), '', (err) => {})
          return
        }
        fs?.writeFile(`${newPath}`.replaceAll('//', '/'), data, (err) => {
          if(err){
            errorPattern(err.message)
            return
          }
          successPattern(`File copied successfully`)
        })
      })
    }
    
    const cpFullPath = (path: string, newPath: string) => {
      fs?.readFile(`${path}`.replaceAll('//', '/'), 'utf-8', (err, data) => {
        if(err){
          errorPattern(err.message)
        }
        if(!data){
          warningPattern(`The file is empty`)
          fs?.writeFile(`${newPath}`.replaceAll('//', '/'), '', (err) => {})
          return
        }
        fs?.writeFile(`${newPath}`.replaceAll('//', '/'), data, (err) => {
          if(err){
            errorPattern(err.message)
            return
          }
          successPattern(`File copied successfully`)
        })
      })
    }

    if (args[0].name && args[1]?.name && !args[2]?.name) {
      cpDefault(args[0].name, args[1].name)
      return
    }

    if (args[0].name === '-f' && args[1]?.name && args[2]?.name) {
      cpFullPath(args[1].name, args[2].name)
      return
    }

    if ((args[0].name as string) === '-h' || (args[0].name as string) === '--help') {
      clearCommand();
      processCommand(`Usage: cp [OPTION]`);
      processCommand(`Copy the FILE(s).`);
      processCommand(`Options:`);
      processCommand(`-h, --help, Show this help`);
      processCommand(`-f [PATH] [NEW PATH],Copy the file to the new path(Specify the full path)`);
      processCommand(`[PATH] [NEW PATH], Copy the file to the new path`);
      return;
    }
  }

  const echoCommand = (args: commandArgProps[]) => {
    const echoDefault = (text: string) => {
      processCommand(`${text}`)
    }

    if (args[0].name && !args[1]?.name) {
      echoDefault(args[0].name)
      return
    }

    if ((args[0].name as string) === '-h' || (args[0].name as string) === '--help') {
      clearCommand();
      processCommand(`Usage: echo [OPTION]`);
      processCommand(`Display a line of text.`);
      processCommand(`Options:`);
      processCommand(`-h, --help, Show this help`);
      processCommand(`[TEXT], Display the text`);
      return;
    }
  }

  const grepCommand = (args: commandArgProps[]) => {
    const grepDefault = (text: string, path: string) => {
      fs?.readFile(`${currentPath}/${path}`.replaceAll('//', '/'), 'utf-8', (err, data) => {
        if (err) {
          if (err.code === 'EISDIR') {
            errorPattern(`grep: ${currentPath}/${path}: Is a directory`)
            return
          }
          fs?.readFile(`${path}`.replaceAll('//', '/'), 'utf-8', (err, data) => {
            if (err) {
              if (err.code === 'EISDIR') {
                errorPattern(`grep: ${path}: Is a directory`)
                return
              }
              errorPattern(`The system cannot find the path specified.`)
              return
            }
            const lines = data?.split('\n') || []
            lines?.forEach((line, index) => {
              if (line.includes(text)) {
                processCommand(`${index} -- ${line}`)
              }
            })
          })
        }
        const lines = data?.split('\n') || []
        lines?.forEach((line, index) => {
          if (line.includes(text)) {
            processCommand(`${index} -- ${line}`)
          }
        })
      })
    }

    if (args[0].name && args[1]?.name) {
      grepDefault(args[0].name, args[1].name)
      return
    }

    if ((args[0].name as string) === '-h' || (args[0].name as string) === '--help') {
      clearCommand();
      processCommand(`Usage: grep [OPTION]`);
      processCommand(`Print lines matching a pattern.`);
      processCommand(`Options:`);
      processCommand(`-h, --help, Show this help`);
      processCommand(`[TEXT] [PATH], Search for the text in the file`);
      return;
    }
  }

  const findCommand = (args: commandArgProps[]) => {
    const findFile = (filename: string, basePath: string) => {
      fs?.readdir(basePath, (err, items) => {
        if (err) {
          errorPattern(`The system cannot find the path specified.`);
          return;
        }
  
        items?.forEach((item) => {
          const fullPath = `${basePath}/${item}`;
  
          fs?.stat(fullPath, (err, stats) => {
            if (err) {
              errorPattern(`Error reading file or directory ${fullPath}: ${err}`);
              return;
            }
  
            if (stats?.isDirectory()) {
              // Recursively search in subdirectories
              findFile(filename, fullPath);
            } else if (stats?.isFile() && item === filename) {
              processCommand(`Found at: ${fullPath}`);
            }
          });
        });
      });
    };
  
    if (args[0].name && args[1]?.name) {
      clearCommand();
      findFile(args[0].name, args[1].name);
      return;
    }

    if(args[0].name && !args[1]?.name){
      clearCommand();
      findFile(args[0].name, currentPath);
      return;
    }
  
    if ((args[0].name as string) === '-h' || (args[0].name as string) === '--help') {
      clearCommand();
      processCommand(`Usage: find [OPTION]`);
      processCommand(`Search for files in a directory hierarchy.`);
      processCommand(`Options:`);
      processCommand(`-h, --help, Show this help`);
      processCommand(`[FILENAME] [PATH], Search for the specified file in directories`);
      return;
    }
  };

  const netCommand = (args: commandArgProps[]) => {
    if(!args[0]?.name){
      clearCommand()
      processCommand(`Connection status: ${networkStatus.online ? 'Online' : 'Offline'}`)
      processCommand(`Connection type: ${networkStatus.type}`)
      processCommand(`Connection downlink: ${networkStatus.downlink} Mbps`)
      processCommand(`Connection rtt: ${networkStatus.rtt} ms`)
      processCommand(`Connection saveData: ${networkStatus.saveData ? 'true' : 'false'}`)
      processCommand(`Connection effectiveType: ${networkStatus.effectiveType}`)
      return
    }

    if(args[0]?.name === '-h' || args[0]?.name === '--help'){
      clearCommand();
      processCommand(`Usage: net [OPTION]`);
      processCommand(`Show network information.`);
      processCommand(`Options:`);
      processCommand(`-h, --help, Show this help`);
      return;
    }
  }

  const topCommand = (args: commandArgProps[]) => {
    const topDefault = () => {
      states.Windows.windows.forEach((item) => {
        item.tabs.forEach((tab) => {
          processCommand(`UUID: ${tab.uuid} -- Name: ${tab.title} -- Status: ${tab.maximized ? 'Maximized' : tab.minimized ? 'Minimized' : 'Normal'}`)
        })
      })


      
    }

    if(!args[0]?.name){
      clearCommand()
      topDefault()
      return
    }

    if(args[0]?.name === '-h' || args[0]?.name === '--help'){
      clearCommand();
      processCommand(`Usage: top [OPTION]`);
      processCommand(`Show the current running processes.`);
      processCommand(`Options:`);
      processCommand(`-h, --help, Show this help`);
      return;
    }
  }

  const killCommand = (args: commandArgProps[]) => {
    //kill by uuid
    const defaultKill = (uuid: string) => {
      try {
        dispatch(RemoveTabByUuid({uuid}))
        successPattern(`Process killed successfully`)
      } catch (error) {
        errorPattern(`Error killing process`)
        errorPattern(error as string)
      }
    }


    if(!args[0]?.name){
      warningPattern(`Please specify a process to kill`)
      return
    }

    if(args[0]?.name && !args[1]?.name){
      defaultKill(args[0].name)
      return
    }

    if(args[0]?.name === '-h' || args[0]?.name === '--help'){
      clearCommand();
      processCommand(`Usage: kill [OPTION]`);
      processCommand(`Kill the specified process.`);
      processCommand(`Options:`);
      processCommand(`-h, --help, Show this help`);
      processCommand(`[UUID], Kill the process`);
      return;
    }
  }

  const openInCodeEditor = (args: commandArgProps[]) => {
    //open in code editor
    const defaultOpenInCodeEditor = (path: string) => {
      dispatch(WindowAddTab({
        title: 'Code Editor',
        tab:{
        maximized: false,
        minimized: false,
        focused: true,
        title: 'Code Editor',
        ficTitle: getLastPathSegment(path),
        uuid: uuid(6),
        value: path,
      }
      }))
    }

    if(!args[0]?.name){
      warningPattern(`Please specify a file to open`)
      return
    }

    if(args[0]?.name && !args[1]?.name){
      defaultOpenInCodeEditor(args[0].name)
      return
    }

    if(args[0]?.name === '-h' || args[0]?.name === '--help'){
      clearCommand();
      processCommand(`Usage: code [OPTION]`);
      processCommand(`Open the specified file in the code editor.`);
      processCommand(`Options:`);
      processCommand(`-h, --help, Show this help`);
      processCommand(`[PATH], Open the file`);
      return;
    }
  }

  const openInDataReader = (args: commandArgProps[]) => {
    //open in data reader
    const defaultOpenInDataReader = (path: string) => {
      dispatch(WindowAddTab({
        title: 'Data Reader',
        tab:{
        maximized: false,
        minimized: false,
        focused: true,
        title: 'Data Reader',
        ficTitle: getLastPathSegment(path),
        uuid: uuid(6),
        value: path,
      }
      }))
    }

    if(!args[0]?.name){
      warningPattern(`Please specify a file to open`)
      return
    }

    if(args[0]?.name && !args[1]?.name){
      defaultOpenInDataReader(args[0].name)
      return
    }

    if(args[0]?.name === '-h' || args[0]?.name === '--help'){
      clearCommand();
      processCommand(`Usage: data [OPTION]`);
      processCommand(`Open the specified file in the data reader.`);
      processCommand(`Options:`);
      processCommand(`-h, --help, Show this help`);
      processCommand(`[PATH], Open the file`);
      return;
    }
  }

  const dateCommand = (args: commandArgProps[]) => {
    const dateDefault = () => {
      const date = new Date()
      processCommand(`${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`)
    }

    if(!args[0]?.name){
      dateDefault()
      return
    }

    if(args[0]?.name === '-h' || args[0]?.name === '--help'){
      clearCommand();
      processCommand(`Usage: date [OPTION]`);
      processCommand(`Show the current date.`);
      processCommand(`Options:`);
      processCommand(`-h, --help, Show this help`);
      return;
    }
  }

  const timeCommand = (args: commandArgProps[]) => {
    const timeDefault = () => {
      const date = new Date()
      processCommand(`${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`)
    }

    if(!args[0]?.name){
      timeDefault()
      return
    }

    if(args[0]?.name === '-h' || args[0]?.name === '--help'){
      clearCommand();
      processCommand(`Usage: time [OPTION]`);
      processCommand(`Show the current time.`);
      processCommand(`Options:`);
      processCommand(`-h, --help, Show this help`);
      return;
    }
  }

  const calCommand = (args: commandArgProps[]) => {
    const calDefault = () => {

      const getDaysInMonth = (month: number, year: number) => {
        const date = new Date(year, month + 1, 0)
        return date.getDate()
      }

      const getMonthName = (month: number) => {
        const months = [
          'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
          'September', 'October', 'November', 'December'
        ]
        return months[month]
      }

      const date = new Date()
      const month = date.getMonth()
      const year = date.getFullYear()
      const days = getDaysInMonth(month, year)
      const firstDay = new Date(year, month, 1).getDay()
      const lastDay = new Date(year, month, days).getDay()
      const weeks = Math.ceil((days + firstDay) / 7)
      const calendar = []
      let day = 1
      for (let i = 0; i < weeks; i++) {
        const week = []
        for (let j = 0; j < 7; j++) {
          if (i === 0 && j < firstDay) {
            week.push(' ')
          } else if (day > days) {
            week.push(' ')
          } else {
            week.push(day)
            day++
          }
        }
        calendar.push(week)
      }
      const calendarString = calendar.map((week) => {
        return week.join('  ')
      }).join('\n')
      processCommand(`    ${getMonthName(month)} ${year}`)
      processCommand(`Su  Mo  Tu  We  Th  Fr  Sa`)
      processCommand(`${calendarString}`)
    }

    if(!args[0]?.name){
      calDefault()
      return
    }

    if(args[0]?.name === '-h' || args[0]?.name === '--help'){
      clearCommand();
      processCommand(`Usage: cal [OPTION]`);
      processCommand(`Show the current month calendar.`);
      processCommand(`Options:`);
      processCommand(`-h, --help, Show this help`);
      return;
    }
  }

  const duCommand = (args: commandArgProps[]) => {
    const duDefault = (path: string) => {
      fs?.stat(`${currentPath}/${path}`.replaceAll('//', '/'), (err, stats) => {
        if (err) {
          fs?.stat(`${path}`.replaceAll('//', '/'), (err, stats) => {
            if (err) {
              errorPattern(`The system cannot find the path specified.`)
              return
            }
            if(!Object.entries(stats || {}).length){
              warningPattern(`The directory is empty`)
              return
            }
            Object.entries(stats || {}).forEach(([key, value]) => {
              processCommand(`${key}: ${value}`)
            })
          })
        }
        if(!Object.entries(stats || {}).length){
          warningPattern(`The directory is empty`)
          return
        }
        Object.entries(stats || {}).forEach(([key, value]) => {
          processCommand(`${key}: ${value}`)
        })
      })
    }

    if(!args[0]?.name){
      duDefault(currentPath)
      return
    }

    if(args[0]?.name && !args[1]?.name){
      duDefault(args[0].name)
      return
    }

    if(args[0]?.name === '-h' || args[0]?.name === '--help'){
      clearCommand();
      processCommand(`Usage: du [OPTION]`);
      processCommand(`Show the disk usage of the specified directory.`);
      processCommand(`Options:`);
      processCommand(`-h, --help, Show this help`);
      processCommand(`[PATH], Show the disk usage of the specified directory`);
      return;
    }

  }

  const pwdCommand = (args: commandArgProps[]) => {
    const pwdDefault = () => {
      processCommand(`${currentPath}`)
    }

    if(!args[0]?.name){
      pwdDefault()
      return
    }

    if(args[0]?.name === '-h' || args[0]?.name === '--help'){
      clearCommand();
      processCommand(`Usage: pwd [OPTION]`);
      processCommand(`Show the current directory.`);
      processCommand(`Options:`);
      processCommand(`-h, --help, Show this help`);
      return;
    }
  }

  const exitCommand = (args: commandArgProps[]) => {
    const exitDefault = () => {
      dispatch(RemoveTabByUuid({uuid: tab.uuid}))
    }

    if(!args[0]?.name){
      exitDefault()
      return
    }

    if(args[0]?.name === '-h' || args[0]?.name === '--help'){
      clearCommand();
      processCommand(`Usage: exit [OPTION]`);
      processCommand(`Exit the terminal.`);
      processCommand(`Options:`);
      processCommand(`-h, --help, Show this help`);
      return;
    }
  }

  const moreCommand = (args: commandArgProps[]) => {
    const moreDefault = (path: string) => {
      fs?.readFile(`${currentPath}/${path}`.replaceAll('//', '/'), 'utf-8', (err, data) => {
        if (err) {
          if (err.code === 'EISDIR') {
            errorPattern(`more: ${currentPath}/${path}: Is a directory`)
            return
          }
          fs?.readFile(`${path}`.replaceAll('//', '/'), 'utf-8', (err, data) => {
            if (err) {
              if (err.code === 'EISDIR') {
                errorPattern(`more: ${path}: Is a directory`)
                return
              }
              errorPattern(`The system cannot find the path specified.`)
              return
            }
            const lines = data?.split('\n') || []
            lines?.forEach((line, index) => {
              if (index < 10) {
                processCommand(`${index} -- ${line}`)
              }
            })
          })
        }
        const lines = data?.split('\n') || []
        lines?.forEach((line, index) => {
          if (index < 10) {
            processCommand(`${index} -- ${line}`)
          }
        })
      })
    }

    if (args[0].name && !args[1]?.name) {
      moreDefault(args[0].name)
      return
    }

    if ((args[0].name as string) === '-h' || (args[0].name as string) === '--help') {
      clearCommand()
      processCommand(`Usage: more [OPTION]`);
      processCommand(`Show the content of the file.`);
      processCommand(`Options:`);
      processCommand(`-h, --help, Show this help`);
      processCommand(`[PATH], Show the content of the file`);
      return;
    }
  }

  const lessCommand = (args: commandArgProps[]) => {
    const lessDefault = (path: string) => {
      fs?.readFile(`${currentPath}/${path}`.replaceAll('//', '/'), 'utf-8', (err, data) => {
        if (err) {
          if (err.code === 'EISDIR') {
            errorPattern(`less: ${currentPath}/${path}: Is a directory`)
            return
          }
          fs?.readFile(`${path}`.replaceAll('//', '/'), 'utf-8', (err, data) => {
            if (err) {
              if (err.code === 'EISDIR') {
                errorPattern(`less: ${path}: Is a directory`)
                return
              }
              errorPattern(`The system cannot find the path specified.`)
              return
            }
            const lines = data?.split('\n') || []
            lines?.forEach((line, index) => {
              if (index < 20) {
                processCommand(`${index} -- ${line}`)
              }
            })
          })
        }
        const lines = data?.split('\n') || []
        lines?.forEach((line, index) => {
          if (index < 20) {
            processCommand(`${index} -- ${line}`)
          }
        })
      })
    }

    if (args[0].name && !args[1]?.name) {
      lessDefault(args[0].name)
      return
    }

    if ((args[0].name as string) === '-h' || (args[0].name as string) === '--help') {
      clearCommand()
      processCommand(`Usage: less [OPTION]`);
      processCommand(`Show the content of the file.`);
      processCommand(`Options:`);
      processCommand(`-h, --help, Show this help`);
      processCommand(`[PATH], Show the content of the file`);
      return;
    }
  }

  const headCommand = (args: commandArgProps[]) => {
    const headDefault = (path: string) => {
      fs?.readFile(`${currentPath}/${path}`.replaceAll('//', '/'), 'utf-8', (err, data) => {
        if (err) {
          if (err.code === 'EISDIR') {
            errorPattern(`head: ${currentPath}/${path}: Is a directory`)
            return
          }
          fs?.readFile(`${path}`.replaceAll('//', '/'), 'utf-8', (err, data) => {
            if (err) {
              if (err.code === 'EISDIR') {
                errorPattern(`head: ${path}: Is a directory`)
                return
              }
              errorPattern(`The system cannot find the path specified.`)
              return
            }
            const lines = data?.split('\n') || []
            lines?.forEach((line, index) => {
              if (index < 10) {
                processCommand(`${index} -- ${line}`)
              }
            })
          })
        }
        const lines = data?.split('\n') || []
        lines?.forEach((line, index) => {
          if (index < 10) {
            processCommand(`${index} -- ${line}`)
          }
        })
      })
    }

    if (args[0].name && !args[1]?.name) {
      headDefault(args[0].name)
      return
    }

    if (args[0].name && args[1]?.name) {
      fs?.readFile(`${currentPath}/${args[1].name}`.replaceAll('//', '/'), 'utf-8', (err, data) => {
        if (err) {
          if (err.code === 'EISDIR') {
            errorPattern(`head: ${currentPath}/${args[1].name}: Is a directory`)
            return
          }
          fs?.readFile(`${args[1].name}`.replaceAll('//', '/'), 'utf-8', (err, data) => {
            if (err) {
              if (err.code === 'EISDIR') {
                errorPattern(`head: ${args[1].name}: Is a directory`)
                return
              }
              errorPattern(`The system cannot find the path specified.`)
              return
            }
            const lines = data?.split('\n') || []
            lines?.forEach((line, index) => {
              if (index < parseInt(args[0].name)) {
                processCommand(`${index} -- ${line}`)
              }
            })
          })
        }
        const lines = data?.split('\n') || []
        lines?.forEach((line, index) => {
          if (index < parseInt(args[0].name)) {
            processCommand(`${index} -- ${line}`)
          }
        })
      })
      return
    }

    if (args[0].name === '-n' && args[1]?.name && args[2]?.name) {
      fs?.readFile(`${currentPath}/${args[2].name}`.replaceAll('//', '/'), 'utf-8', (err, data) => {
        if (err) {
          if (err.code === 'EISDIR') {
            errorPattern(`head: ${currentPath}/${args[2].name}: Is a directory`)
            return
          }
          fs?.readFile(`${args[2].name}`.replaceAll('//', '/'), 'utf-8', (err, data) => {
            if (err) {
              if (err.code === 'EISDIR') {
                errorPattern(`head: ${args[2].name}: Is a directory`)
                return
              }
              errorPattern(`The system cannot find the path specified.`)
              return
            }
            const lines = data?.split('\n') || []
            lines?.forEach((line, index) => {
              if (index < parseInt(args[1].name)) {
                processCommand(`${index} -- ${line}`)
              }
            })
          })
        }
        const lines = data?.split('\n') || []
        lines?.forEach((line, index) => {
          if (index < parseInt(args[1].name)) {
            processCommand(`${index} -- ${line}`)
          }
        })
      })
      return
    }

    if (args[0].name === '-n' && args[1]?.name && !args[2]?.name) {
      headDefault(args[1].name)
      return
    }

    if (args[0].name === '-n' && !args[1]?.name) {
      warningPattern(`Please specify a file`)
      return
    }

    if (args[0].name === '-n' && !args[1]?.name && !args[2]?.name) {
      warningPattern(`Please specify a file`)
      return
    }

    if (args[0].name && !args[1]?.name && !args[2]?.name) {
      headDefault(args[0].name)
      return
    }

    if(args[0]?.name === '-h' || args[0]?.name === '--help'){
      clearCommand();
      processCommand(`Usage: head [OPTION]`);
      processCommand(`Show the first lines of the file.`);
      processCommand(`Options:`);
      processCommand(`-h, --help, Show this help`);
      processCommand(`[PATH], Show the first 10 lines of the file`);
      processCommand(`-n [NUMBER] [PATH], Show the first [NUMBER] lines of the file`);
      return;
    }
  }

  const tailCommand = (args: commandArgProps[]) => {
    const tailDefault = (path: string) => {
      fs?.readFile(`${currentPath}/${path}`.replaceAll('//', '/'), 'utf-8', (err, data) => {
        if (err) {
          if (err.code === 'EISDIR') {
            errorPattern(`tail: ${currentPath}/${path}: Is a directory`)
            return
          }
          fs?.readFile(`${path}`.replaceAll('//', '/'), 'utf-8', (err, data) => {
            if (err) {
              if (err.code === 'EISDIR') {
                errorPattern(`tail: ${path}: Is a directory`)
                return
              }
              errorPattern(`The system cannot find the path specified.`)
              return
            }
            const lines = data?.split('\n') || []
            lines?.forEach((line, index) => {
              if (index > lines.length - 10) {
                processCommand(`${index} -- ${line}`)
              }
            })
          })
        }
        const lines = data?.split('\n') || []
        lines?.forEach((line, index) => {
          if (index > lines.length - 10) {
            processCommand(`${index} -- ${line}`)
          }
        })
      })
    }

    if (args[0].name && !args[1]?.name) {
      tailDefault(args[0].name)
      return
    }

    if (args[0].name && args[1]?.name) {
      fs?.readFile(`${currentPath}/${args[1].name}`.replaceAll('//', '/'), 'utf-8', (err, data) => {
        if (err) {
          if (err.code === 'EISDIR') {
            errorPattern(`tail: ${currentPath}/${args[1].name}: Is a directory`)
            return
          }
          fs?.readFile(`${args[1].name}`.replaceAll('//', '/'), 'utf-8', (err, data) => {
            if (err) {
              if (err.code === 'EISDIR') {
                errorPattern(`tail: ${args[1].name}: Is a directory`)
                return
              }
              errorPattern(`The system cannot find the path specified.`)
              return
            }
            const lines = data?.split('\n') || []
            lines?.forEach((line, index) => {
              if (index > lines.length - parseInt(args[0].name)) {
                processCommand(`${index} -- ${line}`)
              }
            })
          })
        }
        const lines = data?.split('\n') || []
        lines?.forEach((line, index) => {
          if (index > lines.length - parseInt(args[0].name)) {
            processCommand(`${index} -- ${line}`)
          }
        })
      })
      return
    }

    if (args[0].name === '-n' && args[1]?.name && args[2]?.name) {
      fs?.readFile(`${currentPath}/${args[2].name}`.replaceAll('//', '/'), 'utf-8', (err, data) => {
        if (err) {
          if (err.code === 'EISDIR') {
            errorPattern(`tail: ${currentPath}/${args[2].name}: Is a directory`)
            return
          }
          fs?.readFile(`${args[2].name}`.replaceAll('//', '/'), 'utf-8', (err, data) => {
            if (err) {
              if (err.code === 'EISDIR') {
                errorPattern(`tail: ${args[2].name}: Is a directory`)
                return
              }
              errorPattern(`The system cannot find the path specified.`)
              return
            }
            const lines = data?.split('\n') || []
            lines?.forEach((line, index) => {
              if (index > lines.length - parseInt(args[1].name)) {
                processCommand(`${index} -- ${line}`)
              }
            })
          })
        }
        const lines = data?.split('\n') || []
        lines?.forEach((line, index) => {
          if (index > lines.length - parseInt(args[1].name)) {
            processCommand(`${index} -- ${line}`)
          }
        })
      })
      return
    }

    if (args[0].name === '-n' && args[1]?.name && !args[2]?.name) {
      tailDefault(args[1].name)
      return
    }

    if (args[0].name === '-n' && !args[1]?.name) {
      warningPattern(`Please specify a file`)
      return
    }

    if (args[0].name === '-n' && !args[1]?.name && !args[2]?.name) {
      warningPattern(`Please specify a file`)
      return
    }

    if (args[0].name && !args[1]?.name && !args[2]?.name) {
      tailDefault(args[0].name)
      return
    }

    if(args[0]?.name === '-h' || args[0]?.name === '--help'){
      clearCommand();
      processCommand(`Usage: tail [OPTION]`);
      processCommand(`Show the last lines of the file.`);
      processCommand(`Options:`);
      processCommand(`-h, --help, Show this help`);
      processCommand(`[PATH], Show the last 10 lines of the file`);
      processCommand(`-n [NUMBER] [PATH], Show the last [NUMBER] lines of the file`);
      return;
    }
  }

  const wcCommand = (args: commandArgProps[]) => {
    const wcDefault = (path: string) => {
      fs?.readFile(`${currentPath}/${path}`.replaceAll('//', '/'), 'utf-8', (err, data) => {
        if (err) {
          if (err.code === 'EISDIR') {
            fs?.readdir(`${currentPath}/${path}`.replaceAll('//', '/'), (err, items) => {
              if (err) {
                errorPattern(`The system cannot find the path specified.`)
                return
              }
              processCommand(`${items?.length} ${path}`)
            })
            return
          }
          fs?.readFile(`${path}`.replaceAll('//', '/'), 'utf-8', (err, data) => {
            if (err) {
              if (err.code === 'EISDIR') {
                fs?.readdir(`${path}`.replaceAll('//', '/'), (err, items) => {
                  if (err) {
                    errorPattern(`The system cannot find the path specified.`)
                    return
                  }
                  processCommand(`${items?.length} ${path}`)
                })
                return
              }
              errorPattern(`The system cannot find the path specified.`)
              return
            }
            const lines = data?.split('\n') || []
            processCommand(`${lines.length} ${path}`)
          })
        }
        const lines = data?.split('\n') || []
        processCommand(`${lines.length} ${path}`)
      })
    }

    if (args[0].name && !args[1]?.name) {
      wcDefault(args[0].name)
      return
    }

    if (args[0].name && args[1]?.name) {
      fs?.readFile(`${currentPath}/${args[1].name}`.replaceAll('//', '/'), 'utf-8', (err, data) => {
        if (err) {
          if (err.code === 'EISDIR') {
            fs?.readdir(`${currentPath}/${args[1].name}`.replaceAll('//', '/'), (err, items) => {
              if (err) {
                errorPattern(`The system cannot find the path specified.`)
                return
              }
              processCommand(`${items?.length} ${args[0].name}`)
            })
            return
          }
          fs?.readFile(`${args[1].name}`.replaceAll('//', '/'), 'utf-8', (err, data) => {
            if (err) {
              if (err.code === 'EISDIR') {
                fs?.readdir(`${args[1].name}`.replaceAll('//', '/'), (err, items) => {
                  if (err) {
                    errorPattern(`The system cannot find the path specified.`)
                    return
                  }
                  processCommand(`${items?.length} ${args[0].name}`)
                })
                return
              }
              errorPattern(`The system cannot find the path specified.`)
              return
            }
            const lines = data?.split('\n') || []
            processCommand(`${lines.length} ${args[0].name}`)
          })
        }
        const lines = data?.split('\n') || []
        processCommand(`${lines.length} ${args[0].name}`)
      })
      return
    }

    if (args[0].name === '-l' && args[1]?.name && args[2]?.name) {
      fs?.readFile(`${currentPath}/${args[2].name}`.replaceAll('//', '/'), 'utf-8', (err, data) => {
        if (err) {
          if (err.code === 'EISDIR') {
            fs?.readdir(`${currentPath}/${args[2].name}`.replaceAll('//', '/'), (err, items) => {
              if (err) {
                errorPattern(`The system cannot find the path specified.`)
                return
              }
              processCommand(`${items?.length} ${args[1].name}`)
            })
            return
          }
          fs?.readFile(`${args[2].name}`.replaceAll('//', '/'), 'utf-8', (err, data) => {
            if (err) {
              if (err.code === 'EISDIR') {
                fs?.readdir(`${args[2].name}`.replaceAll('//', '/'), (err, items) => {
                  if (err) {
                    errorPattern(`The system cannot find the path specified.`)
                    return
                  }
                  processCommand(`${items?.length} ${args[1].name}`)
                })
                return
              }
              errorPattern(`The system cannot find the path specified.`)
              return
            }
            const lines = data?.split('\n') || []
            processCommand(`${lines.length} ${args[1].name}`)
          })
        }
        const lines = data?.split('\n') || []
        processCommand(`${lines.length} ${args[1].name}`)
      })
      return
    }

    if (args[0].name === '-l' && args[1]?.name && !args[2]?.name) {
      wcDefault(args[1].name)
      return
    }

    if (args[0].name === '-l' && !args[1]?.name) {
      warningPattern(`Please specify a file`)
      return
    }

    if (args[0].name === '-l' && !args[1]?.name && !args[2]?.name) {
      warningPattern(`Please specify a file`)
      return
    }

    if (args[0].name && !args[1]?.name && !args[2]?.name) {
      wcDefault(args[0].name)
      return
    }

    if(args[0]?.name === '-h' || args[0]?.name === '--help'){
      clearCommand();
      processCommand(`Usage: wc [OPTION]`);
      processCommand(`Show the number of lines of the file.`);
      processCommand(`Options:`);
      processCommand(`-h, --help, Show this help`);
      processCommand(`[PATH], Show the number of lines of the file`);
      processCommand(`-l [PATH], Show the number of lines of the file`);
      return;
    }
  }

  const unameCommand = (args: commandArgProps[]) => {
    const unameDefault = () => {
      processCommand(`Running: ${os}`)
    }

    if(!args[0]?.name){
      unameDefault()
      return
    }

    if(args[0]?.name === '-h' || args[0]?.name === '--help'){
      clearCommand();
      processCommand(`Usage: uname [OPTION]`);
      processCommand(`Show the system name.`);
      processCommand(`Options:`);
      processCommand(`-h, --help, Show this help`);
      return;
    }
  }



  const neoFetchCommand = (args: commandArgProps[]) => {
    const neoFetchDefault = () => {
      processCommand('Alaska Web OS')
      processCommand(`System OS: ${os}`)
      processCommand('Running in FileSystem')

    }

    if(!args[0]?.name){
      neoFetchDefault()
      return
    }

    if(args[0]?.name === '-h' || args[0]?.name === '--help'){
      clearCommand();
      processCommand(`Usage: neofetch [OPTION]`);
      processCommand(`Show the system information.`);
      processCommand(`Options:`);
      processCommand(`-h, --help, Show this help`);
      return;
    }
  }

  const helpCommand = (args: commandArgProps[]) => {
    const helpDefault = () => {
      processCommand(`ls, List files and directories`)
      processCommand(`clear, Clear the terminal screen`)
      processCommand(`cd, Change the current directory`)
      processCommand(`cat, Show the content of the file`)
      processCommand(`touch, Create a file`)
      processCommand(`rmdir, Remove a directory`)
      processCommand(`rm, Remove a file`)
      processCommand(`history, Show the executed commands history`)
      processCommand(`mv, Move a file or directory`)
      processCommand(`cp, Copy a file or directory`)
      processCommand(`echo, Show a message`)
      processCommand(`grep, Search for a pattern in a file`)
      processCommand(`find, Search for a file or directory`)
      processCommand(`ipconfig, Show the network information`)
      processCommand(`ps, Show the running processes`)
      processCommand(`top, Show the running processes`)
      processCommand(`mkdir, Create a directory`)
      processCommand(`kill, Kill a process`)
      processCommand(`code, Open a file in the code editor`)
      processCommand(`data, Open a file in the data reader`)
      processCommand(`date, Show the current date`)
      processCommand(`time, Show the current time`)
      processCommand(`cal, Show the current month calendar`)
      processCommand(`du, Show the disk usage of the specified directory`)
      processCommand(`pwd, Show the current directory`)
      processCommand(`exit, Exit the terminal`)
      processCommand(`more, Show the content of the file`)
      processCommand(`less, Show the content of the file`)
      processCommand(`head, Show the first lines of the file`)
      processCommand(`tail, Show the last lines of the file`)
      processCommand(`wc, Show the number of lines of the file`)
      processCommand(`uname, Show the system name`)
      processCommand(`neofetch, Show the system information`)
      processCommand(`help, Show this help`)
    }

    if(!args[0]?.name){
      helpDefault()
      return
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
      case 'rmdir':
      case 'rm':
        AppendToExecutedCommands(command)
        rmCommand(command.args || [])
        break;
      case 'history':
        AppendToExecutedCommands(command)
        historyCommand(command.args || [])
        break;
      case 'mv':
        AppendToExecutedCommands(command)
        mvCommand(command.args || [])
        break;
      case 'cp':
        AppendToExecutedCommands(command)
        cpCommand(command.args || [])
        break;
      case 'echo':
        AppendToExecutedCommands(command)
        echoCommand(command.args || [])
        break;
      case 'grep':
        AppendToExecutedCommands(command)
        grepCommand(command.args || [])
        break;
      case 'find':
      case 'locate':
        AppendToExecutedCommands(command)
        findCommand(command.args || [])
        break;
      case 'ipconfig':
      case 'ifconfig':
      case 'net':
        AppendToExecutedCommands(command)
        netCommand(command.args || [])
        break;
      case 'ps':
      case 'top':
        AppendToExecutedCommands(command)
        topCommand(command.args || [])
        break;
      case 'mkdir':
        AppendToExecutedCommands(command)
        mkdirCommand(command.args || [])
        break;
      case 'kill':
        AppendToExecutedCommands(command)
        killCommand(command.args || [])
        break;
      case 'code':
        AppendToExecutedCommands(command)
        openInCodeEditor(command.args || [])
        break;
      case 'data':
        AppendToExecutedCommands(command)
        openInDataReader(command.args || [])
        break;
      case 'date':
        AppendToExecutedCommands(command)
        dateCommand(command.args || [])
        break;
      case 'time':
        AppendToExecutedCommands(command)
        timeCommand(command.args || [])
        break;
      case 'cal':
        AppendToExecutedCommands(command)
        calCommand(command.args || [])
        break;
      case 'du':
        AppendToExecutedCommands(command)
        duCommand(command.args || [])
        break;
      case 'pwd':
        AppendToExecutedCommands(command)
        pwdCommand(command.args || [])
        break;
      case 'exit':
        AppendToExecutedCommands(command)
        exitCommand(command.args || [])
        break;
      case 'more':
        AppendToExecutedCommands(command)
        moreCommand(command.args || [])
        break;
      case 'less':
        AppendToExecutedCommands(command)
        lessCommand(command.args || [])
        break;
      case 'head':
        AppendToExecutedCommands(command)
        headCommand(command.args || [])
        break;
      case 'tail':
        AppendToExecutedCommands(command)
        tailCommand(command.args || [])
        break;
      case 'wc':
        AppendToExecutedCommands(command)
        wcCommand(command.args || [])
        break;
      case 'uname':
        AppendToExecutedCommands(command)
        unameCommand(command.args || [])
        break;
      case 'neofetch':
        AppendToExecutedCommands(command)
        neoFetchCommand(command.args || [])
        break;
      case 'help':
        AppendToExecutedCommands(command)
        helpCommand(command.args || [])
        break;
      default:
        AppendToExecutedCommands(command)
        errorPattern(`'${command.name}' is not recognized as an internal or external command, operable program or batch file.`)
        break;
    }
  }

  if(interceptBrowserConsole){
    console.log = (message: string, ...optionalParams: any[]) => {
      setCommandsHistory([...commandsHistory, message]);
    }
  }

  if(vanilla){
    return(
      <div
        className='w-full h-full
      flex flex-col-reverse overflow-hidden
      p-1
      '
        style={{
          backgroundColor: states.Settings.settings.system.systemBackgroundColor
        }}
      >
        <div className='w-full h-[calc(100%-32px)]  overflow-auto flex flex-col'>
          {commandsHistory?.map((item, index) => {

            return (
              <>
                <ProcessColor
                key={index}
                text={`${item}`.replaceAll('//', '/')}
              />
                <div
                  ref={endRef}
                />
              </>
            )
          })}
        </div>
        <div
          className='sticky w-full h-8 flex items-center justify-start shrink-0 p-1'
        >
          <div className='w-auto h-full pr-1 mt-1 shrink-0'>
            <CustomText
              className='!text-xs'
              text={`C:${currentPath}> `.replaceAll('//', '/')}
            />
          </div>
          <input
            className='w-full h-8 bg-transparent text-sm outline-none mt-1'
            type='text'
            autoFocus
            onChange={(e) => setInputValue(e.currentTarget.value)}
            value={`${inputValue}`}
            style={{
              color: states.Settings.settings.system.systemTextColor
            }}
            onKeyPress={handleKeyPress}
            onKeyDown={handleTabPress}
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
    )
  }

  return (
    <DefaultWindow
      currentTab={tab}
      currentWindow={AlaskaWindow}
      onClose={() => {}}
      onMaximize={() => {}}
      onMinimize={() => {}}
      uuid={tab.uuid}
      title={AlaskaWindow.title}
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
        <div className='w-full h-[calc(100%-46px)]  overflow-auto flex flex-col'>
          {
            commandsHistory?.length === 0 && executedCommands.length === 0 &&
            <div
              className='w-full h-full flex justify-start items-start'
            >
              <span>
                {welcomeMessage().split('\n').map((line, lineIndex) => {
                  return (
                    <>
                      <span 
                        key={lineIndex}
                        className='!text-sm'
                        style={{
                          color: states.Settings.settings.system.systemTextColor
                        }}
                        >{line}<br/>
                        </span>
                      
                    </>
                  )
                })}
              </span>
            </div>

          }
          {commandsHistory?.map((item, index) => {

            return (
              <>
                <ProcessColor
                key={index}
                text={`${item}`.replaceAll('//', '/')}
              />
                <div
                  ref={endRef}
                />
              </>
            )
          })}
        </div>
        <div
          className='sticky w-full h-8 flex items-center justify-start shrink-0 pb-2 mb-1'
        >
          <div className='w-auto h-full pr-1 mt-1 shrink-0'>
            <CustomText
              className='!text-xs'
              text={`C:${currentPath}> `.replaceAll('//', '/')}
            />
          </div>
          <input
            className='w-full h-8 bg-transparent text-sm outline-none mt-1'
            type='text'
            autoFocus
            onChange={(e) => setInputValue(e.currentTarget.value)}
            value={`${inputValue}`}
            style={{
              color: states.Settings.settings.system.systemTextColor
            }}
            onKeyPress={handleKeyPress}
            onKeyDown={handleTabPress}
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
    </DefaultWindow>
  )
}

export default Terminal