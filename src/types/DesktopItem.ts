export type desktopFileProps = {
  title: string
  path: string
  isProgram?: boolean
  icon?: string
  onDoubleClick?: () => void
  onClick?: () => void
}