/* eslint-disable react-hooks/rules-of-hooks */
'use client'
import React, { useState } from 'react'
import CustomText from '../atoms/CustomText'
import Image from 'next/image'
import { Menu, Button, Group } from '@mantine/core'
import useStore from '@/hooks/useStore'
import { WindowAddTab } from '@/store/actions'
import { uuid } from '@/utils/file'
import { windowStateProps } from '@/types/windows'

const StartMenu = () => {

  const { states, dispatch } = useStore()
  const [searchValue, setSearchValue] = useState('')

  const orderPrograms = () => {

    if (!states.Settings.settings.startMenu.ordered) {
      return [...states.Windows.windows]
    }

    const programsOrdered = [...states.Windows.windows].filter((v) => {
      const program = v.title.toLowerCase()
      const search = searchValue.toLowerCase()
      return program.includes(search)
    }).sort((a, b) => {
      if (a.title > b.title) {
        return 1;
      }
      if (a.title < b.title) {
        return -1;
      }
      return 0;
    });


    return programsOrdered
  }

  const renderPrograms = (programsOrdered: windowStateProps[]) => {

    return programsOrdered.map((window, index) => {

      const [isHovering, setIsHovering] = useState(false)

      return (
        <>
          <Menu.Item
            className=' transition-all duration-300 ease-in-out'
            onMouseEnter={() => {
              setIsHovering(true)
            }}
            onMouseLeave={() => {
              setIsHovering(false)
            }}
            key={index}
            onClick={() => {
              dispatch(WindowAddTab({
                title: window.title,
                tab: {
                  maximized: false,
                  minimized: false,
                  title: window.title,
                  uuid: uuid(6),
                  focused: true,
                  value: '/Desktop',
                }
              }))
            }}
            style={{
              backgroundColor: isHovering ? `${states.Settings.settings.system.systemHighlightColor || 'rgba(0, 0, 0, 0.2)'}` : `${'transparent'}`,
            }}
          >
            <Group placeholder={window.title}>
              <Image
                src={window.icon || '/assets/icons/Alaska.png'}
                alt='Program Icon'
                width={24}
                height={24}
              />
              <CustomText
                text={window.title}
                style={{
                  color: `${states.Settings.settings.startMenu.textColor || 'rgba(0, 0, 0, 1)'}`
                }}
              />
            </Group>
          </Menu.Item>
        </>
      )
    })
  }

  const NotFoundComponent = () => {
    return (
      <div className='flex flex-col justify-center items-center w-full h-full mt-4'>
        <Image
          src='/assets/icons/Alaska.png'
          alt='Program Icon'
          width={32}
          height={32}
        />
        <CustomText
          className='text-center mt-2 text-base font-semibold text-slate-600'
          text='Program not found'
          style={{
            color: `${states.Settings.settings.startMenu.textColor || 'rgba(0, 0, 0, 1)'}`

          }}
        />
      </div>
    )
  }

  return (

    <Menu
      shadow="md"
      width={200}
      transitionProps={{
        duration: 500,
        timingFunction: 'ease',
        transition: 'slide-right',
      }}
    >
      <Menu.Target>
        <Button
          size='sm'
          styles={{
            root: {
              backgroundColor: 'transparent',
              border: 'none',
              padding: '0px',
              margin: '0px',
              height: '40px',
              paddingBlockEnd: '0px',
            }
          }}
        >
          <div
            className='
          flex items-center w-24 
          backdrop-filter backdrop-blur-sm
          justify-between px-2 h-full cursor-pointer
          '
            style={{
              backgroundColor: `${states.Settings.settings.startMenu.background || 'rgba(200, 200, 255, 0.5)'}`,
              color: `${states.Settings.settings.startMenu.textColor || 'rgba(0, 0, 0, 1)'}`

            }}
          >
            <Image
              src='/assets/icons/Alaska.png'
              alt='eye-start'
              width={20}
              height={20}
            />
            <CustomText
              text='Start'
              className='cursor-pointer'
              style={{
                color: `${states.Settings.settings.startMenu.textColor || 'rgba(0, 0, 0, 1)'}`

              }}
            />
          </div></Button>
      </Menu.Target>
      <Menu.Dropdown
        styles={{
          dropdown: {
            padding: '0px',
            margin: '0px',
            height: '400px',
            width: '240px',
            marginTop: '7px',
            borderRadius: '0px',
            backdropFilter: 'blur(6px)',
            backgroundColor: `${states.Settings.settings.startMenu.background || 'rgba(200, 200, 255, 0.5)'}`,
            border: '1px solid rgba(4, 8, 8, 0.2)',
            filter: 'drop-shadow(0px 0px 4px 1px rgba(26, 36, 35, 0.35))',
            boxShadow: '0px 0px 4px 1px rgba(26, 36, 35, 0.35)',
            overflowY: 'auto',
            overflowX: 'hidden',
          }
        }}
      >
        <Menu.Label>
          <div>
            {!states.Settings.settings.startMenu.searchInput.disabled
              ?
              <></>
              :
              <input
                value={searchValue}
                placeholder='Search...'
                onChange={(e) => {
                  setSearchValue(e.target.value)
                }}
                className='w-full h-8 mt-1 outline-none border border-gray-300 rounded-md px-2'
                style={{
                  backgroundColor: `${states.Settings.settings.startMenu.searchInput.background || 'rgba(255, 255, 255, 1)'}`,
                  color: `${states.Settings.settings.startMenu.searchInput.textColor || 'rgba(0, 0, 0, 1)'}`,
                }}
              />
            }
          </div>
        </Menu.Label>
        {renderPrograms(orderPrograms()).length > 0
          ?
          renderPrograms(orderPrograms())
          :
          <NotFoundComponent />
        }
      </Menu.Dropdown>
    </Menu>

  )
}

export default StartMenu