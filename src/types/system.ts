
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

export type CommandArgs = 
{ [key: string]: string; } | undefined;


export type Command = {
  command: string;
  args: { [key: string]: string };
  vanillaCommand?: string[];
}

export type CommandAction = {
  [key:string]: (args?:{ [key: string]: string },vanillaCommand?:string[]) => void;
}

// export type CommandDict = {
//   [key:string]: {
//     action: (args?:{ [key: string]: string }) => void;
//     description: string;
//   };
// }

