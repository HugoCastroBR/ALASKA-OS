import React, { useEffect } from 'react'
import CustomText from '../atoms/CustomText'
import useStore from '@/hooks/useStore'
import { Button, SimpleGrid, TextInput } from '@mantine/core'
import { TodoListProps } from '@/types/programs'
import { uuid } from '@/utils/file'

const TodoApp = () => {

  const { states, dispatch } = useStore()


  interface ListItemProps {
    title: string
    className?: string
    onClick?: () => void
  }
  const ListItem = ({
    title,
    className,
    onClick,
  }: ListItemProps) => {

    const [isHovered, setIsHovered] = React.useState(false)

    return (
      <div
        className='w-full h-8 flex my-1 p-1 rounded-sm rounded-t-md
      justify-between items-center cursor-pointer border-b-2
      drop-shadow-md backdrop-filter backdrop-blur-sm
      '
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          backgroundColor: states.Settings.settings.system.systemBackgroundColor || 'white',
          borderColor: states.Settings.settings.system.systemHighlightColor || 'white',

        }}
      >
        <div className='flex items-center'>
          <span
            className={`${className} text-lg mr-2`}
            style={{
              color: states.Settings.settings.system.systemTextColor || 'white',
            }}
          />
          <CustomText
            text={title}
            className='!text-base font-semibold text-center'
            style={{
              color: states.Settings.settings.system.systemTextColor || 'white',
            }}
          />
        </div>
        <span
          className={`i-mdi-menu-right text-2xl 
          transition-all duration-300 ease-in-out
          -mr-2
        `}
          style={{
            color: isHovered ? states.Settings.settings.system.systemHighlightColor || 'white' : 'transparent',
          }}
        />
      </div>
    )
  }

  const [selectedClassName, setSelectedClassName] = React.useState<string | undefined>(undefined)

  interface IconSelectListItemProps {
    className: string
  }
  const IconSelectListItem = ({
    className,
  }:IconSelectListItemProps) => {





    return (
      <div className={`w-7 h-7 flex justify-center items-center rounded-md
      bg-slate-600 bg-opacity-30 cursor-pointer hover:bg-slate-500
      transition-all duration-300 ease-in-out ${selectedClassName === className ? 'ring-2 ring-blue-500' : ''}`}
      onClick={() => {
        setSelectedClassName(className)
      }}
      >
        <span
          className={`${className} text-xl`}
          style={{
            color: states.Settings.settings.system.systemTextColor || 'white',
          }}
        />
      </div>
    )
  }



  const [listName, setListName] = React.useState<string>()
  const [selected, setSelected] = React.useState(false)

  
  const handlerSaveNewList = (title:string,icon:string) => {
    const newList:TodoListProps = {
      title,
      icon,
      todos: [],
      createdAt: new Date().toISOString(),
      uuid: uuid(6)
    }

    console.log(JSON.stringify(newList))
  }

  return (
    <div
      className='absolute w-1/2 h-1/2 top-1/4 left-1/4
    flex flex-col  overflow-hidden
    rounded-lg bg-white'
    >
      <div
        className='w-full h-full flex'
        style={{
          backgroundColor: states.Settings.settings.system.systemBackgroundColor || 'white',
        }}
      >
        <div className='h-full w-1/3'>
          <div className='w-full h-32 flex flex-col justify-center items-start px-2'>
            <CustomText
              text='Menu'
              className='!text-2xl font-semibold text-center'
              style={{
                color: states.Settings.settings.system.systemTextColor || 'white',
              }}
            />
            <TextInput
              placeholder='Search'
              className='mt-1 w-full'
              radius={8}
              style={{
                color: states.Settings.settings.system.systemTextColor || 'white',
              }}
            />
          </div>
          <div className=' w-full h-[calc(100%-128px)] flex-col p-1 overflow-x-hidden overflow-y-auto'>
          <div
        className='w-full flex my-1 p-1 rounded-sm rounded-t-md
      justify-between items-center cursor-pointer border-b-2
      drop-shadow-md backdrop-filter backdrop-blur-sm
      transition-all duration-300 ease-in-out overflow-hidden
      '
        
        style={{
          backgroundColor: states.Settings.settings.system.systemBackgroundColor || 'white',
          borderColor: states.Settings.settings.system.systemHighlightColor || 'white',
          height: selected || selectedClassName ? '240px' : '32px',
          flexDirection: selected || selectedClassName ? 'column' : 'row',
        }}
      >
        <div className='flex items-start w-full'
        onClick={() => {
          setSelected(true)
        }}
        >
          <span
            className={`i-mdi-add text-xl mr-2`}
            style={{
              color: states.Settings.settings.system.systemTextColor || 'white',
            }}
          />
          <input
            className='!text-sm w-full bg-transparent'
            placeholder='Add List'
            onChange={(e) => {
              setListName(e.currentTarget.value)
            }}
            style={{
              color: states.Settings.settings.system.systemTextColor || 'white',
            }}
          />
        </div>
        <CustomText
          text='Select Icon:'
          className='!text-xs text-start h-4 w-full my-2 '
          style={{
            color: states.Settings.settings.system.systemTextColor || 'white',
            display: selected || selectedClassName ? 'block' : 'none',
          }}
        />
        <div 
        className='w-full cursor-default overflow-hidden pt-2 pl-1 pr-4 '
        style={{
          height: selected || selectedClassName ? '180px' : '0px',
          display: selected || selectedClassName ? 'block' : 'none',
        }}
        >
          <SimpleGrid cols={6}>
            <IconSelectListItem
              className='i-mdi-math-compass'
            />
            <IconSelectListItem
              className='i-mdi-account'
            />
            <IconSelectListItem
              className='i-mdi-weather-sunny'
            />
            <IconSelectListItem
              className='i-mdi-weather-night'
            />
            <IconSelectListItem
              className='i-mdi-weather-sunset'
            />
            <IconSelectListItem
              className='i-mdi-web'
            />
            <IconSelectListItem
              className='i-mdi-picture'
            />
            <IconSelectListItem
              className='i-mdi-cart'
            />
            <IconSelectListItem
              className='i-mdi-cash'
            />
            <IconSelectListItem
              className='i-mdi-bank'
            />
            <IconSelectListItem
              className='i-mdi-question-mark'
            />
            <IconSelectListItem
              className='i-mdi-music'
            />
            <IconSelectListItem
              className='i-mdi-message'
            />
            <IconSelectListItem
              className='i-mdi-car'
            />
            <IconSelectListItem
              className='i-mdi-bike'
            />
            <IconSelectListItem
              className='i-mdi-passport'
            />
            <IconSelectListItem
              className='i-mdi-airplane'
            />
            <IconSelectListItem
              className='i-mdi-tree'
            />
          </SimpleGrid>
          <SimpleGrid
            cols={2}
            className='mt-2 w-full'
          >
            <Button
              className='w-full h-6'
              color='red'
              onClick={() => {
                setSelected(false)
                selectedClassName && setSelectedClassName(undefined)
              }}
            >
              <CustomText
                text='Cancel'
                className='!text-xs font-semibold text-center'
                style={{
                  color: 'red',
                }}
              />
            </Button>
            <Button
              className='w-full h-6'
              color='green'
              onClick={() => {
                handlerSaveNewList(listName || '',selectedClassName || '')
              }}
            >
              <CustomText
                text='Save'
                className='!text-xs font-semibold text-center'
                style={{
                  color: 'green'
                }}
              />
            </Button>
          </SimpleGrid>
        </div>
      </div>
            <ListItem
              title='All Tasks'
              className='i-mdi-all-inclusive'
            />
            <ListItem
              title='Important'
              className='i-mdi-star'
            />
          </div>
        </div>
        <div className='bg-green-50 h-full w-2/3'>
          MAIN
        </div>
      </div>
    </div>
  )
}

export default TodoApp