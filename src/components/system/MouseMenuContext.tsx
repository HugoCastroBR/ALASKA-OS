/* eslint-disable react-hooks/rules-of-hooks */
'use client'
import useStore from '@/hooks/useStore'
import useFS from '@/hooks/useFS'
import type { MouseMenuContext } from '@/types/mouse'
import { addTypeToBase64, base64ToFile, convertFileExtensionToFileType, getExtension, getLastPathSegment, removeExtension, removeTypeFromBase64, uuid, verifyIfIsFile, wait } from '@/utils/file'
import React from 'react'
import CustomText from '../atoms/CustomText'
import { mouseContextMenuOptionsProps } from '@/types/mouse'
import { ClearFiles, SetCopiedFiles, SetIsNewFile, SetIsNewFolder, SetIsRename, WindowAddTab } from '@/store/actions'
import { ApiError } from 'next/dist/server/api-utils'
import jszip from 'jszip'
const MouseMenuContext = ({
  x,
  y,
  visible,
  onRefresh,
}: MouseMenuContext) => {
  if (!visible) return null


  const { states, dispatch } = useStore()
  const { fs } = useFS()
  const MouseOption = ({
    className,
    title,
    onClick,
    disabled,
    onMouseEnter,
    onMouseLeave,
    left,
  }: mouseContextMenuOptionsProps) => {
    return (
      <div
        onClick={(e) => {
          if (disabled) return
          e.preventDefault()
          onClick && onClick()
        }}
        onMouseEnter={() => {
          onMouseEnter && onMouseEnter()
        }}
        onMouseLeave={() => {
          onMouseLeave && onMouseLeave()
        }}
        className={`${disabled ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}
        text-white text-sm flex items-center hover:bg-blue-500 
        transition-all duration-300 ease-in-out cursor-pointer 
        w-44 h-6 -ml-1
        `}
      >
        <span className={`${className} text-lg`}></span>
        <div className='ml-1 w-full h-full flex items-center justify-between'>
          <CustomText
            text={title}
          />
          {left && left}
        </div>

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
    return (
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
          if (states.Mouse.mouseInDesktop) {
            states.File.copiedFiles.forEach((file) => {
              if (verifyIfIsFile(file)) {
                fs?.readFile(file, 'utf-8', (err, data) => {
                  if (err) console.log(err)
                  console.log(`${"/Desktop"}/${getLastPathSegment(file)}`)
                  fs?.writeFile(`${"/Desktop"}/${getLastPathSegment(file)}`, data, (err) => {
                    if (err) console.log(err)
                    console.log('copied');
                  })
                })
              }
              else {
                fs?.mkdir(`${"/Desktop"}/${getLastPathSegment(file)}`, (err: ApiError) => {
                  if (err) console.log(err)
                  console.log('copied');
                })
              }
            })
          }
          states.File.copiedFiles.forEach((file) => {
            if (verifyIfIsFile(file)) {
              fs?.readFile(file, 'utf-8', (err, data) => {
                if (err) console.log(err)
                console.log(`${pasteTo}/${getLastPathSegment(file)}`)
                fs?.writeFile(`${pasteTo}/${getLastPathSegment(file)}`, data, (err) => {
                  if (err) console.log(err)
                  console.log('copied');
                })
              })
            }
            else {
              fs?.mkdir(`${pasteTo}/${getLastPathSegment(file)}`, (err: ApiError) => {
                if (err) console.log(err)
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
          console.log('download')
          states.File.selectedFiles.forEach((file) => {
            if (!verifyIfIsFile(file)) return;

            fs?.readFile(file, 'utf-8', (err, data) => {
              console.log(file,data)
              if (err) console.error(err);
              if (!data) return;

              const fileType = convertFileExtensionToFileType(getExtension(file));
              const fileSolved = base64ToFile(data || '', {
                fileType,
                fileName: getLastPathSegment(file),
              });

              console.log(fileSolved)

              const blob = new Blob([fileSolved]);
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

  const MouseOptionOpenInBrowser = () => {
    return (
      <MouseOption
        title='Open in Browser'
        disabled={states.File.selectedFiles.length !== 1}
        className='i-mdi-web'
        onClick={() => {
          states.File.selectedFiles.forEach((file) => {
            const content = fs?.readFile(file, 'utf-8', (err, data) => {
              dispatch(WindowAddTab({
                title: 'Browser',
                tab: {
                  title: 'Browser',
                  ficTitle: getLastPathSegment(file),
                  uuid: uuid(6),
                  value: data,
                  maximized: false,
                  minimized: false,
                }
              }))
            })
          })
        }}
      />
    )
  }

  const MouseOptionOpenWIthCodeEditor = () => {
    return (
      <MouseOption
        title='Open with Code Editor'
        disabled={states.File.selectedFiles.length !== 1}
        onClick={() => {
          states.File.selectedFiles.forEach((file) => {
            const content = fs?.readFile(file, 'utf-8', (err, data) => {
              dispatch(WindowAddTab({
                title: 'Code Editor',
                tab: {
                  title: 'Code Editor',
                  ficTitle: getLastPathSegment(file),
                  uuid: uuid(6),
                  value: file,
                  maximized: false,
                  minimized: false,
                }
              }))
            })
          })
        }}
        className='i-mdi-vs-code'
      />
    )
  }

  const MouseOptionOpenWithNotePad = () => {
    return (
      <MouseOption
        title='Open with Notepad'
        disabled={states.File.selectedFiles.length !== 1}
        onClick={() => {
          states.File.selectedFiles.forEach((file) => {
            const content = fs?.readFile(file, 'utf-8', (err, data) => {
              dispatch(WindowAddTab({
                title: 'Notepad',
                tab: {
                  title: 'Notepad',
                  ficTitle: getLastPathSegment(file),
                  uuid: uuid(6),
                  value: file,
                  maximized: false,
                  minimized: false,
                }
              }))
            })
          })
        }}
        className='i-mdi-note-text'
      />
    )
  }

  const MouseOptionOpenWithRichTextEditor = () => {
    return (
      <MouseOption
        title='Open as Document'
        disabled={states.File.selectedFiles.length !== 1}
        onClick={() => {
          states.File.selectedFiles.forEach((file) => {
            const content = fs?.readFile(file, 'utf-8', (err, data) => {
              dispatch(WindowAddTab({
                title: 'Rich Text Editor',
                tab: {
                  title: 'Rich Text Editor',
                  ficTitle: getLastPathSegment(file),
                  uuid: uuid(6),
                  value: file,
                  maximized: false,
                  minimized: false,
                }
              }))
            })
          })
        }}
        className='i-mdi-format-color-text'
      />
    )
  }

  const MouseOptionOpenWith = () => {
    const [isOptionsOpen, setIsOptionsOpen] = React.useState(false)

    return (
      <>
        <MouseOption
          title='Open with'
          disabled={states.File.selectedFiles.length !== 1 || verifyIfIsFile(states.File.selectedFiles[0]) === false}
          onMouseEnter={() => {
            if(states.File.selectedFiles.length !== 1 || verifyIfIsFile(states.File.selectedFiles[0]) === false) return
            setIsOptionsOpen(true)
          }}
          onMouseLeave={() => {
            if(states.File.selectedFiles.length !== 1 || verifyIfIsFile(states.File.selectedFiles[0]) === false) return
            setIsOptionsOpen(false)

          }}
          className='i-mdi-open-in-app'
          left={<span className='i-mdi-chevron-right text-lg'></span>}
        />
        {
          isOptionsOpen && (
            <div
              onMouseOver={() => {
                setIsOptionsOpen(true)
              }}
              onMouseLeave={() => {
                setIsOptionsOpen(false)
              }}
              className={`
              bg-gray-300 
                backdrop-filter backdrop-blur-sm shadow-md
                flex flex-col w-44 z-40  
                bg-opacity-30 rounded-r-md
                p-1
            `}
              style={{
                position: 'absolute',
                left: 176,
                top: 48,
                zIndex: 100,
              }}
            >
              <MouseOptionOpenInBrowser />
              <MouseOptionOpenWIthCodeEditor />
              <MouseOptionOpenWithRichTextEditor />
              <MouseOptionOpenWithNotePad />
            </div>
          )
        }
      </>
    )
  }

  const MouseOptionCompressFile = () => {

    const zip = new jszip()
    const [ended, setEnded] = React.useState(false)

    return (
      <MouseOption
        title='Zip Files'
        disabled={states.File.selectedFiles.some((path) => verifyIfIsFile(path) === false)}
        onClick={() => {
          states.File.selectedFiles.forEach((path,index) => {
            if(verifyIfIsFile(path) === false) return;
            fs?.readFile(path, 'utf-8', (err, data) => {
              if(err) console.log(err)
              if(!data) return;
              zip.file(getLastPathSegment(path), data, {base64: true})
              if(index === states.File.selectedFiles.length - 1){
                zip.generateAsync({type: 'base64'}).then((content) => {
                  fs?.writeFile(`${removeExtension(states.File.selectedFiles[0])}.zip`,content, (err) => {
                    if(err) console.log(err)
                    console.log('compressed')
                  })
                })
              }
            })
          })
          
        }}
        className='i-mdi-folder-zip'
      />
    )
  }

  return (
    <div
      className={`
      bg-gray-300 
        backdrop-filter backdrop-blur-sm shadow-md
        flex flex-col w-44 z-40  
        bg-opacity-30 rounded-md
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
      <MouseOptionOpenWith />
      <MouseOptionNewFile />
      <MouseOptionNewFolder />
      <MouseOptionRename />
      <MouseOptionCompressFile />
      <MouseOptionDownload />
      <MouseOptionDelete />
      <MouseOptionRefresh />

      {/* <MouseOptionCopy /> */}
    </div>
  )
}

export default MouseMenuContext