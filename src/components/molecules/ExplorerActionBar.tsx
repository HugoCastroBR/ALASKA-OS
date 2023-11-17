import React, { useState } from 'react'
import { IconPhoto, IconMessageCircle, IconSettings, IconFolder, IconArrowBack, IconAbc, IconTrash, IconReload } from '@tabler/icons-react';
import { Breadcrumbs, Button, rem, Tabs } from '@mantine/core';
import CustomText from '../atoms/CustomText';
import { explorerActionBarProps } from '@/types/programs';
const ExplorerActionBar = ({
  path,
  onBack,
  onReload,
}:explorerActionBarProps) => {

  const iconStyle = { width: rem(20), height: rem(20), };


  return (
    <Tabs variant="outline" radius="xs" defaultValue="Directory" styles={{
      root: {
        width: '100%',
        border: '0px',
      },
      tab: {
        height: '30px',
        padding: '0',
        width: '50%',
        borderBottom: '0px',
      },
      tabLabel: {
        border: '0px',
      },
      list: {
        border: '0px',
      },
      panel:{
        border: '0px',
        padding: '0px',
        height: '48px',
      },
      tabSection: {
        height: '48px',
        border: '0px',
      }
    }}>
      <Tabs.List>
        <Tabs.Tab  value="Directory" leftSection={<IconFolder  color='white' style={iconStyle} />}>
          <CustomText
            className='text-white text-base'
            text='Directory'
          />
        </Tabs.Tab>
        <Tabs.Tab value="settings" disabled leftSection={<IconSettings color='white' style={iconStyle} />}>
        <CustomText
            className='text-white text-base'
            text='Settings'
          />
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="Directory">
      <div className='flex w-full h-16 overflow-hidden'>
        <div className=' flex w-2/12 justify-evenly items-center overflow-hidden '>
          <div
          onClick={() => {
            onBack()
          }}
          className='h-full hover:bg-gray-700 transition duration-300 ease-in-out w-1/4 flex items-center justify-center cursor-pointer'>
            <IconArrowBack 
            color='white' style={{
              width: rem(24),
              height: rem(24),
            }} />
          </div>
          <div 
          onClick={() => {
            onReload()
          }}
          className='h-full hover:bg-gray-700 transition duration-300 ease-in-out w-1/4 flex items-center justify-center cursor-pointer'>
            <IconReload 
            color='white' style={{
              width: rem(24),
              height: rem(24),
              }} />
          </div>

        </div>
        <div className=' flex w-10/12 items-center p-2 pb-4 mt-2'>
          <CustomText
            className='text-white text-base'
            text={path}
          />
        </div>
      </div>
      </Tabs.Panel>
      <Tabs.Panel value="settings">
        Settings tab content
      </Tabs.Panel>
    </Tabs>
  )
}

export default ExplorerActionBar