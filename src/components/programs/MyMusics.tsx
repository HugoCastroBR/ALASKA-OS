import useSettings from '@/hooks/useSettings'
import React, { useEffect } from 'react'
import CustomText from '../atoms/CustomText'
import { Button, Input, Progress, SimpleGrid, Slider, Text, TextInput } from '@mantine/core'
import { Dropzone } from '@mantine/dropzone'
import { truncateText } from '@/utils/text'
import { MusicItemProps } from '@/types/musics'
import useFS from '@/hooks/useFS'
import { addTypeToBase64, audioToBase64, getExtension, getExtensionFromBase64, imageToBase64, removeTypeFromBase64, uuid, verifyIfExtensionIsAudio } from '@/utils/file'
import { ApiError } from 'next/dist/server/api-utils'
import Image from 'next/image'
import { secondsToMinutes } from '@/utils/date'

const MyMusics = () => {

  const { settings } = useSettings()
  const {fs} = useFS()

  const [systemDefaultBackgroundColor, setSystemDefaultBackgroundColor] = React.useState(settings?.system?.systemBackgroundColor || 'rgba(0, 0, 0, 0.2)')
  const [defaultSystemTextColor, setDefaultSystemTextColor] = React.useState(settings?.system?.systemTextColor || 'rgba(0, 0, 0, 1)')

  useEffect(() => {
    if(settings?.system?.systemBackgroundColor === systemDefaultBackgroundColor) return
    setSystemDefaultBackgroundColor(settings?.system?.systemBackgroundColor || 'rgba(0, 0, 0, 0.2)')
  }, [settings?.system?.systemBackgroundColor])

  useEffect(() => {
    if(settings?.system?.systemTextColor === defaultSystemTextColor) return
    setDefaultSystemTextColor(settings?.system?.systemTextColor || 'rgba(0, 0, 0, 1)')
    
  }, [settings?.system?.systemTextColor])

  const [isUploadOpen, setIsUploadOpen] = React.useState(true)
  const [uploadMusicText, setUploadMusicText] = React.useState('Music')
  const [uploadImageText, setUploadImageText] = React.useState('Image')
  const [inputMusicTitle, setInputMusicTitle] = React.useState('')
  const [inputMusicArtist, setInputMusicArtist] = React.useState('')
  const [musicToUpload, setMusicToUpload] = React.useState<File | null>(null)
  const [imageToUpload, setImageToUpload] = React.useState<File | null>(null)
  const [musics, setMusics] = React.useState<MusicItemProps[]>([])
  const [musicSelected, setMusicSelected] = React.useState<MusicItemProps | null>(null)
  const [isMusicPlaying, setIsMusicPlaying] = React.useState(false)
  const [isMusicPaused, setIsMusicPaused] = React.useState(true)
  const [musicDuration, setMusicDuration] = React.useState(0)
  const [musicCurrentTime, setMusicCurrentTime] = React.useState(0)
  const [musicProgress, setMusicProgress] = React.useState(0)
  const [musicVolume, setMusicVolume] = React.useState(1)
  const [currentMusicIndex, setCurrentMusicIndex] = React.useState(0)

  const [audioElement, setAudioElement] = React.useState<HTMLAudioElement | null>(null)
  

  type MusicItemPropsPlus = MusicItemProps & {
    index: number
  }
  const MusicItem = ({
    name,
    artist,
    image,
    music,
    index,
  }:MusicItemPropsPlus) => {
    return (
      <div className='w-full h-20  flex justify-center items-center cursor-pointer'
        style={{
          backgroundColor: systemDefaultBackgroundColor,
        }}
        onClick={() => {
          setCurrentMusicIndex(index)
          handlerPlayMusic({
            name,
            artist,
            image,
            music,
          })
        }}
      >
        <div className='w-20 h-20 flex justify-center items-center bg-blue-200' >
          <Image
            src={image || '/assets/icons/Alaska.png'}      
            width={80}
            height={80}
            alt='Music Image'
          />
        </div>
        <div className='w-[calc(100%-80px)] flex flex-col h-16 ml-1'>
          <CustomText
            text={name}
            className='text-sm'
          />
          <CustomText
            text={artist}
            className='text-xs'
          />
        </div>
      </div>
    )
  }
  
  useEffect(() => {
    LoadMusics()
  },[fs])


  const handleTogglePause = () => {
    if(audioElement){
      if(!isMusicPaused){
        audioElement.pause()
        setIsMusicPaused(true)
      }else{
        audioElement.play()
        setIsMusicPaused(false)
      }
    }
  }


  const handlerPlayMusic = (music:MusicItemProps) => {
    if(audioElement){
      audioElement.pause()
    }
    setMusicSelected(music)
    setAudioElement(new Audio(music.music))

    setAudioElement((audio) => {
      
      audio?.addEventListener('loadeddata', (e) => {
        setMusicDuration(audio?.duration || 0)
        setIsMusicPlaying(true)
        setIsMusicPaused(false)
        audio?.play()
      })
      audio?.addEventListener('timeupdate', (e) => {
        setMusicCurrentTime(audio?.currentTime || 0)
        setMusicProgress((audio?.currentTime || 0) / (audio?.duration || 0) * 100)
      })
      audio?.addEventListener('ended', (e) => {
        setIsMusicPlaying(false)
        setIsMusicPaused(true)
        setMusicDuration(0)
        setMusicCurrentTime(0)
        handleNextMusic()
      })
      audio?.addEventListener('error', (e) => {
        console.log(e)
      })
      return audio
    })
  }

  const AppendToMusics = (music: MusicItemProps) => {
    setMusics((prevMusics) => {
      // Verificar se a música já existe na lista
      if (prevMusics.some((existingMusic) => existingMusic.name === music.name)) {
        console.log("A música já existe na lista. Não será adicionada novamente.");
        return prevMusics;
      }
  
      // Se a música não existe, adicioná-la à lista
      const newMusics = [...prevMusics, music];
      console.log(newMusics);
      return newMusics;
    });
  };

  const handleNextMusic = () => {
    setAudioElement((audio) => {
      if(audio){
        audio.pause()
      }
      return audio
    })

    if(currentMusicIndex === musics.length - 1){
      setCurrentMusicIndex(0)
      handlerPlayMusic(musics[0])
    }else{
      setCurrentMusicIndex(currentMusicIndex + 1)
      handlerPlayMusic(musics[currentMusicIndex + 1])
    }
    
  }

  const handlePreviousMusic = () => {
    setAudioElement((audio) => {
      if(audio){
        audio.currentTime = 0
        audio.pause()
      }
      return audio
    })

    if(currentMusicIndex === 0){
      setCurrentMusicIndex(musics.length - 1)
      handlerPlayMusic(musics[musics.length - 1])
    }else{
      setCurrentMusicIndex(currentMusicIndex - 1)
      handlerPlayMusic(musics[currentMusicIndex - 1])
    }
  }

  const LoadMusics = async () => {
    const FolderName = '/ProgramFiles/myMusics'
    fs?.readdir(FolderName,(err,folders) => {
      if(err){
        console.log(err)
      }else{
        folders?.forEach((folder) => {
          const music:MusicItemProps = {
            name: '',
            artist: '',
            image: '',
            music: '',
          }
          fs?.readdir(`${FolderName}/${folder}`,(err,files) => {
            files?.forEach((file) => {
              if(getExtension(file) === 'json'){
                fs?.readFile(`${FolderName}/${folder}/${file}`,(err,jsonBuffer) => {
                  if(err){
                    console.log(err)
                  }else{
                    if(jsonBuffer){
                      const jsonData = Buffer.from(jsonBuffer).toString()
                      music.artist = JSON.parse(jsonData).artist
                      music.name = JSON.parse(jsonData).name
                    }
                    
                  }
                })
              }else{
                fs?.readFile(`${FolderName}/${folder}/${file}`,'utf-8',(err,data) => {
                  if(err){
                    console.log(err)
                  }else{
                    if(data){
                      if(verifyIfExtensionIsAudio(getExtension(file))){
                        music.music = addTypeToBase64(getExtension(file),data)
                      }else{
                        music.image = addTypeToBase64(getExtension(file),data)
                      }
                      AppendToMusics(music)
                    }
                  }
                })
              }
            })
          })
        })
      }
    })
  }

  useEffect(() => {
    setAudioElement((audio) => {
      if(audio){
        audio.volume = musicVolume
      }
      return audio
    })
  },[musicVolume])

  const handlerUploadMusic = async ({
    name,
    artist,
    image,
  }:MusicItemProps) => {
    const musicToUploadProps:MusicItemProps = {
      name,
      artist,
      image,
    }
    if(name === ''){
      musicToUploadProps.name = 'Unknown Music'
    }
    if(artist === ''){
      musicToUploadProps.artist = 'Unknown Artist'
    }

    if(musicToUpload !== null){
      let image64 = ''
      const music64 = await audioToBase64(musicToUpload) as string
      if(imageToUpload !== null){
        image64 = await imageToBase64(imageToUpload) as string
      }
      const ObjectToUpload = {
        ...musicToUploadProps,
        music: music64,
        image: image64,
      }

      const FolderName = `/ProgramFiles/myMusics/${uuid(8)}`
      fs?.mkdir(FolderName,(err:ApiError) => {
        if(err){
          console.log(err)
        }else{
          if(image64 !== ''){
            fs?.writeFile(`${FolderName}/image.${getExtension(imageToUpload?.name || '.png')}`,removeTypeFromBase64(image64),(err) => {
              if(err){
                console.log(err)
              }else{
                console.log('Image Uploaded')
              }
            })
          }
          if(music64 !== ''){
            fs?.writeFile(`${FolderName}/music.${getExtension(musicToUpload.name)}`,removeTypeFromBase64(music64),(err) => {
              if(err){
                console.log(err)
              }else{
                console.log('Music Uploaded')
              }
            })
          }
          fs?.writeFile(`${FolderName}/music.json`,JSON.stringify({
            name: name,
            artist: artist,
          }),(err) => {
            if(err){
              console.log(err)
            }else{
              console.log('Music Uploaded')
            }
          }
        )}
      })
      console.log(ObjectToUpload)
    }
  }



  const ListHeader = () => {
    return (
      <div className='sticky w-full py-1 flex flex-col
        transition-all duration-300 ease-in-out
      '
        style={{
          backgroundColor: systemDefaultBackgroundColor,
          height: isUploadOpen ? '176px' : '70px',
        }}
      >
        <div className=' w-full  items-center justify-center
          transition-all duration-300 ease-in-out
        '
          style={{
            height: isUploadOpen ? '60%' : '0%',
            display: isUploadOpen ? 'flex' : 'none',
            borderBottom: '1px solid',
            borderColor: defaultSystemTextColor,
          }}
        >
          <Dropzone
          className='h-24 w-24 rounded flex flex-col items-center justify-center mx-1 mb-1
          border border-dashed border-gray-500 bg-slate-300 bg-opacity-40 cursor-pointer hover:bg-opacity-60 transition-all duration-300 ease-in-out'
          onDrop={(files) => {  
            const musicToUpload = files[0]
            setUploadMusicText(musicToUpload.name)
            setMusicToUpload(musicToUpload)
            if(inputMusicTitle === ''){
              setInputMusicTitle(musicToUpload.name)
            }
          }}
          multiple={false}
          accept={['audio/*']}
          >
            <span className='i-mdi-upload text-lg -mb-1'
              style={{
                color: defaultSystemTextColor
              }}
            />
            <CustomText
              text={truncateText(uploadMusicText, 6)}
              className='text-xs mr-1'
              style={{
                color: defaultSystemTextColor
              }}
            />
          </Dropzone>
          <Dropzone className='h-24 w-24 rounded  flex flex-col items-center justify-center mx-1 mb-1
          border border-dashed border-gray-500 bg-slate-300 bg-opacity-40 cursor-pointer hover:bg-opacity-60 transition-all duration-300 ease-in-out'
          onDrop={(files) => {
            const imageToUpload = files[0]
            setUploadImageText(imageToUpload.name)
            setImageToUpload(imageToUpload)
          }}
          multiple={false}
          accept={['image/*']}
          >
            <span className='i-mdi-upload text-lg -mb-1'
              style={{
                color: defaultSystemTextColor
              }}
            />
            <CustomText
              text={truncateText(uploadImageText, 6)}
              className='text-xs mr-1'
              style={{
                color: defaultSystemTextColor
              }}
            />
          </Dropzone>
          <div className='h-24  flex  items-center justify-evenly px-1'>
            <TextInput
              label='Music Name: '
              placeholder='Music Name'
              className='w-5/12 mx-1'
              defaultValue={inputMusicTitle}
              onBlur={(event) => {
                setInputMusicTitle(event.currentTarget.value)
              }}
              style={{
                color: defaultSystemTextColor,
                borderColor: defaultSystemTextColor,
              }}
            />
            <TextInput
              label='Artist Name: '
              placeholder='Artist Name'
              className='w-5/12 mx-1'
              defaultValue={inputMusicArtist}
              onBlur={(event) => {
                setInputMusicArtist(event.currentTarget.value)
              }}
              style={{
                color: defaultSystemTextColor,
                borderColor: defaultSystemTextColor,
              }}
            />
            <Button
              className='w-2/12 mx-1 mt-6'
              style={{
                backgroundColor: 'transparent',
                color: defaultSystemTextColor,
                border: '1px solid',
                borderColor: defaultSystemTextColor,
              }}
              onClick={() => {
                handlerUploadMusic({
                  name: inputMusicTitle,
                  artist: inputMusicArtist,
                  image: uploadImageText,
                })
              }}
            >
              Save
            </Button>
          </div>
        </div>
        <div className='w-full flex justify-start items-center
        transition-all duration-300 ease-in-out
        '
          style={{
            height: isUploadOpen ? '40%' : '100%',
          }}
        >

          <Button
            className='w-2/12 mx-1 mt-5 ml-2'
            style={{
              backgroundColor: 'transparent',
              color: defaultSystemTextColor,
              border: '1px solid',
              borderColor: defaultSystemTextColor,
            }}
            onClick={() => {
              setIsUploadOpen(!isUploadOpen)
            }}
          >
            <CustomText
              text='New Music'
              className='text-xs'
              style={{
                color: defaultSystemTextColor
              }}
            />
          </Button>
          <TextInput
            label='Search: '
            placeholder='Search'
            className='w-4/12 mx-1 mb-1 ml-6'
            style={{
              color: defaultSystemTextColor,
              borderColor: defaultSystemTextColor,
            }}
          />

        </div>
      </div>
    )
  }

  return (
    <div
      className='absolute w-1/2 h-1/2 top-1/4 left-1/4
      flex flex-col  overflow-hidden
      rounded-lg '
      style={{
        backgroundColor: systemDefaultBackgroundColor
      }}
    >
      <div className='flex flex-col w-full h-full'>
        <ListHeader />
        <div className='w-full flex flex-col h-full overflow-y-auto py-2 px-2 '>
          <SimpleGrid
            cols={2}
            verticalSpacing={6}
            spacing={6}
          >
            {musics.map((music,index) => <MusicItem index={index} key={index} {...music}/>)}
          </SimpleGrid>
        </div>
        <div className='sticky  w-full h-32 flex justify-center items-center'
          style={{
            backgroundColor: systemDefaultBackgroundColor,
          }}
        >
          <div className='h-20 w-3/12 flex justify-center items-start py-2 mx-1 '
          >
            <div className='w-16 h-16 flex justify-center items-center bg-blue-200' >
              {
                musicSelected?.image ?
                  <Image
                    src={musicSelected?.image || '/assets/icons/Alaska.png'}
                    width={80}
                    height={80}
                    alt='Music Image'
                  />
                  :
                  <span className='i-mdi-music-note text-4xl'
                    style={{
                      color: defaultSystemTextColor
                    }}
                  />
              }
            </div>
            <div className='w-[calc(100%-64px)] flex flex-col h-16 ml-1'>
              <CustomText
                text={truncateText(musicSelected?.name || '', 16) || 'Unknown Music'}
                className='text-sm'
              />
              <CustomText
                text={truncateText(musicSelected?.artist || '',12) || 'Unknown Artist'}
                className='text-xs'
              />
            </div>
          </div>
          <div className='h-full w-6/12  flex flex-col justify-center items-center mx-1 '>
            <div className=' w-full flex h-2/3 justify-center items-center'>
              <span
                className='i-mdi-skip-previous text-4xl mx-1 cursor-pointer
              hover:bg-slate-500 transition-all duration-300 ease-in-out'
                onClick={handlePreviousMusic}
                style={{
                  color: defaultSystemTextColor
                }}
              />
              <div className='
              bg-black mx-1 h-8 w-8 flex justify-center items-center rounded-full
              cursor-pointer hover:bg-slate-500 transition-all duration-300 ease-in-out
              '
                onClick={handleTogglePause}
              >
                {!isMusicPaused ?
                  <span className='i-mdi-pause text-2xl text-white cursor-pointer' />
                  :
                  <span className='i-mdi-play text-2xl text-white cursor-pointer' />
                }
              </div>
              <span
                className='i-mdi-skip-next text-4xl mx-1 cursor-pointer
              hover:bg-slate-500 transition-all duration-300 ease-in-out
              '
                onClick={handleNextMusic}
                style={{
                  color: defaultSystemTextColor
                }}
              />
            </div>
            <div className='w-full h-1/3 flex justify-evenly items-center'>
              <CustomText
                text={secondsToMinutes(musicCurrentTime)}
                className='text-xs'
              />
              <Progress
                color='blue'
                value={musicProgress}
                w={"80%"}
                h={6}
                radius={6}
                style={{
                  width: '50%',
                  height: '50%',
                }}
              />
              <CustomText
                text={secondsToMinutes(musicDuration)}
                className='text-xs'
              />

            </div>
          </div>
          <div className='h-full w-3/12 flex justify-center items-center mx-1 '>
            <div className='w-1/6 h-full flex justify-center items-center'>
              <span className='i-mdi-volume-high text-2xl cursor-pointer'
                style={{
                  color: defaultSystemTextColor
                }}
              />
            </div>
            <div className='w-5/6 h-full flex justify-center items-center pl-1'>
              <Slider
                h={6}
                w={'100%'}
                color={defaultSystemTextColor}
                value={Number((musicVolume * 100).toFixed(0))}
                onChange={(value) => {
                  setMusicVolume(value / 100)
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyMusics