import { windowStateProps, tabStateProps } from '@/types/windows';
import { AppActions, WindowsActions,FileActions } from './index';



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