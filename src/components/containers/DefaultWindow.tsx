import useStore from '@/hooks/useStore'
import { WindowToggleMinimizeTab, WindowToggleMaximizeTab, WindowRemoveTab, WindowSetTabFocused, ClearAllFocused } from '@/store/actions'
import { DefaultWindowProps } from '@/types/containers'
import Image from 'next/image'
import React, { useEffect } from 'react'
import Draggable from 'react-draggable'
import CustomText from '../atoms/CustomText'
import useSettings from '@/hooks/useSettings'



const DefaultWindow = ({
  children,
  title,
  onMinimize,
  onMaximize,
  onClose,
  currentTab,
  currentWindow,
  resizable,
  uuid,
  className,
  preventDefaultClose,
}: DefaultWindowProps) => {

  const { states, dispatch } = useStore()
  const { settings } = useSettings()

  useEffect(() => {
    dispatch(ClearAllFocused())
    dispatch(WindowSetTabFocused({
      title: currentWindow?.title || '',
      uuid: currentTab?.uuid || '',
    }))
  }, [])

  const MinimizeTab = () => {
    dispatch(ClearAllFocused())
    dispatch(WindowToggleMinimizeTab({
      title: currentWindow?.title || '',
      uuid: currentTab?.uuid || '',
    }))
    if(currentTab.focused){
      dispatch(ClearAllFocused())
    }
  }
  const MaximizeTab = () => {
    dispatch(WindowSetTabFocused({
      title: currentWindow?.title || '',
      uuid: currentTab?.uuid || '',
    }))
    dispatch(WindowToggleMaximizeTab({
      title: currentWindow?.title || '',
      uuid: currentTab?.uuid || '',
    }))
  }

  const CloseTab = () => {
    if(preventDefaultClose) return
    dispatch(WindowRemoveTab({
      title: currentWindow?.title || '',
      uuid: currentTab?.uuid || '',
    }))
  }

  const [topBarColor, setTopBarColor] = React.useState(settings?.windowTopBar.color || 'rgba(0, 0, 0, 0.2)')
  const [topBarIconsColor, setTopBarIconsColor] = React.useState(settings?.windowTopBar.items.color || 'rgba(0, 0, 0, 1)')
  const [systemDefaultBackgroundColor, setSystemDefaultBackgroundColor] = React.useState(settings?.system?.systemBackgroundColor || 'rgba(0, 0, 0, 0.2)')


  useEffect(() => {
    setTopBarColor(settings?.windowTopBar.color || 'rgba(0, 0, 0, 0.2)')
  }, [settings?.windowTopBar.color])

  useEffect(() => {
    setTopBarIconsColor(settings?.windowTopBar.items.color || 'rgba(0, 0, 0, 1)')
  }, [settings?.windowTopBar.items.color])

  useEffect(() => {
    setSystemDefaultBackgroundColor(settings?.system?.systemBackgroundColor || 'rgba(0, 0, 0, 0.2)')
  }, [settings?.system?.systemBackgroundColor])

  return (
    <Draggable
      handle={`.handle${currentTab.uuid}`}
      bounds='#desktop-view'
    >
      <section
        onClick={
          () => {
            dispatch(ClearAllFocused())
            dispatch(WindowSetTabFocused({
              title: currentWindow?.title || '',
              uuid: currentTab?.uuid || '',
            }))
          }
        }
        className={`
        absolute w-1/2 h-1/2 top-1/4 left-1/4
        flex flex-col  overflow-hidden
        rounded-lg 
        ${currentTab?.minimized ? 'hidden' : ''}
        ${currentTab?.maximized ? '!w-full !h-[calc(96%)] rounded-none ' : ''}
        ${currentTab?.maximized ? '' : 'backdrop-filter backdrop-blur-sm shadow-2xl'}
        ${currentTab?.focused ? 'z-30' : 'z-20'}
        ${currentTab?.maximized ? '!top-0 !left-0' : ''}
        ${resizable && !currentTab?.maximized ? 'hover:resize' : ''}
        ${className}`}
        style={{
          backgroundColor: systemDefaultBackgroundColor
        }}
      >
        <div
          className={`
          w-full h-8 bg-slate-50 bg-opacity-50 backdrop-filter backdrop-blur-sm
          flex items-center justify-between px-2 cursor-move handle${currentTab.uuid} fixed z-20
          `}
          style={{
            backgroundColor: topBarColor,
          }}
          >
          <Image
          alt='Program Icon'
          src={currentWindow?.icon || '/assets/icons/Alaska.png'}
          width={20}
          height={20}
          />
          <CustomText
            text={title}
            className='ml-12 text-base font-semibold'
            style={{
              color: topBarIconsColor,
            }}
          />
          <div className='flex justify-end items-center'>
            {
              onMinimize &&
              <span
                onClick={() => {
                  MinimizeTab()
                  onMinimize()
                }}
                className='i-mdi-minus text-2xl
              mx-px cursor-pointer hover:text-blue-500 transition-all duration-300 ease-in-out
              '
              style={{
                color: topBarIconsColor,
              }}
              />
            }
            {
              onMaximize &&
              <span
                onClick={() => {
                  MaximizeTab()
                  onMaximize()
                }}
                className='i-mdi-window-maximize text-2xl
              mx-px cursor-pointer hover:text-blue-500 transition-all duration-300 ease-in-out
              '
              style={{
                color: topBarIconsColor,
              }}
              />
            }
            {
              onClose &&
              <span
                onClick={() => {
                  CloseTab()
                  onClose()
                }}
                className='i-mdi-close text-2xl
              mx-px cursor-pointer hover:text-blue-500 transition-all duration-300 ease-in-out
              '
              style={{
                color: topBarIconsColor,
              }}
              />
            }
          </div>
        </div>
        <div 
        onClick={
          () => {
            dispatch(ClearAllFocused())
            dispatch(WindowSetTabFocused({
              title: currentWindow?.title || '',
              uuid: currentTab?.uuid || '',
            }))
          }
        }
        className='w-full h-full pt-8'>
          {children}
        </div>
      </section>
    </Draggable>
  )
}

export default DefaultWindow