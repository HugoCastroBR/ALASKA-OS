import { DefaultWindowProps } from "./containers"
import { tabStateProps, windowStateProps } from "./windows"

export type programProps = {
  tab: tabStateProps
  window: windowStateProps
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