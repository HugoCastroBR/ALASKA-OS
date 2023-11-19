export type desktopFolderProps = {
  title: string
  icon?: string
  path: string
  onDoubleClick?: () => void
  onClick?: () => void
}