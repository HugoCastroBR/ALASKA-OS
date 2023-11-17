
export type MenuItem = {
  label: string;
  onClick: () => void;
  onHover?: () => void;
  onLeave?: () => void;
  disabled?: boolean;
  icon?: string;
}

export type MouseMenuContext = {
  x: number;
  y: number;
  visible: boolean;
  menuItems?: Array<MenuItem>;
}

export type ConsoleCommands = {
  [key:string]: (args?:string[]) => void;
}

export type ConsoleCommandProps = {
  command: string;
  args: Array<string>;
}

export type ConsoleProps = {
  history: Array<string>;
}