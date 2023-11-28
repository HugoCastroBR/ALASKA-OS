import React, { useState } from 'react'
import type { WeatherProps } from '@/types/programs'
import CustomText from '../atoms/CustomText'
import { SimpleGrid } from '@mantine/core'
import useStore from '@/hooks/useStore'

const WeatherApp = () => {

  const [weatherData, setWeatherData] = useState<WeatherProps>({} as any)
  const { states, dispatch } = useStore()

  const ForeCastCard = () => {
    return (
      <div className='
      h-36 p-1 m-1 w-28 flex flex-col rounded-md
      justify-evenly items-center 
      '
        style={{
          backgroundColor: states.Settings?.settings.system?.systemBackgroundColor || 'rgba(0, 0, 0, 0.2)'
        }}
      >
        <CustomText
          text='6:00 AM'
          className='text-center'
        />
        <span
          style={{
            color: states.Settings?.settings.system?.systemTextColor || 'white'
          }}
          className='i-mdi-weather-cloudy text-5xl'
        />
        <CustomText
          text='25ºC'
          className='text-center !text-lg'
          />
      </div>
    )
  }

  return (
    <div
      className='absolute w-1/2 h-2/3 top-1/4 left-1/4
    flex flex-col  overflow-hidden
    rounded-lg bg-white'
    >
      <div className='w-full h-full flex flex-col'>
        <div className='bg-green-100 w-full h-12'>
          search
        </div>
        <div
          className=' w-full h-[calc(100%-48px)]
        flex flex-col justify-center items-center
        bg-opacity-30 backdrop-filter backdrop-blur-sm
        '
        style={{
          backgroundColor: states.Settings?.settings.system?.systemBackgroundColor || 'rgba(0, 0, 0, 0.2)',
          
        }}
        >
        
          <div className='h-1/3 w-full bg-blue-200 flex'>
            <div className='h-full flex flex-col w-3/5 bg-violet-200'>
              <div className='h-3/5 w-full bg-yellow-200 flex flex-col'>
                <div className='h-full flex flex-col w-full bg-pink-200'>
                  <CustomText text='City' />
                </div>
                <div className='h-full flex flex-col w-full bg-blue-200'>
                  <CustomText text='chance of rain' />
                </div>
              </div>
              <div className='h-2/5 w-full bg-gray-200 flex'>
                <CustomText text='31' />
              </div>
            </div>
            <div className='h-full flex flex-col w-2/5 bg-orange-200 justify-center items-center'>
              <span className='i-mdi-weather-cloudy text-6xl'></span>
            </div>
          </div>
          <div className='h-1/3 w-full bg-red-200 flex flex-col'>
            <div className='bg-lime-100 w-full h-1/5'>
              <CustomText text='Today Forecast' />
            </div>
            <div className='flex items-center justify-start p-1 h-4/5'>
              <ForeCastCard />
              <ForeCastCard />
              <ForeCastCard />
              <ForeCastCard />
            </div>
          </div>
          <div className='h-1/3 w-full flex flex-col'>
            <div className='w-full h-1/5'>
              <CustomText 
              text='Air Conditions' 
              className='m-1 p-1 !text-xl'
              style={{
                color: states.Settings?.settings.system?.systemTextColor || 'white'
              }}
              />
            </div>
            <div className=' flex items-center justify-start p-1 h-4/5 w-full '>
              <div className='
                h-36 p-1 m-1 w-36 flex flex-col rounded-md
                justify-center items-center border
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
                    className='i-mdi-weather-cloudy text-2xl mr-1'
                  />
                  <CustomText
                    text='Real Feel'
                    className='text-center !text-lg'
                    style={{
                      color: states.Settings?.settings.system?.systemTextColor || 'white'
                    }}
                    />
                  
                </div>
                <CustomText
                  text='25ºC'
                  className='text-center !text-lg'
                  style={{
                    color: states.Settings?.settings.system?.systemTextColor || 'white'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WeatherApp