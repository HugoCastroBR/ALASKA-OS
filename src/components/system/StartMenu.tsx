'use client'
import React, { useEffect } from 'react'
import CustomText from '../atoms/CustomText'
import Image from 'next/image'
import { Menu, Button, Accordion, Group } from '@mantine/core'
import useStore from '@/hooks/useStore'
import { WindowAddTab } from '@/store/actions'
import { uuid } from '@/utils/file'
import { windowStateProps } from '@/types/windows'

const StartMenu = () => {

  const { states, dispatch } = useStore()
  const [searchValue, setSearchValue] = React.useState('')




  const orderPrograms = () => {
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

  const renderPrograms = (programsOrdered:windowStateProps[]) => {

    return programsOrdered.map((window, index) => {
      return (
        <>
          <Menu.Item
          className='hover:bg-cyan-400 hover:bg-opacity-40 transition-all duration-300 ease-in-out'
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
          flex items-center w-24 bg-slate-50 
          bg-opacity-50 backdrop-filter backdrop-blur-sm
          justify-between px-2 h-full cursor-pointer
          '
          >
            <Image
              src='/assets/icons/Alaska.png'
              alt='eye-start'
              width={20}
              height={20}
            />
            <CustomText
              text='Start'
              className= 'cursor-pointer'
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
            marginTop: '6px',
            borderRadius: '0px',
            backdropFilter: 'blur(6px)',
            backgroundColor: 'rgba(200, 200, 255, 0.5)',
            border: '1px solid rgba(129, 233, 235, 0.2)',
            filter: 'drop-shadow(0px 0px 4px 1px rgba(26, 36, 35, 0.35))',
            boxShadow: '0px 0px 4px 1px rgba(26, 36, 35, 0.35)',
            overflowY: 'auto',
            overflowX: 'hidden',
          }
        }}
      >
        <Menu.Label>
          <div>
            <input 
            value={searchValue}
            placeholder='Search...'
            onChange={(e) => {
              setSearchValue(e.target.value)
            }}
            className='w-full h-8 mt-1 outline-none border border-gray-300 rounded-md px-2' 
            />
          </div>
        </Menu.Label>
        {renderPrograms(orderPrograms()).length > 0 
        ?
        renderPrograms(orderPrograms())
        :
        <NotFoundComponent/>
        }
      </Menu.Dropdown>
    </Menu>

  )
}

export default StartMenu