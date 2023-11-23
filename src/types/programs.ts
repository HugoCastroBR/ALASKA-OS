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
  uuid: string
  title: string
  artist: string
  cover: string
  musicFile: File | null
  duration: number
}

export type MusicItemProps = {
  index: number
  music: MusicProps
  onClick?: (music:MusicProps) => void
}