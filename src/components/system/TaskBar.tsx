'use client'

import React, { useEffect, useState } from 'react'
import StartMenu from './StartMenu'
import Image from 'next/image'
import useStore from '@/hooks/useStore'
import { WeatherProps, programProps } from '@/types/programs'
import { PutTabInFirstPlan, SetGlobalVolumeMultiplier, WindowAddTab, WindowRemoveTab, WindowSetTabFocused, WindowToggleMinimizeTab } from '@/store/actions'
import Clock from '../molecules/Clock'
import { truncateText } from '@/utils/text'
import CustomText from '../atoms/CustomText'
import { Menu, Slider, Tooltip } from '@mantine/core'
import { getWeather } from '@/api/weatherApi'
import { uuid } from '@/utils/file'
import { useNetwork } from '@mantine/hooks'



const TaskBarItem = ({
  tab,
  AlaskaWindow,
}: programProps) => {

  const { states, dispatch } = useStore()
  const [isHoveringClose, setIsHoveringClose] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  return (
    <div
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={() => {
        dispatch(WindowToggleMinimizeTab({
          title: AlaskaWindow.title,
          uuid: tab.uuid,
        }))
        dispatch(WindowSetTabFocused({
          title: AlaskaWindow.title,
          uuid: tab.uuid,
        }))
      }}
      className={`
      flex items-center w-40  h-10
      backdrop-filter backdrop-blur-sm
      justify-between px-2 mx-px cursor-pointer
      transition-all duration-100 ease-in-out
      ${(tab.focused && !tab.minimized) ? 'border-b-4 ' : ''}
      `}
      style={{
        backgroundColor: states.Settings.settings.taskbar.items.backgroundColor || 'transparent',
        color: states.Settings.settings.taskbar.items.color || 'white',
        borderColor: states.Settings.settings.system.systemHighlightColor || 'transparent',
      }}
    >

      <Image
        src={AlaskaWindow.icon || '/assets/icons/Alaska.png'}
        alt={tab.ficTitle || tab.title}
        width={20}
        height={20}
      />
      <CustomText
        text={truncateText(tab.ficTitle || tab.title, 12)}
        className='text-xs'
        style={{
          color: states.Settings.settings.taskbar.items.color || 'white',
          marginLeft: 16,
        }}
      />
      <Tooltip label='Close'>
        <div
          onClick={(e) => {
            e.stopPropagation()
            dispatch(WindowRemoveTab({
              title: AlaskaWindow.title,
              uuid: tab.uuid,
            }))
          }}
          onMouseEnter={() => setIsHoveringClose(true)}
          onMouseLeave={() => setIsHoveringClose(false)}
          className='h-4 bg-transparent flex justify-center items-center
        rounded-sm  transition-all duration-300 ease-in-out overflow-hidden'
          style={{
            width: isHovering ? 16 : 0,
            backgroundColor: isHoveringClose ? states.Settings.settings.system.systemHighlightColor : 'transparent',
          }}
        >
          <span
            className='i-mdi-close text-lg'
          />
        </div>
      </Tooltip>
    </div>
  )
}



const TaskBar = () => {

  const { states, dispatch } = useStore()

  const networkStatus = useNetwork()

  const [globalVolume, setGlobalVolume] = React.useState(100)
  const [isVolumeOpen, setIsVolumeOpen] = React.useState(false)

  const handleRenderTabs = () => {
    return states.Windows.windows.map((window, index) => {
      return window.tabs.map((tab, index) => {
        if(!tab.secondPlan){
          return (
            <TaskBarItem
              key={index}
              tab={tab}
              AlaskaWindow={window}
            />
          )
        }
      })

    })
  }

  useEffect(() => {
    handlerChangeGlobalVolume(globalVolume)
  }, [globalVolume])

  const handlerChangeGlobalVolume = (value: number) => {
    dispatch(SetGlobalVolumeMultiplier(value / 100))
  }

  const [weatherData, setWeatherData] = useState<WeatherProps>({} as any)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        if (result.state === 'granted') {
          navigator.geolocation.getCurrentPosition((position) => {
            handlerGetWeather(position.coords.latitude, position.coords.longitude)

          })
        }
        else if (result.state === 'prompt') {
          navigator.geolocation.getCurrentPosition((position) => {
            handlerGetWeather(position.coords.latitude, position.coords.longitude)
          })
        }
        else if (result.state === 'denied') {
          console.log('Permission denied.')
        }
      })
    } else {
      console.log('Geolocation is not supported by this browser.')
    }
  }, [])

  const handlerGetWeather = (lat: number, lon: number) => {
    getWeather(lat, lon).then((data) => {
      setWeatherData(data)
    }).catch((err) => {
      console.log(err)
    })
  }


  const FooterBottom = () => {


    return (
      <footer
        className={` w-full h-10 bottom-0 
        backdrop-filter backdrop-blur-sm 
        border-t border-white border-opacity-20 flex justify-start items-center
        `}
        style={{
          backgroundColor: states.Settings.settings.taskbar.backgroundColor || 'transparent',
        }}
      >
        <div className={`absolute w-40 h-10  bottom-10 
        bg-white flex justify-evenly items-center rounded-md
        backdrop-filter backdrop-blur-sm shadow-sm bg-opacity-20
        transition-all duration-300 ease-in-out
        ${isVolumeOpen ? 'right-0' : '-right-40'}
        `}>
          <Slider
            defaultValue={Number(globalVolume.toFixed(0))}
            onChange={(value) => setGlobalVolume(value)}
            w={100}
          />
        </div>
        <div className='w-10/12 flex h-full justify-start items-center flex-wrap overflow-hidden'>
          <StartMenu />
          {handleRenderTabs()}
        </div>
        <div className='w-2/12 h-full flex justify-end items-center pr-4'>
          <div className='flex w-6 h-6 -mr-16 justify-center items-center
          hover:bg-white hover:bg-opacity-20 rounded transition-all duration-300 ease-in-out
          '>
            <Menu
              position='top-start'
              offset={10}
              transitionProps={{
                transition: 'pop',
                duration: 300
              }}
              styles={{
                dropdown: {
                  width: '128px',
                  minHeight: '64px',
                },
                item: {
                  padding: 'none',
                  margin: 'none',
                  cursor: 'default',
                }
              }}
            >
              <Menu.Target>
                <span className='i-mdi-chevron-up text-xl cursor-pointer '
                  style={{
                    color: states.Settings.settings.taskbar.items.color || 'white',
                  }}
                />
              </Menu.Target>
              <Menu.Dropdown
                bg={states.Settings.settings.system.systemBackgroundColor}
              >
                <Menu.Item
                  bg={'transparent'}
                  w={32}
                  h={32}
                  p={0}
                  m={1}
                >
                  <Tooltip
                    label='Music Library'
                  >
                    <span
                      className='i-mdi-music text-xl cursor-pointer m-px'
                      style={{
                        color: states.Settings.settings.taskbar.items.color || 'white',
                      }}
                      onClick={() => {
                        const verifyIfHasAMusicLibraryMinimized = () => {
                          const verify = states.Windows.windows.filter((window) => {
                            return window.title === 'Music Library' && window?.tabs[0]?.minimized
                          })
                          return verify.length > 0
                        }

                        const verifyIfHasAMusicLibraryInSecondPlan = () => {
                          const verify = states.Windows.windows.filter((window) => {
                            return window.title === 'Music Library' && !window?.tabs[0]?.secondPlan
                          })
                          return verify.length > 0
                        }

                        

                        if(verifyIfHasAMusicLibraryMinimized()){
                          dispatch(WindowToggleMinimizeTab({
                            title: 'Music Library',
                            uuid: states.Windows.windows.filter((window) => {
                              return window.title === 'Music Library'
                            })[0].tabs[0].uuid,
                          }))
                        }
                        else{
                          dispatch(WindowAddTab({
                            title: 'Music Library',
                            tab: {
                              title: 'Music Library',
                              uuid: uuid(6),
                              value: 'music-library',
                              maximized: false,
                              minimized: false,
                              focused: true,
                            }
                          }))
                        }
                      }}
                    />
                  </Tooltip>
                </Menu.Item>

              </Menu.Dropdown>
            </Menu>
          </div>
          <div className='flex w-full items-center justify-end -mr-5'>
            {weatherData?.main?.temp &&
              <div
                className='flex h-full justify-end items-center mr-2 cursor-pointer'
                onClick={() => {
                  dispatch(WindowAddTab({
                    title: 'Weather App',
                    tab: {
                      title: 'Weather App',
                      uuid: uuid(6),
                      value: 'https://www.google.com/search?q=weather',
                      maximized: false,
                      minimized: false,
                      focused: true,
                    }
                  }))
                }}
              >
                <CustomText
                  text={`${weatherData?.main?.temp.toFixed(0)}°C`}
                  className='text-xs ml-1'
                  style={{
                    color: states.Settings.settings.taskbar.items.color || 'white',
                  }}
                />
                <Image
                  src={`http://openweathermap.org/img/wn/${weatherData?.weather[0]?.icon}@2x.png`}
                  alt={weatherData?.weather[0]?.description}
                  width={36}
                  height={36}
                  className='mt-0.5 cursor-pointer'
                />
              </div>
            }
            <Menu
            position='top-start'
            offset={6}
            transitionProps={{
              transition: 'pop',
              duration: 300
            }}
            styles={{
              dropdown: {
                width: '146px',
                minHeight: '286px',
              },
              item: {
                padding: 'none',
                margin: 'none',
                cursor: 'default',
              }
            }}
            >
              <Menu.Target>
                <div>
                  {networkStatus.online ?
                  <span
                  className='i-mdi-wifi text-lg cursor-pointer mr-3 mt-2'
                  style={{
                    color: states.Settings.settings.taskbar.items.color || 'white',
                  }}
                />
                  :
                  <span
                  className='i-mdi-wifi-off text-lg cursor-pointer mr-3 mt-2'
                  style={{
                    color: states.Settings.settings.taskbar.items.color || 'white',
                  }}  
                  />
                  }
                </div>
              </Menu.Target>
              <Menu.Dropdown
                bg={states.Settings.settings.system.systemBackgroundColor}
              >
                <Menu.Item
                  bg={'transparent'}
                  w={136}
                  h={44}
                  p={0}
                  m={1}
                >
                  <div className='w-full h-full flex justify-start items-center'>
                    <CustomText
                      text={`Internet: ${networkStatus.online ? 'Online' : 'Offline'}`}
                      className='!text-sm ml-1'
                      style={{
                        color: states.Settings.settings.system.systemTextColor || 'white',
                      }}
                    />
                  </div>
                </Menu.Item>
                <Menu.Item
                  bg={'transparent'}
                  w={136}
                  h={44}
                  p={0}
                  m={1}
                >
                  <div className='w-full h-full flex justify-start items-center'>
                    <CustomText
                      text={`Ping: ${networkStatus.rtt?.toFixed(0) || 0}ms`}
                      className='!text-sm ml-1'
                      style={{
                        color: states.Settings.settings.system.systemTextColor || 'white',
                      }}
                    />
                  </div>
                </Menu.Item>
                <Menu.Item
                  bg={'transparent'}
                  w={136}
                  h={44}
                  p={0}
                  m={1}
                >
                  <div className='w-full h-full flex justify-start items-center'>
                    <CustomText
                      text={`Download: ${networkStatus.downlink?.toFixed(0) || 0} Mbps`}
                      className='!text-sm ml-1'
                      style={{
                        color: states.Settings.settings.system.systemTextColor || 'white',
                      }}
                    />
                  </div>
                </Menu.Item>
                <Menu.Item
                  bg={'transparent'}
                  w={136}
                  h={44}
                  p={0}
                  m={1}
                >
                  <div className='w-full h-full flex justify-start items-center'>
                    <CustomText
                      text={`Max: ${networkStatus.downlink?.toFixed(0) || 0} Mbps`}
                      className='!text-sm ml-1'
                      style={{
                        color: states.Settings.settings.system.systemTextColor || 'white',
                      }}
                    />
                  </div>
                </Menu.Item>
                <Menu.Item
                  bg={'transparent'}
                  w={136}
                  h={44}
                  p={0}
                  m={1}
                >
                  <div className='w-full h-full flex justify-start items-center'>
                    <CustomText
                      text={`Type: ${networkStatus.type || 'wifi'}`}
                      className='!text-sm ml-1'
                      style={{
                        color: states.Settings.settings.system.systemTextColor || 'white',
                      }}
                    />
                  </div>
                </Menu.Item>
                <Menu.Item
                  bg={'transparent'}
                  w={136}
                  h={44}
                  p={0}
                  m={1}
                >
                  <div className='w-full h-full flex justify-start items-center'>
                    <CustomText
                      text={`Connection: ${networkStatus.effectiveType}`}
                      className='!text-sm ml-1'
                      style={{
                        color: states.Settings.settings.system.systemTextColor || 'white',
                      }}
                    />
                  </div>
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
            <span
              className='i-mdi-volume-high text-lg cursor-pointer mr-2 mt-0.5'
              onClick={() => setIsVolumeOpen(!isVolumeOpen)}
              style={{
                color: states.Settings.settings.taskbar.items.color || 'white',
                display: states.Settings.settings.taskbar.hideSoundController ? 'none' : 'block',
              }}
            />
            <Clock />
          </div>
        </div>
      </footer>
    )
  }

  const FooterTop = () => {
    return (
      <footer
        className={` w-full h-10 fixed top-0 
        backdrop-filter backdrop-blur-sm 
        border-t border-white border-opacity-20 flex justify-start items-center
        `}
        style={{
          backgroundColor: states.Settings.settings.taskbar.backgroundColor || 'transparent',
        }}
      >
        <div className={`absolute w-40 h-10  bottom-10 
        bg-white flex justify-evenly items-center rounded-md
        backdrop-filter backdrop-blur-sm shadow-sm bg-opacity-20
        transition-all duration-300 ease-in-out
        ${isVolumeOpen ? 'right-0' : '-right-40'}
        `}>
          <Slider
            value={Number(globalVolume.toFixed(0))}
            onChange={(value) => setGlobalVolume(value)}
            w={100}
          />
        </div>
        <div className='w-10/12 flex h-full justify-start items-center flex-wrap overflow-hidden'>
          <StartMenu />
          {handleRenderTabs()}
        </div>
        <div className='w-2/12 h-full flex justify-end items-center pr-1'>
          <div className='flex w-full items-center justify-end -mr-5'>
            {weatherData?.main?.temp &&
              <div
                className='flex h-full justify-end items-center mr-2 cursor-pointer'
                onClick={() => {
                  dispatch(WindowAddTab({
                    title: 'Weather App',
                    tab: {
                      title: 'Weather App',
                      uuid: uuid(6),
                      value: 'https://www.google.com/search?q=weather',
                      maximized: false,
                      minimized: false,
                      focused: true,
                    }
                  }))
                }}
              >
                <CustomText
                  text={`${weatherData?.main?.temp.toFixed(0)}°C`}
                  className='text-xs ml-1'
                  style={{
                    color: states.Settings.settings.taskbar.items.color || 'white',
                  }}
                />
                <Image
                  src={`http://openweathermap.org/img/wn/${weatherData?.weather[0]?.icon}@2x.png`}
                  alt={weatherData?.weather[0]?.description}
                  width={36}
                  height={36}
                  className='mt-1 cursor-pointer'

                />

              </div>
            }
            <span
              className='i-mdi-volume-high text-lg cursor-pointer mr-2 mt-0.5'
              onClick={() => setIsVolumeOpen(!isVolumeOpen)}
              style={{
                color: states.Settings.settings.taskbar.items.color || 'white',
                display: states.Settings.settings.taskbar.hideSoundController ? 'none' : 'block',
              }}
            />
            <Clock />
          </div>
        </div>
      </footer>
    )
  }

  switch (states.Settings.settings.taskbar.position) {
    case 'top':
      return <FooterTop />
    case 'bottom':
      return <FooterBottom />
    default:
      return <FooterBottom />
  }
}

export default TaskBar