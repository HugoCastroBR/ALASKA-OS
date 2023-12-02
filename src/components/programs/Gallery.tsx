import useStore from '@/hooks/useStore'
import useFS from '@/hooks/useFS'
import React, { useEffect } from 'react'
import CustomText from '../atoms/CustomText'
import { SimpleGrid } from '@mantine/core'
import { Dropzone } from '@mantine/dropzone'
import { ApiError } from 'browserfs/dist/node/core/api_error'
import { addTypeToBase64, convertSizeToKBMBGB, getExtension, getSizeFromBase64, imageToBase64, removeExtension, removeTypeFromBase64 } from '@/utils/file'
import { GalleryItemProps, PictureProps, programProps } from '@/types/programs'
import Image from 'next/image'
import { truncateText } from '@/utils/text'
import DefaultWindow from '../containers/DefaultWindow'

const Gallery = ({
  AlaskaWindow,
  tab,
}:programProps) => {


  const { states, dispatch } = useStore()
  const { fs } = useFS()

  const [pictures, setPictures] = React.useState<PictureProps[]>([])
  const [currentPicture, setCurrentPicture] = React.useState<number | null>(null)
  const [isAutoPlay, setIsAutoPlay] = React.useState(false)
  const [currentPictureName, setCurrentPictureName] = React.useState('Untitled')
  const [currentPictureSize, setCurrentPictureSize] = React.useState('512kb')


  const handlerUploadPictures = (pictures: File[]) => {
    if (!fs) return
    fs.readdir('/ProgramFiles/myPictures', (err, files) => {
      if (err) {
        if (err.errno == 2) {
          fs.mkdir('/ProgramFiles/myPictures', (err: ApiError) => {
            if (err) {
              console.log(err)
              return
            }
            console.log('Created myPictures folder')
            pictures.forEach(async (picture: File) => {
              const picture64 = await imageToBase64(picture) as string
              const picture64WithoutType = removeTypeFromBase64(picture64)
              fs.writeFile(`/ProgramFiles/myPictures/${picture.name}`, picture64WithoutType, (err) => {
                if (err) {
                  console.log(err)
                  return
                }
                console.log(`Created ${picture.name} file`)
                LoadPictures()
              })
            })
          })
        } else {
          console.log(err)
          return
        }
      }
      else {
        pictures.forEach(async (picture: File) => {
          const picture64 = await imageToBase64(picture) as string
          const picture64WithoutType = removeTypeFromBase64(picture64)
          fs.writeFile(`/ProgramFiles/myPictures/${picture.name}`, picture64WithoutType, (err) => {
            if (err) {
              console.log(err)
              return
            }
            console.log(`Created ${picture.name} file`)
            LoadPictures()
          })
        })
      }
    })
  }

  const AppendToPictures = (pic: PictureProps) => {
    setPictures((prevPictures) => {
      if (prevPictures.some(existingPicture => existingPicture.name === pic.name)) {
        return prevPictures;
      } else {
        return [...prevPictures, pic];
      }
    });
  };

  const LoadPictures = () => {
    if (!fs) return
    fs.readdir('/ProgramFiles/myPictures', (err, files) => {
      if (err) {
        console.log(err)
        return
      }
      if (files?.length == 0) return
      files?.forEach((file: string) => {
        fs.readFile(`/ProgramFiles/myPictures/${file}`, 'utf-8', (err, data) => {
          if (err) {
            console.log(err)
            return
          }
          if (!data) return
          AppendToPictures({
            name: removeExtension(file),
            image64: data,
          })
        })
      })
    })
  }



  useEffect(() => {
    LoadPictures()
  }, [fs])


  const handlerNextPicture = () => {
    if (currentPicture == null) return
    if (currentPicture == pictures.length - 1) {
      setCurrentPicture(0)
      setCurrentPictureName(pictures[0].name)
      setCurrentPictureSize(convertSizeToKBMBGB(getSizeFromBase64(pictures[0].image64)))
      return
    }
    setCurrentPicture(currentPicture + 1)
    setCurrentPictureName(pictures[currentPicture + 1].name)
    setCurrentPictureSize(convertSizeToKBMBGB(getSizeFromBase64(pictures[currentPicture + 1].image64)))
  }

  const handlerPreviousPicture = () => {
    if (currentPicture == null) return
    if (currentPicture == 0) {
      setCurrentPicture(pictures.length - 1)
      setCurrentPictureName(pictures[pictures.length - 1].name)
      setCurrentPictureSize(convertSizeToKBMBGB(getSizeFromBase64(pictures[pictures.length - 1].image64)))
      return
    }
    setCurrentPicture(currentPicture - 1)
    setCurrentPictureName(pictures[currentPicture - 1].name)
    setCurrentPictureSize(convertSizeToKBMBGB(getSizeFromBase64(pictures[currentPicture - 1].image64)))
  }

  const handlerAutoPlay = () => {
    setIsAutoPlay(!isAutoPlay)
  }



  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;

    if (isAutoPlay) {
      intervalId = setInterval(() => {
        handlerNextPicture();
      }, 2000);
    } else {
      if (intervalId !== undefined) {
        clearInterval(intervalId);
      }
    }

    return () => {
      if (intervalId !== undefined) {
        clearInterval(intervalId);
      }
    };
  }, [isAutoPlay, handlerNextPicture]);



  const AlbumItem = ({
    name,
    image64,
    index
  }: GalleryItemProps) => {
    return (
      <div
        className='h-40 w-32 flex flex-col justify-center items-center cursor-pointer'
        onClick={() => {
          setCurrentPicture(index)
          setCurrentPictureName(name)
          setCurrentPictureSize(convertSizeToKBMBGB(getSizeFromBase64(image64)))
        }}
        style={{
          backgroundColor: states.Settings?.settings.system.systemBackgroundColor || 'rgba(0,0,0,0.2)'
        }}
      >
        <div className=' h-32 w-32 flex justify-center items-center'>
          <Image
            alt={name}
            src={addTypeToBase64(getExtension(name), image64)}
            width={128}
            height={128}
          />
        </div>
        <div
          className='h-8 w-full flex justify-center items-center p-px'
          style={{
            backgroundColor: states.Settings?.settings.system.systemBackgroundColor || 'rgba(0,0,0,0.2)'
          }}
        >
          <CustomText
            text={truncateText(name, 12)}
            className='text-xs font-medium'
            style={{
              color: states.Settings?.settings.system.systemTextColor || 'rgba(0,0,0,1)'
            }}
          />
        </div>
      </div>
    )
  }



  const AddAlbumItem = () => {
    return (
      <Dropzone
        onDrop={handlerUploadPictures}
        accept={['image/*']}
        className='h-40 w-32 bg-gray-400 flex flex-col justify-center items-center
        hover:bg-gray-500 transition-all duration-300 ease-in-out cursor-pointer
        '>
        <div className='h-40 w-32 flex flex-col justify-center items-center'>
          <span
            className='i-mdi-image-plus text-4xl mx-1'
            onClick={() => { }}
            style={{
              color: states.Settings?.settings.system.systemTextColor || 'rgba(0,0,0,1)'
            }}
          />
          <CustomText
            text='Add Picture'
            className='text-xs font-medium'
            style={{
              color: states.Settings?.settings.system.systemTextColor || 'rgba(0,0,0,1)'
            }}
          />

        </div>
      </Dropzone>
    )
  }



  return (
    <DefaultWindow
      currentTab={tab}
      currentWindow={AlaskaWindow}
      title='Gallery'
      uuid={tab.uuid}
      onMinimize={() => { }}
      onMaximize={() => { }}
      onClose={() => { }}
      resizable
    >
      <div className='h-full w-full  flex flex-col justify-center items-center p-1'
        style={{
          backgroundColor: states.Settings?.settings.system.systemBackgroundColor || 'rgba(0,0,0,0.2)'
        }}
      >
        <div className='w-full h-[calc(100%-64px)] flex justify-center overflow-y-auto p-1'>
          {
            currentPicture !== null ?
              <div
                className='absolute h-[calc(100%-64px)] top-0 w-full'
                style={{
                  backgroundColor: states.Settings?.settings.system.systemBackgroundColor || 'rgba(0,0,0,0.2)'
                }}
                onDoubleClick={() => {
                  setCurrentPicture(null)
                }}
              >
                <Image
                  alt={pictures[currentPicture]?.name || 'Untitled'}
                  src={addTypeToBase64(getExtension(pictures[currentPicture].name), pictures[currentPicture].image64) || '/assets/icons/Alaska.png'}
                  fill
                  objectFit='contain'
                />
              </div>
              :
              <SimpleGrid
                cols={4}
                verticalSpacing={6}
                spacing={6}
              >
                <AddAlbumItem />
                {
                  pictures.map((props, index) => {
                    return (
                      <AlbumItem key={index} index={index} {...props} />
                    )
                  })
                }
              </SimpleGrid>
          }

        </div>
        <div className=' flex w-full h-16'>
          {currentPicture !== null &&
            <>
              <div className='w-1/5 h-full flex flex-col p-1 mx-1 justify-center'>
                <div className=' w-full h-1/2 justify-center items-center' >
                  <CustomText
                    text={truncateText(currentPictureName, 16)}
                    className='text-sm font-medium'
                    style={{
                      color: states.Settings?.settings.system.systemTextColor || 'rgba(0,0,0,1)'
                    }}
                  />
                </div>
                <div className='w-full h-1/2 justify-center items-center' >
                  <CustomText
                    text={currentPictureSize}
                    className='text-xs font-medium'
                    style={{
                      color: states.Settings?.settings.system.systemTextColor || 'rgba(0,0,0,1)'
                    }}
                  />
                </div>
              </div>
              <div className='w-3/5 h-full p-1 mx-1 flex justify-center items-center'>
                <span
                  className='i-mdi-skip-previous text-5xl mx-1 cursor-pointer
              hover:bg-slate-500 transition-all duration-300 ease-in-out'
                  onClick={handlerPreviousPicture}
                  style={{
                    color: states.Settings?.settings.system.systemTextColor || 'rgba(0,0,0,1)'
                  }}
                />
                <span
                  className='i-mdi-skip-next text-5xl mx-1 cursor-pointer
              hover:bg-slate-500 transition-all duration-300 ease-in-out'
                  onClick={handlerNextPicture}
                  style={{
                    color: states.Settings?.settings.system.systemTextColor || 'rgba(0,0,0,1)'
                  }}
                />
              </div>
              <div className='w-1/5 h-full  flex p-1 mx-1 '>
                <div className='w-1/2 h-full flex justify-center items-center'>
                  {
                    isAutoPlay ?
                      <span
                        className='i-mdi-pause text-2xl mx-1 cursor-pointer
                      hover:bg-slate-500 transition-all duration-300 ease-in-out'
                        onClick={handlerAutoPlay}
                        style={{
                          color: states.Settings?.settings.system.systemTextColor || 'rgba(0,0,0,1)'
                        }}
                      />
                      :
                      <span
                        className='i-mdi-play text-2xl mx-1 cursor-pointer
                      hover:bg-slate-500 transition-all duration-300 ease-in-out'
                        onClick={handlerAutoPlay}
                        style={{
                          color: states.Settings?.settings.system.systemTextColor || 'rgba(0,0,0,1)'
                        }}
                      />
                  }
                </div>
              </div>
            </>
          }
        </div>
      </div>
    </DefaultWindow>
  )
}

export default Gallery