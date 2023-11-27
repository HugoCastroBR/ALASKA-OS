export type mouseContextMenuOptionsProps = {
  title: string
  disabled?: boolean
  className?: string
  left?: React.ReactNode
  onClick?: () => void
  onHover?: () => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}

export type MouseProps = {
  mousePathHistory: string[];
  mousePath: string;
  mouseInDesktop: boolean;
}
export type MouseMenuContext = {
  x: number;
  y: number;
  visible: boolean;
  menuItems?: Array<MenuItem>;
  onRefresh?: () => void;
}

export type MenuItem = {
  label: string;
  onClick: () => void;
  onHover?: () => void;
  onLeave?: () => void;
  disabled?: boolean;
  icon?: string;
}