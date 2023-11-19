/* eslint-disable react-hooks/rules-of-hooks */
'use client'
import useStore from '@/hooks/useStore'
import useFS from '@/hooks/useFS'
import type { MouseMenuContext } from '@/types/mouse'
import { base64ToFile, convertFileExtensionToFileType, getExtension, getLastPathSegment, verifyIfIsFile } from '@/utils/file'
import React from 'react'
import CustomText from '../atoms/CustomText'
import { mouseContextMenuOptionsProps } from '@/types/mouse'
import { ClearFiles, SetCopiedFiles, SetIsNewFile, SetIsNewFolder, SetIsRename } from '@/store/actions'
import { ApiError } from 'next/dist/server/api-utils'
const MouseMenuContext = ({
  x,
  y,
  visible,
  onRefresh,
}:MouseMenuContext) => {
  if (!visible) return null


  const { states, dispatch } = useStore()
  const { fs } = useFS()
  const MouseOption = ({
    className,
    title,
    onClick,
    disabled,
  }: mouseContextMenuOptionsProps) => {
    return (
      <div
        onClick={(e) => {
          if (disabled) return
          e.preventDefault()
          onClick && onClick()
        }}
        className={`${disabled ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}
        text-white text-sm flex items-center hover:bg-blue-500 
        transition-all duration-300 ease-in-out cursor-pointer 
        w-44 h-6 -ml-1
        `}
      >
        <span className={`${className} text-lg`}></span>
        <CustomText
          text={title}
          className='ml-1'
        />
      </div>
    )
  }
  
  const MouseOptionDelete = () => {
    return (
      <MouseOption
        title='Delete'
        disabled={states.File.selectedFiles.length === 0}
        onClick={() => {
          states.File.selectedFiles.forEach((item) => {
            if (verifyIfIsFile(item)) {
              fs?.unlink(item, (err) => {
                if (err) {
                  fs?.rmdir(item, (err) => {
                    if (err) console.log(err)
                    console.log('deleted folder');
                  })
                } else {
                  console.log('deleted file');
                }

              })
            } else {
              fs?.rmdir(item, (err) => {
                if (err) {
                  fs?.unlink(item, (err) => {
                    if (err) console.log(err)
                    console.log('deleted file');
                  })
                } else {
                  console.log('deleted folder');
                }


              })
            }
            dispatch(ClearFiles())
          })
        }}
        className='i-mdi-delete'
      />
    )
  }

  const MouseOptionRename = () => {
    return(
      <MouseOption
        title='Rename'
        disabled={states.File.selectedFiles.length !== 1}
        onClick={() => {
          dispatch(SetIsRename(true))
        }}
        className='i-mdi-rename'
      />
    )
  }

  const MouseOptionNewFile = () => {
    return (
      <MouseOption
        title='New File'
        onClick={() => {
          dispatch(SetIsNewFile(true))
        }}
        className='i-mdi-file-plus'
      />
    )
  }
  
  const MouseOptionNewFolder = () => {
    return (
      <MouseOption
        title='New Folder'
        onClick={() => {
          dispatch(SetIsNewFolder(true))
        }}
        className='i-mdi-folder-plus'
      />
    )
  }

  const MouseOptionRefresh = () => {
    return (
      <MouseOption
        title='Refresh'
        onClick={() => {
          onRefresh && onRefresh()
        }}
        className='i-mdi-refresh'
      />
    )
  }

  const MouseOptionCopy = () => {
    return (
      <MouseOption
        title='Copy'
        disabled={states.File.selectedFiles.length < 1}
        onClick={() => {
          console.log('copy');
          dispatch(SetCopiedFiles())
        }}
        className='i-mdi-content-copy'
      />
    )
  }

  const MouseOptionPaste = () => {
    return (
      <MouseOption
        title='Paste'
        disabled={states.File.copiedFiles.length < 1}
        onClick={() => {
          const pasteTo = states.Mouse.mousePathHistory[states.Mouse.mousePathHistory.length - 1]
          if(states.Mouse.mouseInDesktop){
            states.File.copiedFiles.forEach((file) => {
              if(verifyIfIsFile(file)){
                fs?.readFile(file, 'utf-8', (err, data) => {
                  if(err) console.log(err)
                  console.log(`${"/Desktop"}/${getLastPathSegment(file)}`)
                  fs?.writeFile(`${"/Desktop"}/${getLastPathSegment(file)}`, data, (err) => {
                    if(err) console.log(err)
                    console.log('copied');
                  })
                })
              }
              else{
                fs?.mkdir(`${"/Desktop"}/${getLastPathSegment(file)}`, (err:ApiError) => {
                  if(err) console.log(err)
                  console.log('copied');
                })
              }
            })
          }
          states.File.copiedFiles.forEach((file) => {
            if(verifyIfIsFile(file)){
              fs?.readFile(file, 'utf-8', (err, data) => {
                if(err) console.log(err)
                console.log(`${pasteTo}/${getLastPathSegment(file)}`)
                fs?.writeFile(`${pasteTo}/${getLastPathSegment(file)}`, data, (err) => {
                  if(err) console.log(err)
                  console.log('copied');
                })
              })
            }
            else{
              fs?.mkdir(`${pasteTo}/${getLastPathSegment(file)}`, (err:ApiError) => {
                if(err) console.log(err)
                console.log('copied');
              })
            }
          })
        }}
        className='i-mdi-content-paste'
      />
    )
  }
  


  const MouseOptionDownload = () => {
    return (
      <MouseOption
        title='Download'
        disabled={states.File.selectedFiles.length < 1}
        onClick={() => {
          states.File.selectedFiles.forEach((file) => {
            if (!verifyIfIsFile(file)) return;
            
            fs?.readFile(file, 'utf8', (err, data) => {
              if (err) console.error(err);
              
              const fileType = convertFileExtensionToFileType(getExtension(file));
              const fileSolved = base64ToFile(data || '', {
                fileType,
                fileName: getLastPathSegment(file),
              });
        
              const blob = new Blob([fileSolved], { type: fileType });
              const objectUrl = URL.createObjectURL(blob);
        
              const element = document.createElement('a');
              element.href = objectUrl;
              element.download = getLastPathSegment(file);
              document.body.appendChild(element);
              element.click();
        
              // Limpar o objectUrl para evitar memory leaks
              URL.revokeObjectURL(objectUrl);
              document.body.removeChild(element);
            });
          });
        }}
        className='i-mdi-download'
      />
    )
  }

  return (
    <div
      className={`
      bg-gray-300 
        backdrop-filter backdrop-blur-sm shadow-md
        flex flex-col w-44 z-40  
        bg-opacity-20 
        p-1
    `}
      style={{
        position: 'absolute',
        top: y,
        left: x,
        zIndex: 100,
      }}
    > 
      <MouseOptionCopy />
      <MouseOptionPaste />
      <MouseOptionNewFile />
      <MouseOptionNewFolder />
      <MouseOptionRename />
      <MouseOptionDownload />
      <MouseOptionDelete />
      <MouseOptionRefresh />

      {/* <MouseOptionCopy /> */}
    </div>
  )
}

export default MouseMenuContext