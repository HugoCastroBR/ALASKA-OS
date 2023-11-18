'use client'
import React from 'react'
import CustomText from '../atoms/CustomText'
import Image from 'next/image'
import { Menu, Button, Accordion, Group } from '@mantine/core'
import useStore from '@/hooks/useStore'
import { WindowAddTab } from '@/store/actions'
import { uuid } from '@/utils/file'

const StartMenu = () => {

  const { states, dispatch } = useStore()


  const renderPrograms = () => {
    return states.Windows.windows.map((window, index) => {
      return (
        <>
          <Menu.Item key={index}
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


  return (

    <Menu
      shadow="md"
      width={200}
      transitionProps={{
        duration: 300,
        timingFunction: 'ease',
        transition: 'pop-bottom-left',
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
            marginTop: '6px',
            borderRadius: '0px',
            borderTopRightRadius: '8px',
            backdropFilter: 'blur(6px)',
            backgroundColor: 'rgba(255, 255, 255, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            filter: 'drop-shadow(0px 4px 4px rgba(255, 255, 255, 0.25))',
            boxShadow: '0px 4px 4px rgba(255, 255, 255, 0.25)',
          }
        }}
      >
        <Menu.Label>
          <CustomText
            text='Start Menu'
          />
        </Menu.Label>
        {renderPrograms()}
      </Menu.Dropdown>
    </Menu>

  )
}

export default StartMenu