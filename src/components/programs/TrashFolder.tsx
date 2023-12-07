import useFS from '@/hooks/useFS'
import useStore from '@/hooks/useStore'
import { SimpleGrid, Tooltip } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import CustomText from '../atoms/CustomText'
import { convertSizeToKBMBGBExtended, getExtension, getLastPathSegment, verifyIfIsFile } from '@/utils/file'
import { generateIcon } from '@/utils/icons'
import DesktopFile from '../molecules/DesktopFile'
import DesktopFolder from '../molecules/DesktopFolder'
import { ClearFiles } from '@/store/actions'
import { programProps } from '@/types/programs'
import DefaultWindow from '../containers/DefaultWindow'
const TrashFolder = ({
  AlaskaWindow,
  tab,
}:programProps) => {

  const basePath = '/ProgramFiles/Trash'

  const {fs, deletePermanentlyRecursive} = useFS()
  const {states , dispatch } = useStore()

  const [totalItems, setTotalItems] = useState<number>(0)
  const [totalSelectedItems, setTotalSelectedItems] = useState<number>(0)
  const [totalBytes, setTotalBytes] = useState<number>(0)
  const [paths, setPaths] = useState<string[]>([])




  useEffect(() => {
    if(!fs) return
    fs.readdir(basePath, (err, paths) => {
      if(err) return console.error(err)
      if(paths){
        setPaths(paths)
        setTotalItems(paths.length)
        dispatch(ClearFiles())
      }
    })
  }, [fs])

  const refresh = () => {
    fs?.readdir(basePath, (err, paths) => {
      if(err) return console.error(err)
      if(paths){
        setPaths(paths)
        setTotalItems(paths.length)
      }
    })
  }

  useEffect(() => {
    if(fs){
      refresh()
    }
  },[fs,states.Windows, states.File,states.Mouse])
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
  useEffect(() => {
    setTotalSelectedItems(states.File.selectedFiles.length || 0)
    calculateTotalBytes(states.File.selectedFiles).then((bytes) => {
      setTotalBytes(bytes)
    })
  }, [states.File.selectedFiles])

  return (
    <DefaultWindow
      currentTab={tab}
      currentWindow={AlaskaWindow}
      title='Trash'
      uuid={tab.uuid}
      onClose={() => {}}
      onMinimize={() => {}}
      onMaximize={() => {}}
      resizable
    >
      <div className='w-full h-full flex flex-col'
      style={{
        background: states.Settings.settings.system.systemBackgroundColor,
      }}
      >
        <div className='sticky w-full h-10 flex p-1 border-b border-gray-400 border-opacity-30'>
          <Tooltip
            label='Restore'
          >
            <div className='
            w-8 h-8 mx-1 flex bg-white bg-opacity-0 rounded
            items-center justify-center cursor-pointer
            hover:bg-opacity-10 transition-all duration-300
            '
            onDoubleClick={() => {
              states.File.selectedFiles.forEach((path) => {

                console.log(path)
                fs?.rename(path, `/Desktop/${getLastPathSegment(path)}`, (err) => {
                  if (err) {
                    console.log(err);
                  } else {
                    dispatch(ClearFiles())
                    refresh()
                  }
                })
              })
            
            }}
            >
              <span
                className='i-mdi-trash-restore text-2xl'
                style={{
                  color: states.Settings.settings.system.systemTextColor,
                }}
              />
            </div>
          </Tooltip>
          <Tooltip
            label='Delete'
          >
            <div className='
            w-8 h-8 mx-1 flex bg-white bg-opacity-0 rounded
            items-center justify-center cursor-pointer
            hover:bg-opacity-10 transition-all duration-300
            '
            onDoubleClick={() => {
              states.File.selectedFiles.forEach((path) => {
                if(path === '/ProgramFiles/Trash'){
                  console.log('Cannot delete trash folder')
                  return
                } 
                fs?.unlink(path, (err) => {
                  if (err) {
                    console.log(err);
                    if(err.code === '2'){
                      fs?.rmdir(path, (err) => {
                        if (err) {
                          if(err.code === 'ENOTEMPTY'){
                            deletePermanentlyRecursive(path)
                          }
                        } else {
                          dispatch(ClearFiles())
                          refresh()
                        }
                      })
                    }
                  } else {
                    dispatch(ClearFiles())
                    refresh()
                  }
                })
              })
            
            
            }}
            >
              <span
                className='i-mdi-trash text-2xl'
                style={{
                  color: states.Settings.settings.system.systemTextColor,
                }}
              />
            </div>
          </Tooltip>
          <Tooltip
            label='Delete All'
          >
            <div className='
            w-8 h-8 mx-1 flex bg-white bg-opacity-0 rounded
            items-center justify-center cursor-pointer
            hover:bg-opacity-10 transition-all duration-300
            '
            onDoubleClick={() => {
              fs?.readdir(basePath, (err, paths) => {
                if(err) return console.error(err)
                if(paths){
                  paths.forEach((path) => {
                    fs?.unlink(`${basePath}/${path}`, (err) => {
                      if (err) {
                        console.log(err);
                        fs?.rmdir(`${basePath}/${path}`, (err) => {
                          if (err) {
                            deletePermanentlyRecursive(`${basePath}/${path}`)
                          } else {
                            dispatch(ClearFiles())
                            refresh()
                          }
                        })
                      } else {
                        dispatch(ClearFiles())
                        refresh()
                      }
                    })
                  })
                }
              })
            }}
            >
              <span
                className='i-mdi-trash-empty text-2xl'
                style={{
                  color: states.Settings.settings.system.systemTextColor,
                }}
              />
            </div>
          </Tooltip>
        </div>
        <div className='w-full h-[calc(100%-72px)] flex p-1'>
          <SimpleGrid
            cols={{ xs: 3, base: 4, sm: 5, md: 6, lg: 7, xl: 10 }}
            spacing={5} verticalSpacing={5}
            id='TrashFolder'
            className='flex flex-col flex-wrap w-full h-full px-2 py-2'
          >
            {paths.map((path, index) => {
              if (verifyIfIsFile(path)) {
                return (
                  <DesktopFile
                    key={index}
                    title={path}
                    path={`${basePath}/${path}`}
                    icon={generateIcon(getExtension(path)) || '/assets/icons/file.png'}
                  />
                )
              } else {
                return (
                  <DesktopFolder
                    key={index}
                    title={path}
                    path={`${basePath}/${path}`}
                    icon={generateIcon(getExtension(path)) || '/assets/icons/folder.png'}
                  />
                )
              }
            })}
          </SimpleGrid>
        </div>
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

export default TrashFolder