import { tabStateProps, windowStateProps } from "./windows"

export type programProps = {
  tab: tabStateProps
  window: windowStateProps
}

export type consoleProps = programProps & {
  vanilla?: boolean
  interceptBrowserConsole?: boolean
}

export type explorerProps = programProps & {
  previousPath?: string
  onBack?: () => void
}


export type explorerActionBarProps = {
  path: string
  onBack: () => void
  onReload: () => void
}

export type ImageReaderProps = programProps & {
  path: string
} 

export type MusicProps = {
  title: string
  artist: string
  cover: string
  musicFile: File
  duration: number
}

export type MusicItemProps = {
  title: string
  artist: string
  cover: string
  musicFile: File
  duration: number
  currentPlaying?: boolean
  onClick?: (music:MusicProps) => void
}