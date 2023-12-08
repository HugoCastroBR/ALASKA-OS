



export type CommandArgs = 
{ [key: string]: string; } | undefined;


export type Command = {
  command: string;
  args: { [key: string]: string };
  vanillaCommand?: string[];
}

export type CommandAction = {
  [key: string]: {
    execute: (args?: { [key: string]: string }, vanillaCommand?: string[]) => void;
    description: string;
  };
};



// export type CommandDict = {
//   [key:string]: {
//     action: (args?:{ [key: string]: string }) => void;
//     description: string;
//   };
// }

export type SystemNotificationType = {
  withCloseButton?: boolean;
  title: string;
  message: string;
}

export type HistoryPathProps = {
  title: string;
  path: string;
}