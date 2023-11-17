import { Command, CommandAction, CommandArgs } from "@/types/system";
import { useEffect, useState } from "react";
import useFS from "./useFS";
import { basePath } from "@/utils/constants";
import { ApiError } from "browserfs/dist/node/core/api_error";
import { convertSizeToKBMBGB, verifyIfIsFile } from "@/types/file";
export default function useCommands() {
  
  const [history, setHistory] = useState<string[]>([])
  const [commandQueue, setCommandQueue] = useState<string[]>([]);
  const [currentDirectory, setCurrentDirectory] = useState<string>(basePath);
  const [currentDirectoryItems , setCurrentDirectoryItems] = useState<string[]>([]);


  const {fs} = useFS();

  useEffect(() => {
    if(fs){      
      fs.readdir(currentDirectory, (err, files) => {
        if(err) {
          setHistory([...history, "Error reading directory"]);
          return;
        }
      });
    }else{
      setHistory([...history, "File system not loaded"]);
    }
  }, [fs]);
  
  useEffect(() => {
    setHistory([...history, currentDirectoryItems.join(" ")]);
  }, [currentDirectoryItems]);
  
  function parseCommand(input: string): Command | null {
    setHistory([...history, input]);
    const parts = input.split(/\s+/)
    const command = parts[0];
    const args: { [key: string]: string } = {};
    if(command === "") return null;
    if(parts.length === 2) return { command, args: { [parts[1]]: " " } };
  
    let currentKey: string | null = null;
  
    for (let i = 1; i < parts.length; i++) {
      const part = parts[i];
      
      if (part.startsWith("-")) {
        currentKey = part;
        args[currentKey] = " ";
      } else if (currentKey) {

        args[currentKey] = part;
        currentKey = null;
      }
    }
    const vanillaCommand = parts.filter((part) => !part.startsWith("-"));
    return { command, args, vanillaCommand };
  }



  const processCommand = (command: string) => {
    const parsedCommand = parseCommand(command);
    if (parsedCommand) {
      const { command, args,vanillaCommand } = parsedCommand;
      if (commands[command]) {
        commands[command](args,vanillaCommand);
      } else {
        setHistory([...history, `${command} is not a valid command`]);
      }
    }
  }

  const runCommand = (command: string) => {
    setCommandQueue([...commandQueue, command]);
  }

  useEffect(() => {
    if (commandQueue.length > 0) {
      const command = commandQueue[0];
      processCommand(command);
      setCommandQueue(commandQueue.slice(1));
    }
  }, [commandQueue]);
  



  const ClearConsole = (args:CommandArgs) => {
    if(Object.keys(args || {}).length > 0 && args !== undefined) {
      if(args["-all"]) {
        setHistory([]);
      }
      if(args["-last"] ) {
        if(parseInt(args["-last"] || args["-l"]) > history.length){
          setHistory([...history, "Cannot remove more than history length"]);
          return;
        }
        if(parseInt(args["-last"] ) < 0 || args["-last"] === ' '){
          setHistory([...history, "Cannot remove less than 0"]);
          return;
        }
        setHistory(history.slice(0, history.length - parseInt(args["-last"])));
      }
      if(args["-first"]) {
        if(parseInt(args["-first"]) > history.length){
          setHistory([...history, "Cannot remove more than history length"]);
          return;
        }
        if(parseInt(args["-first"]) < 0 || args["-first"] === ' '){
          setHistory([...history, "Cannot remove less than 0"]);
          return;
        }
        setHistory(history.slice(parseInt(args["-first"]), history.length));
      }
    } else {
      setHistory([]);
    }
  }

  function removeLastDirectory(path: string): string {
    const lastIndex = path.lastIndexOf('/');
    return path.substring(0, lastIndex);
  }
  const ChangeDirectory = (args:CommandArgs) => {
    if(Object.keys(args || {}).length > 0 && args !== undefined) {
      if(args["-path"]){
        ClearConsole({});
        setCurrentDirectory(args["-path"]);
      }
    }else{
      console.log("idk")
    }
    if(Object.keys(args || {}).length > 0 ){
      ClearConsole({});
      const path = Object.keys(args || {})[0];
      if(path === ".."){
        if(currentDirectory.split("/").slice(0, -1).join("/") === '') {
          console.log("a")
          setCurrentDirectory(basePath);
          return;
        }
        setCurrentDirectory(removeLastDirectory(currentDirectory));
      }
      else{
        setCurrentDirectory((currentDirectory + "/" + path).replaceAll("//", "/" ));
      }
    }
  }

  const ListDirectory = (args:CommandArgs) => {
    if(Object.keys(args || {}).length > 0 && args !== undefined) {
      if(args["-all"]){
        fs?.readdir(currentDirectory, (err, files) => {
          if(err) {
            setHistory([...history, "Error reading directory"]);
            setHistory([...history, err.message]);
            return;
          }
          if(files !== undefined){
            setCurrentDirectoryItems(files);
          }
        });
      }
      if(args["-path"]){
        fs?.readdir(args["-path"], (err, files) => {
          if(err) {
            setHistory([...history, "Error reading directory"]);
            setHistory([...history, err.message]);
            return;
          }
          if(files !== undefined){
            setCurrentDirectoryItems(files);
          }
        });
      }
    }else{
      
      fs?.readdir(currentDirectory, (err, files) => {
        if(err) {
          setHistory([...history, "Error reading directory"]);
          setHistory([...history, err.message]);
          return;
        }
        if(files !== undefined){
          setCurrentDirectoryItems(files);
        }
      });
    }
  }

  const PrintWorkingDirectory = (args:CommandArgs) => {
    if(Object.keys(args || {}).length > 0 && args !== undefined) {
      if(args["-path"]){
        setHistory([...history, args["-path"]]);
      }
    }else{
      setHistory([...history, currentDirectory]);
    }
  }

  const MakeDirectory = (args:CommandArgs) => {
    if(Object.keys(args || {}).length > 0 && args !== undefined) {
      if(args["-path"]){
        fs?.mkdir(args["-path"], (err:ApiError) => {
          if(err) {
            setHistory([...history, "Error creating directory"]);
            setHistory([...history, err.message]);
            return;
          }
        });
      }else{
        //make in the current directory
        fs?.mkdir(currentDirectory + "/" + Object.keys(args || {})[0], (err:ApiError) => {
          if(err) {
            setHistory([...history, "Error creating directory"]);
            setHistory([...history, err.message]);
            return;
          }
          else{
            setHistory([...history, "Directory created"]);
          }
        });
      }
    }else{
      setHistory([...history, currentDirectory]);
    }
  }

  const RemoveDirectory = (args:CommandArgs) => {
    if(Object.keys(args || {}).length > 0 && args !== undefined) {
      if(args["-path"]){
        fs?.rmdir(args["-path"],(err) => {
          if(err?.code === "ENOTDIR"){
            fs?.unlink(currentDirectory + "/" + Object.keys(args || {})[0], (err) => {
              if(err) {
                setHistory([...history, "Error removing file"]);
                setHistory([...history, err.message]);
                return;
              }
              setHistory([...history, "File removed"]);
            });
            return;
          }
          if(err?.code === "ENOTEMPTY"){
            setHistory([...history, "Directory not empty"]);
            setHistory([...history, err.message]);
            return;
          }
          else{
            setHistory([...history, "Directory removed"]);
          }
          
        });
      }else{
        //make in the current directory
        fs?.rmdir(currentDirectory + "/" + Object.keys(args || {})[0], (err) => {
          if(err?.code === "ENOTDIR"){
            fs?.unlink(currentDirectory + "/" + Object.keys(args || {})[0], (err) => {
              if(err) {
                setHistory([...history, "Error removing file"]);
                setHistory([...history, err.message]);
                return;
              }
              setHistory([...history, "File removed"]);
            });
            return;
          }
          if(err?.code === "ENOTEMPTY"){
            setHistory([...history, "Directory not empty"]);
            setHistory([...history, err.message]);
            return;
          }
          setHistory([...history, "Directory removed"]);
        });
      }
    }else{
      setHistory([...history, currentDirectory]);
    }
  }

  const Touch = (args:CommandArgs) => {
    if(Object.keys(args || {}).length > 0 && args !== undefined) {
      if(args["-path"]){
        fs?.writeFile(args["-path"], "", (err) => {
          if(err) {
            setHistory([...history, "Error creating file"]);
            setHistory([...history, err.message]);
            return;
          }
          setHistory([...history, "File created"]);
        });
      }else{
        //make in the current directory
        fs?.writeFile(currentDirectory + "/" + Object.keys(args || {})[0], "", (err) => {
          if(err) {
            setHistory([...history, "Error creating file"]);
            setHistory([...history, err.message]);
            return;
          }
          setHistory([...history, "File created"]);
        });
      }
    }else{
      setHistory([...history, currentDirectory]);
    }
  }

  const Move = (args:CommandArgs,vanillaCommand?:string[]) => {
    if(Object.keys(args || {}).length > 0 && args !== undefined) {
      if(args["-from"] && args["-to"]){
        // full path needed
        const from = (args["-from"]).replaceAll("//", "/")
        const to = (args["-to"]).replaceAll("//", "/")
        fs?.rename(from, to, (err) => {
          if(err) {
            setHistory([...history, "Error moving file"]);
            setHistory([...history, err.message]);
            return;
          }
          setHistory([...history, "File moved"]);
        });
      }

    }else{
      const source = vanillaCommand?.[1];
      const destination = vanillaCommand?.[2];

      const from = (currentDirectory + "/" + source).replaceAll("//", "/");
      const to = (currentDirectory + "/" + destination + "/" + source).replaceAll("//", "/");

      if(source === undefined || destination === undefined){
        setHistory([...history, "Error moving file"]);
        setHistory([...history, "Source or destination not defined"]);
        return;
      }
      fs?.rename(from, to, (err) => {
        if(err) {
          console.log(from,to)
          console.log(err)
          setHistory([...history, "Error moving file"]);
          setHistory([...history, err.message]);
          return;
        }
        setHistory([...history, "File moved"]);
      });
    }
  }

  const copyFile = (source:string,destination:string) => {
    fs?.readFile(source, (err, data) => {
      if(err) {
        setHistory([...history, "Error copying file"]);
        setHistory([...history, err.message]);
        return;
      }
      fs?.writeFile(destination, data, (err) => {
        if(err) {
          setHistory([...history, "Error copying file"]);
          setHistory([...history, err.message]);
          return;
        }
        setHistory([...history, "File copied"]);
      });
    });
  }

  const copyDirectory = (source:string,destination:string) => {
    fs?.readdir(source, (err, files) => {
      if(err) {
        setHistory([...history, "Error copying directory"]);
        setHistory([...history, err.message]);
        return;
      }
      fs?.mkdir(destination, (err) => {
        if(err) {
          setHistory([...history, "Error copying directory"]);
          setHistory([...history, err.message]);
          return;
        }
        files?.forEach((file) => {
          copyFile(source + "/" + file, destination + "/" + file);
        });
      });
    });
  }

  const Copy = (args:CommandArgs,vanillaCommand?:string[]) => {
    if(Object.keys(args || {}).length > 0 && args !== undefined) {
      if(args["-from"] && args["-to"]){
        const itemToCopy = (args["-from"]).replaceAll("//", "/")
        const destination = (args["-to"]).replaceAll("//", "/")
        verifyIfIsFile(itemToCopy) ? copyFile(itemToCopy,destination) : copyDirectory(itemToCopy,destination);
      }
    }else{
      const source = vanillaCommand?.[1];
      const destination = vanillaCommand?.[2];

      const itemToCopy = (currentDirectory + "/" + source).replaceAll("//", "/");
      const destinationPath = (currentDirectory + "/" + destination).replaceAll("//", "/");

      if(source === undefined || destination === undefined){
        setHistory([...history, "Error copying file"]);
        setHistory([...history, "Source or destination not defined"]);
        return;
      }
      verifyIfIsFile(itemToCopy) ? copyFile(itemToCopy,destinationPath) : copyDirectory(itemToCopy,destinationPath);
    }
  }

  const Rename = (args:CommandArgs,vanillaCommand?:string[]) => {
    if(Object.keys(args || {}).length > 0 && args !== undefined) {
      if(args["-path"] && args["-new-name"]){
        // full path needed
        const path = (args["-path"]).replaceAll("//", "/")
        const newName = (args["-new-name"]).replaceAll("//", "/")
        fs?.rename(path, newName, (err) => {
          if(err) {
            setHistory([...history, "Error renaming file"]);
            setHistory([...history, err.message]);
            return;
          }
          setHistory([...history, "File renamed"]);
        });
      }
  }
  else{
    const path = (currentDirectory + "/" + vanillaCommand?.[1]).replaceAll("//", "/")
    const newName = (currentDirectory + "/" + vanillaCommand?.[2]).replaceAll("//", "/")
    fs?.rename(path, newName, (err) => {
      if(err) {
        setHistory([...history, "Error renaming file"]);
        setHistory([...history, err.message]);
        return;
      }
      setHistory([...history, "File renamed"]);
    });
  }
  }

  const Duplicate = (args:CommandArgs,vanillaCommand?:string[]) => {
    if(Object.keys(args || {}).length > 0 && args !== undefined) {
      verifyIfIsFile(args["-path"]) ? copyFile(args["-path"],args["-path"] + "-copy") : copyDirectory(args["-path"],args["-path"] + "-copy");
    }
    else{
      const path = (currentDirectory + "/" + vanillaCommand?.[1]).replaceAll("//", "/")
      verifyIfIsFile(path) ? copyFile(path,path + "-copy") : copyDirectory(path,path + "-copy");
    }
  }

  const Size = (args:CommandArgs,vanillaCommand?:string[]) => {
    if(Object.keys(args || {}).length > 0 && args !== undefined) {
      if(args["-path"]){
        fs?.stat(args["-path"], (err, stats) => {
          if(err) {
            setHistory([...history, "Error getting file size"]);
            setHistory([...history, err.message]);
            return;
          }
          setHistory([...history, stats?.size?.toString() || ""]);
        });
    }
    else{
      const path = (currentDirectory + "/" + Object.keys(args)[0]).replaceAll("//", "/")
      fs?.stat(path, (err, stats) => {
        if(err) {
          setHistory([...history, "Error getting file size"]);
          setHistory([...history, err.message]);
          return;
        }
        setHistory([...history, convertSizeToKBMBGB(stats?.size || 0) || ""]);
      });
    
    }
  }
  
  }

  const commands: CommandAction = {
    clear: (args) => {
      ClearConsole(args);
    },
    cls: (args) => {
      ClearConsole(args);
    },
    cd: (args) => {
      ChangeDirectory(args);
    },
    ls: (args) => {
      ListDirectory(args);
    },
    pwd: (args) => {
      PrintWorkingDirectory(args);
    },
    mkdir: (args) => {
      MakeDirectory(args);
    },
    rm: (args) => {
      RemoveDirectory(args);
    },
    touch: (args) => {
      Touch(args);
    },
    mv: (args,vanillaCommand) => {
      Move(args,vanillaCommand);
    },
    cp: (args,vanillaCommand) => {
      Copy(args,vanillaCommand);
    },
    rename: (args,vanillaCommand) => {
      Rename(args,vanillaCommand);
    },
    dp: (args,vanillaCommand) => {
      Duplicate(args,vanillaCommand);
    },
    size: (args,vanillaCommand) => {
      Size(args,vanillaCommand);
    },
  }


  return {
    history,
    currentDirectory,
    runCommand,
    commands,
  };
}