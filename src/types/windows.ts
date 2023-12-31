export type tabStateProps = {
  uuid: string
  title: string
  maximized: boolean
  minimized: boolean
  originPath?: string
  ficTitle?: string
  focused?: boolean
  content?: string
  value?: string
  url?: string
  extension?: string
  local?: boolean
  secondPlan?: boolean
}


export type windowStateProps = {

  title: string
  icon?: string
  showOnDesktop: boolean
  tabs: tabStateProps[]
}