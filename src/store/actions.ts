import { windowStateProps, tabStateProps } from '@/types/windows';
import { AppActions, WindowsActions,FileActions,MouseActions,MusicsActions } from './index';
import { MusicProps } from '@/types/programs';



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