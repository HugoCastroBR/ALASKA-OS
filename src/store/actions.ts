import { windowStateProps, tabStateProps } from '@/types/windows';
import { AppActions, WindowsActions,FileActions,MouseActions,MusicsActions,SystemActions,SettingsActions } from './index';
import { MusicProps } from '@/types/programs';
import { SettingsProps } from '@/types/settings';
import { SystemNotificationType } from '@/types/system';


export const SetGlobalVolumeMultiplier = (value: number) => {
  return SystemActions.SET_GLOBAL_VOLUME_MULTIPLIER(value)
}
export const SetIsSystemLoaded = (value: boolean) => {
  return SystemActions.SET_IS_SYSTEM_LOADED(value)
}
export const CallNotification = (value:SystemNotificationType ) => {
  return SystemActions.SET_NOTIFICATION(value)
}
export const ClearNotification = () => {
  return SystemActions.CLEAR_NOTIFICATION()
}

export const SettingsSetSettings = (value: SettingsProps) => {
  console.log('SettingsSetSettingsDispatch')
  return SettingsActions.SET_SETTINGS(value)
}
export const SetTaskBarPosition = (value: "top" | "bottom" | "left" | "right") => {
  return SettingsActions.SET_TASKBAR_POSITION(value)
}
export const SetWindowTopBarColor = (value: string) => {
  return SettingsActions.SET_WINDOW_TOP_BAR_COLOR(value)
}
export const SetWindowTopBarItemsColor = (value: string) => {
  return SettingsActions.SET_WINDOW_TOP_BAR_ITEMS_COLOR(value)
}
export const SetTaskBarShowOnHover = (value: boolean) => {
  return SettingsActions.SET_TASKBAR_SHOW_ON_HOVER(value)
}
export const SetTaskBarHideSoundController = (value: boolean) => {
  return SettingsActions.SET_TASKBAR_HIDE_SOUND_CONTROLLER(value)
}
export const SetStartMenuBackground = (value: string) => {
  return SettingsActions.SET_START_MENU_BACKGROUND(value)
}
export const SetStartMenuOrdered = (value: boolean) => {
  return SettingsActions.SET_START_MENU_ORDERED(value)
}
export const SetStartMenuSearchInputDisabled = (value: boolean) => {
  return SettingsActions.SET_START_MENU_SEARCH_INPUT_DISABLED(value)
}
export const SetStartMenuSearchInputBackground = (value: string) => {
  return SettingsActions.SET_START_MENU_SEARCH_INPUT_BACKGROUND(value)
}
export const SetStartMenuSearchInputTextColor = (value: string) => {
  return SettingsActions.SET_START_MENU_SEARCH_INPUT_TEXT_COLOR(value)
}
export const SetSystemClockDisabled = (value: boolean) => {
  return SettingsActions.SET_SYSTEM_CLOCK_DISABLED(value)
}
export const SetSystemClockFormat = (value: "12" | "24") => {
  return SettingsActions.SET_SYSTEM_CLOCK_FORMAT(value)
}

export const SetSystemClockShowSeconds = (value: boolean) => {
  return SettingsActions.SET_SYSTEM_CLOCK_SHOW_SECONDS(value)
}




export const SetNotification = (value: boolean) => {
  return AppActions.SET_NOTIFICATION(value)
}
export const SetNotificationMessage = (value: string) => {
  return AppActions.SET_NOTIFICATION_MESSAGE(value)
}
export const AppHandlerNotification = (title:string,message:string) => {
  return AppActions.HANDLER_NOTIFICATION({title,message})
}

export const WindowAddWindow = (payload:windowStateProps) => {
  return WindowsActions.ADD_WINDOW(payload)
}
export const WindowRemoveWindow = (title:string) => {
  return WindowsActions.REMOVE_WINDOW(title)
}
export const WindowAddTab = (payload:{title:string,tab:tabStateProps}) => {
  return WindowsActions.ADD_TAB(payload)
}
export const WindowRemoveTab = (payload:{title:string,uuid:string}) => {
  return WindowsActions.REMOVE_TAB(payload)
}
export const WindowToggleMaximizeTab = (payload:{title:string,uuid:string}) => {
  return WindowsActions.TOGGLE_MAXIMIZE_TAB(payload)
}
export const WindowToggleMinimizeTab = (payload:{title:string,uuid:string}) => {
  return WindowsActions.TOGGLE_MINIMIZE_TAB(payload)
}
export const WindowSetTabTitle = (payload:{title:string,uuid:string,newTitle:string}) => {
  return WindowsActions.SET_TAB_TITLE(payload)
}
export const WindowSetTabFocused = (payload:{title:string,uuid:string}) => {
  return WindowsActions.SET_TAB_FOCUSED(payload)
}
export const ClearAllFocused = () => {
  return WindowsActions.CLEAR_ALL_FOCUSED_TABS()
}
export const CloseALLTabsFromAllWindows = () => {
  return WindowsActions.CLOSE_ALL_TABS_FROM_ALL_WINDOWS()
}
export const PutTabInSecondPlan = (payload:{title:string,uuid:string}) => {
  return WindowsActions.PUT_TAB_IN_SECOND_PLAN(payload)
}
export const PutTabInFirstPlan = (payload:{title:string,uuid:string}) => {
  return WindowsActions.PUT_TAB_IN_FIRST_PLAN(payload)
}
export const RemoveTabByUuid = (payload:{uuid:string}) => {
  return WindowsActions.REMOVE_TAB_BY_UUID(payload)
}

export const AddSelectedFile = (payload:string) => {
  return FileActions.ADD_SELECTED_FILE(payload)
}
export const RemoveSelectedFile = (payload:string) => {
  return FileActions.REMOVE_SELECTED_FILE(payload)
}
export const ClearFiles = () => {
  return FileActions.CLEAR_FILES()
}
export const SetIsRename = (payload:boolean) => {
  return FileActions.SET_IS_RENAME(payload)
}
export const SetIsNewFile = (payload:boolean) => {
  return FileActions.SET_IS_NEW_FILE(payload)
}
export const SetIsNewFolder = (payload:boolean) => {
  return FileActions.SET_IS_NEW_FOLDER(payload)
}
export const SetCopiedFiles = () => {
  return FileActions.SET_COPIED_FILES()
}

export const SetMousePath = (payload:string) => {
  return MouseActions.SET_MOUSE_PATH(payload)
}
export const SetMouseInDesktop = (payload:boolean) => {
  return MouseActions.SET_MOUSE_IN_DESKTOP(payload)
}


export const AddMusic = (payload:MusicProps) => {
  return MusicsActions.ADD_MUSIC(payload)
}
export const SetMusics = (payload:MusicProps[]) => {
  return MusicsActions.SET_MUSICS(payload)
}
export const SetCurrentMusicIndex = (payload:number) => {
  return MusicsActions.SET_CURRENT_MUSIC_INDEX(payload)
}
export const SetIsPlaying = (payload:boolean) => {
  return MusicsActions.SET_IS_PLAYING(payload)
}
export const SetIsShuffle = (payload:boolean) => {
  return MusicsActions.SET_IS_SHUFFLE(payload)
}
export const SetIsRepeat = (payload:boolean) => {
  return MusicsActions.SET_IS_REPEAT(payload)
}
export const SetIsMuted = (payload:boolean) => {
  return MusicsActions.SET_IS_MUTED(payload)
}
export const SetVolume = (payload:number) => {
  return MusicsActions.SET_VOLUME(payload)
}
export const SetProgress = (payload:number) => {
  return MusicsActions.SET_PROGRESS(payload)
}
export const SetDuration = (payload:number) => {
  return MusicsActions.SET_DURATION(payload)
}
export const SetCurrentMusic = (payload:MusicProps) => {
  return MusicsActions.SET_CURRENT_MUSIC(payload)
}
export const SetIsPaused = (payload:boolean) => {
  return MusicsActions.SET_IS_PAUSED(payload)
}
export const SetNextMusic = () => {
  return MusicsActions.SET_NEXT_MUSIC()
}
export const SetPreviousMusic = () => {
  return MusicsActions.SET_PREVIOUS_MUSIC()
}
export const AddToQueue = (payload:MusicProps) => {
  return MusicsActions.ADD_MUSIC_TO_QUEUE(payload)
}
export const RemoveFromQueue = (payload:MusicProps) => {
  return MusicsActions.REMOVE_MUSIC_FROM_QUEUE(payload)
}
export const ClearMusic = () => {
  return MusicsActions.CLEAR_MUSIC()
}
export const SetCurrentPlayingIndex = (payload:number) => {
  return MusicsActions.SET_CURRENT_PLAYING_INDEX(payload)
}
export const MusicClearEverything = () => {
  return MusicsActions.CLEAR_EVERYTHING()
}