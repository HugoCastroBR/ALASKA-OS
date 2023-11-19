export type mouseContextMenuOptionsProps = {
  title: string
  disabled?: boolean
  className?: string
  onClick?: () => void
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