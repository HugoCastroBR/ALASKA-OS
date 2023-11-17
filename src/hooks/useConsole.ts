import { ConsoleCommands } from "@/types/system";
import { useState } from "react";

export default function useConsole() {
  
  const [history, setHistory] = useState<string[]>([])

  function  getFlags (args:string[]) {
    const flags = args.filter((arg:string) => arg.startsWith('-'));
    return flags;
  }


  function getArgs(args:string[]) {
    const flags = getFlags(args);
    const argsWithoutFlags = args.filter((arg:string) => !flags.includes(arg));
    return argsWithoutFlags;
  }

  function AddToHistory(command:string) {
    setHistory([...history, command]);
  }


  return {
    history,
    AddToHistory,
  };
}