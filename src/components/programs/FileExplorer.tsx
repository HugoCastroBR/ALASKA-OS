import useStore from '@/hooks/useStore'
import { Anchor, Breadcrumbs, SimpleGrid } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import CustomText from '../atoms/CustomText'
import { convertSizeToKBMBGBExtended, extractParentPath, getExtension, verifyIfIsFile } from '@/utils/file'
import { Dropzone } from '@mantine/dropzone'
import { ClearFiles, SetMouseInDesktop, SetMousePath } from '@/store/actions'
import useFS from '@/hooks/useFS'
import DesktopFile from '../molecules/DesktopFile'
import DesktopFolder from '../molecules/DesktopFolder'
import { generateIcon } from '@/utils/icons'
import { HistoryPathProps } from '@/types/system'
import NewDirFileItem from '../molecules/NewDirFileItem'
import NewDirFolderItem from '../molecules/NewDirFolderItem'
import { programProps } from '@/types/programs'
import DefaultWindow from '../containers/DefaultWindow'



const FileExplorer = ({
  tab,
  AlaskaWindow
}: programProps) => {

  const { states, dispatch } = useStore()
  const { fs, copyFileByPath, copyExternalFile, moveFileByPath } = useFS()
  const [currentPath, setCurrentPath] = useState<string>(tab.value || '/')

  const [pathHistory, setPathHistory] = useState<HistoryPathProps[]>(currentPath.replaceAll('//', '/').split('/').map((p, index) => {
    if (index === 0) {
      return {
        title: 'C:',
        path: '/'
      }
    }
    return {
      title: `${p.replaceAll('/', '')}`,
      path: currentPath.split('/').slice(0, index + 2).join('/')
    }
  }))
  const [totalItems, setTotalItems] = useState<number>(0)
  const [totalSelectedItems, setTotalSelectedItems] = useState<number>(0)
  const [totalBytes, setTotalBytes] = useState<number>(0)
  const [draggedItemsCount, setDraggedItemsCount] = useState(0);
  const [paths, setPaths] = useState<string[]>([])
  const [searchValue, setSearchValue] = useState<string>('')

  const changePath = (path: string) => {
    if (path === currentPath) return
    if (path === '/') {
      setPathHistory([{
        title: 'C:',
        path: '/'
      }])
    }

    console.log('change path: ', path)

    setPathHistory(path.replaceAll('//', '/').split('/').map((p, index) => {
      if (index === 0) {
        return {
          title: 'C:',
          path: '/'
        }
      }
      return {
        title: `${p.replaceAll('/', '')}`,
        path: path.split('/').slice(0, index + 2).join('/')
      }
    }))
    setCurrentPath(path)
  }

  useEffect(() => {
    refresh()
  }, [fs, currentPath, states.File, states.Mouse])

  const refresh = () => {
    fs?.readdir(currentPath, (err, files) => {
      if (err) {
        console.log(err)
        return
      }
      if (files) {
        setPaths(files)
      }
      setTotalItems(files?.length || 0)
    })
  }

  useEffect(() => {
    if (fs) {
      fs.readdir(currentPath, (err, files) => {
        if (err) {
          console.log(err)
          return
        }
        if (files) {
          setPaths(files)
          setPathHistory(currentPath.replaceAll('//', '/').split('/').map((p, index) => {
            if (index === 0) {
              return {
                title: 'C:',
                path: '/'
              }
            }
            return {
              title: `${p.replaceAll('/', '')}`,
              path: currentPath.split('/').slice(0, index + 2).join('/')
            }
          }))
        }
        setTotalItems(files?.length || 0)
      })
    }
  }, [currentPath])

  const goBack = () => {
    const parentPath = extractParentPath(currentPath)
    if (parentPath === currentPath) return
    if (parentPath) {
      changePath(parentPath)
    }
  }


  useEffect(() => {
    if (fs) {
      fs.readdir(currentPath, (err, files) => {
        if (err) {
          console.log(err)
          return
        }
        if (files) {
          setPaths(files)
        }
        setTotalItems(files?.length || 0)
      })
    }
  }, [fs])

  useEffect(() => {
    setTotalSelectedItems(states.File.selectedFiles.length || 0)
    calculateTotalBytes(states.File.selectedFiles).then((bytes) => {
      setTotalBytes(bytes)
    })
  }, [states.File.selectedFiles])

  const calculateTotalBytes = async (paths: string[]) => {
    let totalSize = 0;

    const statPromises = paths.map((path) => {
      return new Promise((resolve, reject) => {
        fs?.stat(path, (err, stats) => {
          if (err) {
            console.log(err);
            reject(err);
          }
          if (stats) {
            totalSize += stats.size;
            resolve(stats);
          }
        });
      });
    });

    try {
      await Promise.all(statPromises);
      return totalSize;
    } catch (error) {
      console.error("Error calculating total size:", error);
      return 0; // or handle the error accordingly
    }
  };

  const breadCrumbsItems = pathHistory.map((path, index) => {
    return (
      <Anchor key={index} onClick={() => {
        changePath(path.path)
      }}  >
        <CustomText
          text={path.title}
          className='font-medium !text-xs'
          style={{
            color: states.Settings.settings.system.systemTextColor,
          }}
        />
      </Anchor>
    )
  })


  const verifyMouseInFileExplorer = () => {
    if (states.Mouse.mouseInDesktop) {
      return false
    }
    if (states.Mouse.mousePath === '/Desktop') {
      return false
    }
    return true
  }

  useEffect(() => {
    console.log(verifyMouseInFileExplorer())
  }, [states.Mouse])


  type HandlerDropProps = {
    files: string[] | File[],
    toPath: string
  }


  const handlerDrop = ({
    files,
    toPath
  }: HandlerDropProps) => {
    console.log('drop files!')
    if (states.File.selectedFiles.length === 0) {
      files.forEach((file) => {
        if (typeof file === 'string') {
          copyFileByPath(file, toPath)

        } else {
          copyExternalFile(file, toPath)
        }
      })
    } else {
      states.File.selectedFiles.forEach((file) => {
        moveFileByPath(file, toPath)
      })
    }
    refresh()
  }

  return (
    <DefaultWindow
      currentTab={tab}
      currentWindow={AlaskaWindow}
      uuid={tab.uuid}
      title='File Explorer'
      onMinimize={() => {
        dispatch(SetMouseInDesktop(true))
        dispatch(SetMousePath(''))
      }}
      onMaximize={() => {
        dispatch(SetMouseInDesktop(false))
        dispatch(SetMousePath(currentPath))
      }}
      onClose={() => {
        dispatch(SetMouseInDesktop(true))
        dispatch(SetMousePath(''))
      }}
      resizable
    >
      <div className='w-full h-full flex-col overflow-hidden'
        style={{
          backgroundColor: states.Settings.settings.system.systemBackgroundColor,
          color: states.Settings.settings.system.systemTextColor,
        }}
        onMouseEnter={() => {
          dispatch(SetMouseInDesktop(false))
          dispatch(SetMousePath(currentPath))
        }}
        onMouseLeave={() => {
          dispatch(SetMouseInDesktop(true))
          dispatch(SetMousePath(''))
        }}
        onDragOver={(e) => {
          e.stopPropagation()
          e.preventDefault()
          if(states.Mouse.mouseInDesktop){
            dispatch(SetMouseInDesktop(false))
            dispatch(SetMousePath(currentPath))
          }
        }}
        onDragEnter={(e) => {
          e.preventDefault();
          setDraggedItemsCount((count) => count + 1);
          dispatch(SetMouseInDesktop(false));
          dispatch(SetMousePath(currentPath));
        }}
  
        onDragLeave={(e) => {
          e.preventDefault();
          setDraggedItemsCount((count) => count - 1);
          // if (draggedItemsCount === 0) {
          //   dispatch(SetMouseInDesktop(true));
          //   dispatch(SetMousePath(''));
          // }
          dispatch(SetMouseInDesktop(true));
          dispatch(SetMousePath(''));
        }}
        onDoubleClick={() => {
          dispatch(ClearFiles())
        }}
      >
        <div className='sticky w-full h-12 flex py-px items-center justify-between
        border-b border-gray-400 border-opacity-30
        '>
          <div className='w-24 justify-evenly flex items-center px-1 h-full overflow-hidden'>
            <div
              className='w-12 h-12 flex items-center justify-center
              hover:bg-gray-200 hover:bg-opacity-30 rounded cursor-pointer
              transition-all duration-300 ease-in-out
              '
              onClick={() => {
                goBack()
              }}
            >
              <span className={`i-mdi-arrow-left text-3xl cursor-pointer ${currentPath === '/' ? 'brightness-50' : ''}`}
                style={{
                  color: states.Settings.settings.system.systemTextColor,
                }}
              />
            </div>
            <div
              className='w-12 h-12 flex items-center justify-center
            hover:bg-gray-200 hover:bg-opacity-30 rounded cursor-pointer
            transition-all duration-300 ease-in-out
            '
              onClick={() => {
                refresh()
              }}
            >
              <span className='i-mdi-refresh text-3xl cursor-pointer'
                style={{
                  color: states.Settings.settings.system.systemTextColor,
                }}
              />
            </div>
          </div>
          <div
            className='flex items-center px-1 h-8 w-[calc(100%-252px)]
          border border-gray-400 border-opacity-30 rounded overflow-hidden
          '
            style={{
              backgroundColor: states.Settings.settings.system.systemBackgroundColor,
            }}
          >
            <Breadcrumbs
              styles={{
                separator: {
                  color: states.Settings.settings.system.systemTextColor,
                  margin: '1px',
                }
              }}
            >
              {breadCrumbsItems}
            </Breadcrumbs>
          </div>
          <div className='flex items-center px-1 h-full'
            style={{
              width: '156px'
            }}
          >
            <input
              type='text'
              className='h-8 w-full text-xs outline-none rounded px-2 border border-gray-400 border-opacity-30'
              placeholder='Search...'
              onChange={(e) => {
                setSearchValue(e.target.value)
              }}
              value={searchValue}
              style={{
                backgroundColor: states.Settings.settings.system.systemBackgroundColor,
                color: states.Settings.settings.system.systemTextColor,
              }}
            />
          </div>
        </div>
        <Dropzone
          className='w-full h-[calc(100%-80px)] overflow-y-auto overflow-x-hidden'
          multiple
          disabled={!verifyMouseInFileExplorer()}
          onDrop={(files) => {
            console.log(files)
            handlerDrop({
              files,
              toPath: currentPath
            })
          }}
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
          }}
          onDoubleClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
          }}
        >
          <SimpleGrid
            cols={{ xs: 3, base: 4, sm: 5, md: 6, lg: 7, xl: 10 }}
            spacing={5} verticalSpacing={5}
            id='Explorer'
            className='flex flex-col  flex-wrap w-full h-full px-2 py-2'
          >
            {paths.filter((path) => {
              if (searchValue === '') return true
              if (path.toLowerCase().includes(searchValue.toLowerCase())) return true
              return false
            }).map((path, index) => {
              if (verifyIfIsFile(path)) {
                return (
                  <DesktopFile
                    key={index}
                    title={path}
                    path={`${currentPath}/${path}`}
                    icon={generateIcon(getExtension(path)) || '/assets/icons/file.png'}
                  />
                )
              } else {
                return (
                  <DesktopFolder
                    key={index}
                    title={path}
                    path={`${currentPath}/${path}`}
                    icon={generateIcon(getExtension(path)) || '/assets/icons/folder.png'}
                    onDoubleClick={() => {
                      changePath(`${currentPath}/${path}`)
                    }}
                  />
                )
              }
            })}
            {(states.File.setIsNewFile && !states.Mouse.mouseInDesktop) && (
              <NewDirFileItem
                title='New File'
                icon='/assets/icons/file.png'
              />
            )}
            {(states.File.setIsNewFolder && !states.Mouse.mouseInDesktop) && (
              <NewDirFolderItem
                title='New Folder'
                icon='/assets/icons/folder.png'
              />
            )}
          </SimpleGrid>
        </Dropzone>
        <div className='sticky w-full h-8 flex py-1 px-2 items-center border-t border-gray-400 border-opacity-30'>
          <CustomText
            text={`${totalItems} items`}
            className='font-medium !text-xs mr-0.5'
            style={{
              color: states.Settings.settings.system.systemTextColor,
            }}
          />
          {
            totalSelectedItems > 0 && (
              <CustomText
                text={totalSelectedItems <= 1 ? `${totalSelectedItems} item selected` : `${totalSelectedItems} items selected`}
                className='font-medium !text-xs mx-0.5'
                style={{
                  color: states.Settings.settings.system.systemTextColor,
                }}
              />
            )
          }
          {
            totalSelectedItems > 0 && (
              <CustomText
                text={convertSizeToKBMBGBExtended(totalBytes)}
                className='font-medium !text-xs mx-0.5'
                style={{
                  color: states.Settings.settings.system.systemTextColor,
                }}
              />
            )
          }
        </div>
      </div>
    </DefaultWindow>
  )
}

export default FileExplorer