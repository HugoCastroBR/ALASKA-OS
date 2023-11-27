



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

