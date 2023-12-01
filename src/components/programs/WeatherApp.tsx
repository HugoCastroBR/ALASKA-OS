import React, { useEffect, useState } from 'react'
import type { ForecastFiveDays, WeatherProps, programProps } from '@/types/programs'
import CustomText from '../atoms/CustomText'
import { Button, Loader, TextInput } from '@mantine/core'
import useStore from '@/hooks/useStore'
import { getCity, getForecast, getWeather } from '@/api/weatherApi'
import Image from 'next/image'
import DefaultWindow from '../containers/DefaultWindow'

const WeatherApp = ({
  tab,
  window
}:programProps) => {


  const searchInputRef = React.useRef<HTMLInputElement>(null)
  const [weatherData, setWeatherData] = useState<WeatherProps>({} as any)
  const [forecastData, setForecastData] = useState<ForecastFiveDays>({} as any)
  const [isLoading, setIsLoading] = useState(false)
  const [city, setCity] = useState('')

  const { states } = useStore()
  
  useEffect(() => {
    if(searchInputRef.current){
      searchInputRef.current.focus()
      searchInputRef.current.addEventListener('keypress', (e) => {
        if(e.key === 'Enter'){
          if(!city) return
          handlerSearchCity()
        }
      })
    }
    if(navigator.geolocation){
      navigator.permissions.query({name:'geolocation'}).then((result) => {
        if(result.state === 'granted'){
          navigator.geolocation.getCurrentPosition((position) => {
            handlerGetWeather(position.coords.latitude, position.coords.longitude)
            handlerGetForecast(position.coords.latitude, position.coords.longitude)
            
          })
        }
        else if(result.state === 'prompt'){
          navigator.geolocation.getCurrentPosition((position) => {
            handlerGetWeather(position.coords.latitude, position.coords.longitude)
            handlerGetForecast(position.coords.latitude, position.coords.longitude)
          })
        }
        else if(result.state === 'denied'){
          getCity('oslo').then((c) => {
            if(c){
            }
          })
        }
      })
    }else{
      console.log('Geolocation is not supported by this browser.')
    }
  }, [])


  const handlerGetWeather = (lat:number,lon:number) => {
    setIsLoading(true)
    getWeather(lat, lon).then((data) => {
      setWeatherData(data)
      setIsLoading(false)
    }).catch((err) => {
      console.log(err)
      setIsLoading(false)
    })
  }
  const handlerGetForecast = (lat:number,lon:number) => {
    setIsLoading(true)
    getForecast(lat, lon).then((data) => {
      setForecastData(data)
      setIsLoading(false)
    }).catch((err) => {
      console.log(err)
      setIsLoading(false)
    })
  }

  const handlerSearchCity = () => {
    setIsLoading(true)
    getCity(city).then((c) => {
      if(c){
        setIsLoading(false)
        handlerGetWeather(c[0].lat || 0, c[0].lon || 0)
        handlerGetForecast(c[0].lat || 0, c[0].lon || 0)
      }
    }).catch((err) => {
      console.log(err)
      setIsLoading(false)
    })
  }
  

  interface forecastCardProps {
    text: string
    icon: React.ReactNode
    value: string
    day: string
  }

  const ForeCastCard = ({
    text,
    icon,
    value,
    day
  }:forecastCardProps) => {
    return (
      <div className='
      h-32 p-1 m-1 w-28 flex flex-col rounded-md
      justify-evenly items-center border
      backdrop-filter backdrop-blur-sm shadow-lg
      flex-shrink-0
      '
        style={{
          backgroundColor: states.Settings?.settings.system?.systemBackgroundColor || 'rgba(0, 0, 0, 0.2)',
          borderColor: states.Settings?.settings.system?.systemTextColor || 'white'
        }}
      >
        <CustomText
          text={day}
          className='text-center !text-sm'
          style={{
            color: states.Settings?.settings.system?.systemTextColor || 'white'
          }}
        />
        <CustomText
          text={text}
          className='text-center'
        />
        {icon}
        <CustomText
          text={value}
          className='text-center !text-lg'
          />
      </div>
    )
  }

  const LoadingScreen = () => {
    return(
      <div 
      className='w-full h-full flex flex-col justify-center items-center'
      style={{
        backgroundColor: states.Settings?.settings.system?.systemBackgroundColor || 'rgba(0, 0, 0, 0.2)',
      }}
      >
        <Loader 
        size={128} 
        color={states.Settings?.settings.system?.systemHighlightColor || 'blue'}
        />
        <CustomText
          text='Loading...'
          className='text-center !text-xl'
          style={{
            color: states.Settings?.settings.system?.systemTextColor || 'white'
          }}
        />
      </div>
    )
  }

  return (
    <DefaultWindow
      currentTab={tab}
      currentWindow={window}
      className='!w-1/3 !h-2/3'
      resizable
      uuid={tab.uuid}
      title={window.title}
      onClose={() => {}}
      onMinimize={() => {}}
    >
      <div className='w-full h-full flex flex-col'>
        <div className=' w-full h-20 px-4 border-b
          shadow-lg flex justify-center items-center
        '
        style={{
          backgroundColor: states.Settings?.settings.system?.systemBackgroundColor || 'rgba(0, 0, 0, 0.2)',
          borderColor: states.Settings?.settings.system?.systemTextColor || 'white'
        }}
        >
          <TextInput
          label='Search City: '
          placeholder='Search City'
          className='w-full h-full rounded-md
          '
          value={city}
          onChange={(e) => {
            setCity(e.currentTarget.value)
          }}
          style={{
            color: states.Settings?.settings.system?.systemTextColor || 'white'
          }}
          ref={searchInputRef}
          onKeyPress={(e) => {
            if(e.key === 'Enter'){
              if(!city) return
              handlerSearchCity()
            }
          }}
          />
          <Button
            className='ml-2 mt-1'
            style={{
              backgroundColor: states.Settings?.settings.system?.systemBackgroundColor || 'rgba(0, 0, 0, 0.2)',
              borderColor: states.Settings?.settings.system?.systemTextColor || 'white'
            
            }}
            onClick={handlerSearchCity}
          >
            <span 
            className='i-mdi-magnify text-lg'
            style={{
              color: states.Settings?.settings.system?.systemTextColor || 'white'
            
            }}
            ></span>
          </Button>
        </div>
        { 
        isLoading ? <LoadingScreen /> :
        <div
          className=' w-full h-[calc(100%-80px)]
        flex flex-col justify-center items-center
        bg-opacity-30 backdrop-filter backdrop-blur-sm
        '
        style={{
          backgroundColor: states.Settings?.settings.system?.systemBackgroundColor || 'rgba(0, 0, 0, 0.2)',
          
        }}
        >
        
          <div className='h-1/3 w-full flex p-2'>
            <div className='h-full flex flex-col w-3/5'>
              <div className='h-3/5 w-full flex flex-col'>
                <div className='h-full flex flex-col w-full justify-center items-start mb-2'>
                  <CustomText 
                  text={weatherData?.name || 'Oslo'}
                  style={{
                    color: states.Settings?.settings.system?.systemTextColor || 'white'
                  }}
                  className='text-center !text-2xl'
                  /><CustomText 
                  text={`Chance of rain: ${weatherData?.rain?.['1h'] || weatherData?.rain?.['3h'] || 50}% `}
                  style={{
                    color: states.Settings?.settings.system?.systemTextColor || 'white'
                  }}
                  className='text-center !text-sm'
                  />
                </div>
              </div>
              <div className='h-2/5 w-full flex justify-start items-center'>
                <CustomText 
                text={`${weatherData?.main?.temp.toFixed(0) || '25'}ºC`} 
                style={{
                  color: states.Settings?.settings.system?.systemTextColor || 'white'
                }}
                className='text-center !text-4xl mb-6'
                />
              </div>
            </div>
            <div className='h-full flex flex-col w-2/5 justify-center items-center'>
              <Image
                src={`http://openweathermap.org/img/wn/${weatherData?.weather?.[0]?.icon}@4x.png`}
                width={128}
                height={128}
                alt={weatherData?.weather?.[0]?.description}
              />
            </div>
          </div>
          <div className='h-1/3 w-full flex flex-col'>
            <div className='w-full h-1/5'>
              <CustomText 
              text='Today Forecast' 
              className='m-1 p-1 !text-xl'
              style={{
                color: states.Settings?.settings.system?.systemTextColor || 'white'
              }}
              />
            </div>
            <div 
            className='flex items-center justify-around p-1 h-4/5 overflow-y-hidden overflow-x-auto'
            >
              {forecastData?.list?.slice(0,5).map((item, index) => {
                const dateInHour = new Date(item.dt * 1000).getHours()
                const dateInDay = new Date(item.dt * 1000).getDay()
                const icon = item.weather[0].icon
                return(
                  <ForeCastCard
                    key={index}
                    day={dateInDay === 0 ? 'Sun' : dateInDay === 1 ? 'Mon' : dateInDay === 2 ? 'Tue' : dateInDay === 3 ? 'Wed' : dateInDay === 4 ? 'Thu' : dateInDay === 5 ? 'Fri' : 'Sat'}
                    text={`${dateInHour}:00`}
                    icon={
                      <Image
                        src={`http://openweathermap.org/img/wn/${icon}.png`}
                        width={48}
                        height={48}
                        alt={item.weather[0].description}
                      />
                    }
                    value={`${item.main.temp.toFixed(0)}ºC`}
                  />
                )
              })}

            </div>
          </div>
          <div className='h-1/3 w-full flex flex-col'>
            <div className='w-full h-1/5'>
              <CustomText 
              text='Air Conditions' 
              className='m-1 mb-2 p-1 !text-xl'
              style={{
                color: states.Settings?.settings.system?.systemTextColor || 'white'
              }}
              />
            </div>
            <div className=' flex items-center justify-start p-1 pb-4 h-4/5 w-full '>
              <div className='
                h-36 p-1 m-1 w-36 flex flex-col rounded-md
                justify-center items-center border
                backdrop-filter backdrop-blur-sm shadow-lg
                '
                style={{
                  backgroundColor: states.Settings?.settings.system?.systemBackgroundColor || 'rgba(0, 0, 0, 0.2)',
                  borderColor: states.Settings?.settings.system?.systemTextColor || 'white'
                }}
              >
                <div className='flex items-center justify-center mb-1 w-full '>
                <span
                    style={{
                      color: states.Settings?.settings.system?.systemTextColor || 'white'
                    }}
                    className='i-mdi-weather-sun-wireless text-xl mr-1'
                  />
                  <CustomText
                    text='Real Feel'
                    className='text-center !text-sm'
                    style={{
                      color: states.Settings?.settings.system?.systemTextColor || 'white'
                    }}
                    />
                  
                </div>
                <CustomText
                  text={`${weatherData?.main?.feels_like.toFixed(0) || '25'}ºC`}
                  className='text-center !text-lg'
                  style={{
                    color: states.Settings?.settings.system?.systemTextColor || 'white'
                  }}
                />
              </div>
              <div className='
                h-36 p-1 m-1 w-36 flex flex-col rounded-md
                justify-center items-center border
                backdrop-filter backdrop-blur-sm shadow-lg
                '
                style={{
                  backgroundColor: states.Settings?.settings.system?.systemBackgroundColor || 'rgba(0, 0, 0, 0.2)',
                  borderColor: states.Settings?.settings.system?.systemTextColor || 'white'
                }}
              >
                <div className='flex items-center justify-center mb-1 w-full '>
                <span
                    style={{
                      color: states.Settings?.settings.system?.systemTextColor || 'white'
                    }}
                    className='i-mdi-weather-windy text-xl mr-1'
                  />
                  <CustomText
                    text='Wind Speed'
                    className='text-center !text-sm'
                    style={{
                      color: states.Settings?.settings.system?.systemTextColor || 'white'
                    }}
                    />
                  
                </div>
                <CustomText
                  text={`${weatherData?.wind?.speed.toFixed(0) || '10'} km/h`}
                  className='text-center !text-base'
                  style={{
                    color: states.Settings?.settings.system?.systemTextColor || 'white'
                  }}
                />
              </div>
              <div className='
                h-36 p-1 m-1 w-36 flex flex-col rounded-md
                justify-center items-center border
                backdrop-filter backdrop-blur-sm shadow-lg
                '
                style={{
                  backgroundColor: states.Settings?.settings.system?.systemBackgroundColor || 'rgba(0, 0, 0, 0.2)',
                  borderColor: states.Settings?.settings.system?.systemTextColor || 'white'
                }}
              >
                <div className='flex items-center justify-center mb-1 w-full '>
                <span
                    style={{
                      color: states.Settings?.settings.system?.systemTextColor || 'white'
                    }}
                    className='i-mdi-weather-rainy text-2xl mr-1'
                  />
                  <CustomText
                    text='Chance of Rain'
                    className='text-center !text-sm'
                    style={{
                      color: states.Settings?.settings.system?.systemTextColor || 'white'
                    }}
                    />
                  
                </div>
                <CustomText
                  text={`${weatherData?.rain?.['1h'] || weatherData?.rain?.['3h'] || 50}%`}
                  className='text-center !text-lg'
                  style={{
                    color: states.Settings?.settings.system?.systemTextColor || 'white'
                  }}
                />
              </div>
              <div className='
                h-36 p-1 m-1 w-36 flex flex-col rounded-md
                justify-center items-center border
                backdrop-filter backdrop-blur-sm shadow-lg
                '
                style={{
                  backgroundColor: states.Settings?.settings.system?.systemBackgroundColor || 'rgba(0, 0, 0, 0.2)',
                  borderColor: states.Settings?.settings.system?.systemTextColor || 'white'
                }}
              >
                <div className='flex items-center justify-center mb-1 w-full '>
                <span
                    style={{
                      color: states.Settings?.settings.system?.systemTextColor || 'white'
                    }}
                    className='i-mdi-water-drop text-2xl mr-1'
                  />
                  <CustomText
                    text='Humidity'
                    className='text-center !text-sm'
                    style={{
                      color: states.Settings?.settings.system?.systemTextColor || 'white'
                    }}
                    />
                  
                </div>
                <CustomText
                  text={`${weatherData?.main?.humidity || 50}%`}
                  className='text-center !text-lg'
                  style={{
                    color: states.Settings?.settings.system?.systemTextColor || 'white'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      }
      </div>
    </DefaultWindow>
  )
}

export default WeatherApp