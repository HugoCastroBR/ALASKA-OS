import React, { useEffect } from 'react'
import { Button, Checkbox, ColorPicker, Loader, Select, SimpleGrid, Tabs, rem, Group } from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import {
  IconUpload,
  IconPhoto,
  IconX,
  IconArrowBarDown,
  IconDeviceDesktop,
  IconAppWindow,
  IconMenu2,
  IconClock,
  IconSettings,
} from '@tabler/icons-react'
import { SettingsProps } from '@/types/settings';
import useStore from '@/hooks/useStore';
import { SettingsSetSettings } from '@/store/actions';
import useFS from '@/hooks/useFS';
import CustomText from '../atoms/CustomText';
import { programProps } from '@/types/programs';
import DefaultWindow from '../containers/DefaultWindow';
const Settings = ({
  tab,
  AlaskaWindow,
}: programProps) => {

  const { states, dispatch } = useStore()

  const { fs } = useFS()

  const [isLoading, setIsLoading] = React.useState(false)
  const [settings, setSettings] = React.useState<SettingsProps>({ ...states.Settings.settings })
  const [wallpaper, setWallpaper] = React.useState('')


  useEffect(() => {
    if (fs) {
      fs?.readFile('settings.json', 'utf8', (err, data) => {
        if (err) {
          console.log(err)
          setIsLoading(false)
          return
        }
        if (!data) {
          setIsLoading(false)
          return
        }
        console.log('Settings loaded!');
        const _settings = JSON.parse(data)
        setSettings(_settings)
        dispatch(SettingsSetSettings(_settings))
        setIsLoading(false)
      })
    }
  }, [fs])

  const [defaultSystemTextColor, setDefaultSystemTextColor] = React.useState(settings?.system.systemTextColor || '')
  const [defaultSystemHighlightColor, setDefaultSystemHighlightColor] = React.useState(settings?.system.systemHighlightColor || '')

  useEffect(() => {
    setDefaultSystemTextColor(settings?.system.systemTextColor || '')
  }, [settings?.system.systemTextColor])

  useEffect(() => {
    setDefaultSystemHighlightColor(settings?.system.systemHighlightColor || '')
  }, [settings?.system.systemHighlightColor])


  const iconStyle = { width: rem(18), height: rem(18), color: defaultSystemTextColor };
  const tabStyle = {
    borderBottom: '1px solid #e0e0e0',
    fontSize: '1rem',
    fontWeight: 500,
    color: defaultSystemTextColor,
    padding: '0.75rem 1rem',
    backgroundColor: 'transparent',
  }
  const tabPanelStyle = {
    padding: '0.75rem 1rem',
    with: '100%',
    color: defaultSystemTextColor,
    height: '100%',
  }

  const handleSave = () => {
    console.log('save')
    dispatch(SettingsSetSettings(settings))
    fs?.writeFile('settings.json', JSON.stringify(settings), (err) => {
      if (err) {
        console.log(err)
        return
      }
      console.log('Settings saved!');
      // document.location.reload()
    })
  }


  if (isLoading) {
    return (
      <div
        className='absolute w-1/2 h-1/2 top-1/4 left-1/4
      flex flex-col  overflow-hidden
      rounded-lg bg-white justify-center items-center'
      >
        <Loader size={128} />
      </div>
    )
  }

  return (
    <DefaultWindow
      currentTab={tab}
      currentWindow={AlaskaWindow}
      resizable
      onClose={() => { }}
      onMaximize={() => { }}
      onMinimize={() => { }}
      uuid={tab.uuid}
      title='Settings'
    >
      <div className='flex justify-between items-center w-full h-full'>
        <Tabs
          defaultValue="System"
          orientation="vertical"
          w={"100%"}
          h={"100%"}
        >
          <Tabs.List>
            <Tabs.Tab
              color={defaultSystemHighlightColor}
              value="Window"
              leftSection={<IconAppWindow style={iconStyle} />}
              style={tabStyle}
            >
              Window
            </Tabs.Tab>
            <Tabs.Tab
              color={defaultSystemHighlightColor}
              value="Desktop"
              leftSection={<IconDeviceDesktop style={iconStyle} />}
              style={tabStyle}
            >
              Desktop
            </Tabs.Tab>
            <Tabs.Tab
              color={defaultSystemHighlightColor}
              value="Taskbar"
              leftSection={<IconArrowBarDown style={iconStyle} />}
              style={tabStyle}
            >
              Taskbar
            </Tabs.Tab>
            <Tabs.Tab
              color={defaultSystemHighlightColor}
              value="StartMenu"
              leftSection={<IconMenu2 style={iconStyle} />}
              style={tabStyle}
            >
              Start Menu
            </Tabs.Tab>
            <Tabs.Tab
              color={defaultSystemHighlightColor}
              value="Clock"
              leftSection={<IconClock style={iconStyle} />}
              style={tabStyle}
            >
              Clock
            </Tabs.Tab>
            <Tabs.Tab
              color={defaultSystemHighlightColor}
              value="System"
              leftSection={<IconSettings style={iconStyle} />}
              style={tabStyle}
            >
              System
            </Tabs.Tab>
            <Button
              className='mx-2 mt-2'
              placeholder='Save'
              onClick={handleSave}
              color={defaultSystemTextColor}
            >
              Save
            </Button>
          </Tabs.List>

          <Tabs.Panel className='overflow-y-scroll' value="Taskbar" style={tabPanelStyle}>
            <SimpleGrid cols={2} spacing="md" verticalSpacing="md" >

              <Checkbox
                checked={settings.taskbar.showOnHover}
                label="Show Taskbar on Hover"
                disabled
                style={{
                  color: defaultSystemTextColor
                }}
                onChange={(event) => {
                  setSettings({ ...settings, taskbar: { ...settings.taskbar, showOnHover: event.currentTarget.checked } })
                }}
              />
              <Checkbox
                checked={settings.taskbar.hideSoundController}
                label="Hide Sound Controller"
                onChange={(event) => {
                  setSettings({ ...settings, taskbar: { ...settings.taskbar, hideSoundController: event.currentTarget.checked } })
                }}
              />
              <Select
                label='Taskbar Location'
                placeholder='Taskbar Location'
                data={['Top', 'Bottom']}
                style={{
                  color: defaultSystemTextColor
                }}
                defaultValue={settings.taskbar.position.charAt(0).toUpperCase() + settings.taskbar.position.slice(1)}
                onChange={(value) => {
                  if (!value) return
                  setSettings({ ...settings, taskbar: { ...settings.taskbar, position: value.toLowerCase() as 'top' | 'bottom' | 'left' | 'right' } })
                }}
              />
              <div className='flex flex-col'>
                <label
                  className='text-sm font-medium'
                  style={{
                    color: defaultSystemTextColor
                  }}
                >
                  Taskbar background color
                </label>
                <label
                  className='text-sm font-medium mb-1'
                  style={{
                    color: defaultSystemTextColor
                  }}
                >
                  {settings.taskbar.backgroundColor === 'transparent' ? 'rgba(255,255,255,0.0)' : settings.taskbar.backgroundColor}
                </label>
                <ColorPicker
                  format='rgba'
                  defaultValue={settings.taskbar.backgroundColor}
                  onChange={(value) => {
                    setSettings({ ...settings, taskbar: { ...settings.taskbar, backgroundColor: value } })
                  }}
                />
              </div>
              <div className='flex flex-col'>
                <label
                  className='text-sm font-medium'
                  style={{
                    color: defaultSystemTextColor
                  }}
                >
                  Taskbar item background color
                </label>
                <label
                  className='text-sm font-medium mb-1'
                  style={{
                    color: defaultSystemTextColor
                  }}
                >
                  {settings?.taskbar.items.backgroundColor === 'transparent' ? 'rgba(255,255,255,0.0)' : settings.taskbar.items.backgroundColor}
                </label>
                <ColorPicker
                  format='rgba'
                  defaultValue={settings.taskbar.items.backgroundColor}
                  onChange={(value) => {
                    setSettings({ ...settings, taskbar: { ...settings.taskbar, items: { ...settings.taskbar.items, backgroundColor: value } } })
                  }}
                />
              </div>
              <div className='flex flex-col'>
                <label
                  className='text-sm font-medium'
                  style={{
                    color: defaultSystemTextColor
                  }}
                >
                  Taskbar item text color
                </label>
                <label
                  className='text-sm font-medium mb-1'
                  style={{
                    color: defaultSystemTextColor
                  }}
                >
                  {settings?.taskbar.items.color === 'transparent' ? 'rgba(255,255,255,0.0)' : settings.taskbar.items.color}
                </label>
                <ColorPicker
                  format='rgba'
                  defaultValue={settings.taskbar.items.color}
                  onChange={(value) => {
                    setSettings({ ...settings, taskbar: { ...settings.taskbar, items: { ...settings.taskbar.items, color: value } } })
                  }}
                />
              </div>
              <div className='flex flex-col'>
                <label
                  className='text-sm font-medium'
                  style={{
                    color: defaultSystemTextColor
                  }}
                >
                  Taskbar background color
                </label>
                <label
                  className='text-sm font-medium mb-1'
                  style={{
                    color: defaultSystemTextColor
                  }}
                >
                  {settings.taskbar.items.backgroundColor === 'transparent' ? 'rgba(255,255,255,0.0)' : settings.taskbar.backgroundColor}
                </label>
                <ColorPicker
                  format='rgba'
                  defaultValue={settings.taskbar.backgroundColor}
                  onChange={(value) => {
                    setSettings({ ...settings, taskbar: { ...settings.taskbar, backgroundColor: value } })
                  }}
                />
              </div>
            </SimpleGrid>
          </Tabs.Panel >
          <Tabs.Panel className='overflow-y-scroll' value="Window" style={tabPanelStyle}>
            <SimpleGrid cols={2} spacing="md" verticalSpacing="md" >
              <div className='flex flex-col'>
                <label
                  className='text-sm font-medium'
                  style={{
                    color: defaultSystemTextColor
                  }}
                >
                  Window top bar color
                </label>
                <label
                  className='text-sm font-medium mb-1'
                  style={{
                    color: defaultSystemTextColor
                  }}
                >
                  {settings.windowTopBar.color === 'transparent' ? 'rgba(255,255,255,0.0)' : settings.windowTopBar.color}
                </label>
                <ColorPicker
                  format='rgba'
                  defaultValue={settings.windowTopBar.color}
                  onChange={(value) => {
                    setSettings({ ...settings, windowTopBar: { ...settings.windowTopBar, color: value } })
                  }}
                />
              </div>
              <div className='flex flex-col'>
                <label
                  className='text-sm font-medium'
                  style={{
                    color: defaultSystemTextColor
                  }}
                >
                  Window buttons color
                </label>
                <label
                  className='text-sm font-medium mb-1'
                  style={{
                    color: defaultSystemTextColor
                  }}
                >
                  {settings.windowTopBar.items.color === 'transparent' ? 'rgba(255,255,255,0.0)' : settings.windowTopBar.items.color}
                </label>
                <ColorPicker
                  format='rgba'
                  defaultValue={settings.windowTopBar.items.color}
                  onChange={(value) => {
                    setSettings({ ...settings, windowTopBar: { ...settings.windowTopBar, items: { ...settings.windowTopBar.items, color: value } } })
                  }}
                />
              </div>
            </SimpleGrid>
          </Tabs.Panel >
          <Tabs.Panel className='overflow-y-scroll' value="Desktop" style={tabPanelStyle}>
            <SimpleGrid cols={1} spacing="md" verticalSpacing="md" >
              <Checkbox
                label="Use wallpaper"
                defaultChecked={settings.desktop.wallpaper.enabled}
                style={{
                  color: defaultSystemTextColor
                }}
                onChange={(event) => {
                  setSettings({ ...settings, desktop: { ...settings.desktop, wallpaper: { ...settings.desktop.wallpaper, enabled: event.currentTarget.checked } } })
                }}
              />
              <div className='bg-slate-300 flex flex-col w-full h-full items-center justify-center overflow-hidden rounded-md'>
                <CustomText
                  text='Drop your wallpaper here or click to select a file'
                  className='text-lg text-gray-500 font-semibold -mb-12'
                  style={{
                    color: defaultSystemTextColor
                  }}
                />
                <Dropzone
                  onDrop={(files) => {
                    console.log('dropped files', files)
                    if (files.length > 0) {
                      const file = files[0]
                      const reader = new FileReader()
                      reader.onloadend = () => {
                        const base64data = reader.result
                        setWallpaper(base64data as string)
                        setSettings({
                          ...settings, desktop: {
                            ...settings.desktop,
                            wallpaper: {
                              ...settings.desktop.wallpaper, image64: base64data as string
                            }
                          }
                        })
                      }
                      reader.readAsDataURL(file)
                    }

                  }}
                  onReject={(files) => console.log('rejected files', files)}
                  accept={IMAGE_MIME_TYPE}
                  className='rounded-md w-full h-full'
                  style={{
                    backgroundImage: `url(${wallpaper})`,
                  }}
                >
                  <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: 'none' }}>
                    <Dropzone.Accept>
                      <IconUpload
                        style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-blue-6)' }}
                        stroke={1.5}
                      />
                    </Dropzone.Accept>
                    <Dropzone.Reject>
                      <IconX
                        style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-red-6)' }}
                        stroke={1.5}
                      />
                    </Dropzone.Reject>
                    <Dropzone.Idle>
                      <IconPhoto
                        style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-dimmed)' }}
                        stroke={1.5}
                      />
                    </Dropzone.Idle>
                  </Group>
                </Dropzone>
              </div>
              <SimpleGrid cols={2} spacing="md" verticalSpacing="md"  >
                <div className='flex flex-col'>
                  <label
                    className='text-sm font-medium'
                    style={{
                      color: defaultSystemTextColor
                    }}
                  >
                    Desktop Icons text color
                  </label>
                  <label
                    className='text-sm font-medium mb-1'
                    style={{
                      color: defaultSystemTextColor
                    }}
                  >
                    {settings.desktop.desktopIcon.textColor === 'transparent' ? 'rgba(255,255,255,0.0)' : settings.desktop.desktopIcon.textColor}
                  </label>
                  <ColorPicker
                    format='rgba'
                    defaultValue={settings.desktop.desktopIcon.textColor}
                    onChange={(value) => {
                      setSettings({ ...settings, desktop: { ...settings.desktop, desktopIcon: { ...settings.desktop.desktopIcon, textColor: value } } })
                    }}
                  />
                </div>
              </SimpleGrid>
            </SimpleGrid>
          </Tabs.Panel >
          <Tabs.Panel className='overflow-y-scroll' value="StartMenu" style={tabPanelStyle} >
            <SimpleGrid cols={2} spacing="md" verticalSpacing="md" >
              <Checkbox
                label="Order by name"
                checked={settings.startMenu.ordered}
                onChange={(event) => {
                  setSettings({ ...settings, startMenu: { ...settings.startMenu, ordered: event.currentTarget.checked } })
                }}
                style={{
                  color: defaultSystemTextColor
                }}
              />
              <Checkbox
                label="Enable search"
                defaultChecked={settings.startMenu.searchInput.disabled}

                onChange={(event) => {
                  setSettings({ ...settings, startMenu: { ...settings.startMenu, searchInput: { ...settings.startMenu.searchInput, disabled: event.currentTarget.checked } } })
                }}
                style={{
                  color: defaultSystemTextColor
                }}
              />
              <div className='flex flex-col'>
                <label
                  className='text-sm font-medium'
                  style={{
                    color: defaultSystemTextColor
                  }}
                >
                  Start Menu background
                </label>
                <label
                  className='text-sm font-medium mb-1'
                  style={{
                    color: defaultSystemTextColor
                  }}
                >
                  {settings.startMenu.background === 'transparent' ? 'rgba(255,255,255,0.0)' : settings.startMenu.background}
                </label>
                <ColorPicker
                  format='rgba'
                  defaultValue={settings.startMenu.background}
                  onChange={(value) => {
                    setSettings({ ...settings, startMenu: { ...settings.startMenu, background: value } })
                  }}
                />
              </div>
              <div className='flex flex-col mt-1'>
                <label
                  className='text-sm font-medium'
                  style={{
                    color: defaultSystemTextColor
                  }}
                >
                  Start menu text color
                </label>
                <label
                  className='text-sm font-medium mb-1'
                  style={{
                    color: defaultSystemTextColor
                  }}
                >
                  {settings.startMenu.textColor === 'transparent' ? 'rgba(255,255,255,0.0)' : settings.startMenu.textColor}
                </label>
                <ColorPicker
                  format='rgba'
                  defaultValue={settings.startMenu.textColor}
                  onChange={(value) => {
                    setSettings({ ...settings, startMenu: { ...settings.startMenu, textColor: value } })
                  }}
                />
              </div>
              <div className='flex flex-col'>
                <label
                  className='text-sm font-medium'
                  style={{
                    color: defaultSystemTextColor
                  }}
                >
                  Input background color
                </label>
                <label
                  className='text-sm font-medium mb-1'
                  style={{
                    color: defaultSystemTextColor
                  }}
                >
                  {settings.startMenu.searchInput.background === 'transparent' ? 'rgba(255,255,255,0.0)' : settings.startMenu.searchInput.background}
                </label>
                <ColorPicker
                  format='rgba'
                  defaultValue={settings.startMenu.searchInput.background}
                  onChange={(value) => {
                    setSettings({ ...settings, startMenu: { ...settings.startMenu, searchInput: { ...settings.startMenu.searchInput, background: value } } })
                  }}
                />
              </div>
              <div className='flex flex-col'>
                <label
                  className='text-sm font-medium'
                  style={{
                    color: defaultSystemTextColor
                  }}
                >
                  Start menu search text color
                </label>
                <label
                  className='text-sm font-medium mb-1'
                  style={{
                    color: defaultSystemTextColor
                  }}
                >
                  {settings.startMenu.searchInput.textColor === 'transparent' ? 'rgba(255,255,255,0.0)' : settings.startMenu.searchInput.textColor}
                </label>
                <ColorPicker
                  format='rgba'
                  defaultValue={settings.startMenu.searchInput.textColor}
                  onChange={(value) => {
                    setSettings({ ...settings, startMenu: { ...settings.startMenu, searchInput: { ...settings.startMenu.searchInput, textColor: value } } })
                  }}
                />
              </div>
            </SimpleGrid>
          </Tabs.Panel >
          <Tabs.Panel className='overflow-y-scroll' value="Clock" style={tabPanelStyle}>
            <SimpleGrid cols={2} spacing="md" verticalSpacing="md" >
              <Checkbox
                label="Enabled"
                checked={!settings.system.clock.disabled}
                disabled
                onChange={(event) => {
                  setSettings({ ...settings, system: { ...settings.system, clock: { ...settings.system.clock, disabled: event.currentTarget.checked } } })
                }}
              />
              <Checkbox
                label="Show seconds"
                checked={settings.system.clock.showSeconds}
                onChange={(event) => {
                  setSettings({ ...settings, system: { ...settings.system, clock: { ...settings.system.clock, showSeconds: event.currentTarget.checked } } })
                }}
              />
              <Select
                label='Clock Format'
                placeholder='Clock Format'
                data={['12', '24']}
                defaultValue={settings.system.clock.format}
                onChange={(value) => {
                  if (!value) return
                  setSettings({ ...settings, system: { ...settings.system, clock: { ...settings.system.clock, format: value.toLowerCase() as '24' | '12' } } })
                }}
              />
            </SimpleGrid>
          </Tabs.Panel >
          <Tabs.Panel className='overflow-y-scroll' value="System" style={tabPanelStyle}>
            <SimpleGrid cols={3} spacing="md" verticalSpacing="md" >
              <div className='flex flex-col'>
                <label
                  className='text-sm font-medium'
                  style={{
                    color: defaultSystemTextColor
                  }}
                >
                  System default background color
                </label>
                <label
                  className='text-sm font-medium mb-1'
                >
                  {settings.system.systemBackgroundColor === 'transparent' ? 'rgba(255,255,255,0.0)' : settings.system.systemBackgroundColor}
                </label>
                <ColorPicker
                  format='rgba'
                  defaultValue={settings.system.systemBackgroundColor}
                  onChange={(value) => {
                    setSettings({ ...settings, system: { ...settings.system, systemBackgroundColor: value } })
                  }}
                />
              </div>
              <div className='flex flex-col'>
                <label
                  className='text-sm font-medium'
                  style={{
                    color: defaultSystemTextColor
                  }}
                >
                  System default highlight color
                </label>
                <label
                  className='text-sm font-medium mb-1'
                >
                  {settings.system.systemHighlightColor === 'transparent' ? 'rgba(255,255,255,0.0)' : settings.system.systemHighlightColor}
                </label>
                <ColorPicker
                  format='rgba'
                  defaultValue={settings.system.systemHighlightColor}
                  onChange={(value) => {
                    setSettings({ ...settings, system: { ...settings.system, systemHighlightColor: value } })
                  }}
                />
              </div>
              <div className='flex flex-col'>
                <label
                  className='text-sm font-medium'
                  style={{
                    color: defaultSystemTextColor
                  }}
                >
                  System default text color
                </label>
                <label
                  className='text-sm font-medium mb-1'
                >
                  {settings.system.systemTextColor === 'transparent' ? 'rgba(255,255,255,0.0)' : settings.system.systemTextColor}
                </label>
                <ColorPicker
                  format='rgba'
                  defaultValue={settings.system.systemTextColor}
                  onChange={(value) => {
                    setSettings({ ...settings, system: { ...settings.system, systemTextColor: value } })
                  }}
                />
              </div>

            </SimpleGrid>
          </Tabs.Panel >
        </Tabs>
      </div>
    </DefaultWindow>
  )
}

export default Settings