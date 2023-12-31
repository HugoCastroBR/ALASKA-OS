import { Command, CommandAction, CommandArgs } from "@/types/system";
import { useEffect, useState } from "react";
import useFS from "./useFS";
import { basePath } from "@/utils/constants";
import { ApiError } from "browserfs/dist/node/core/api_error";
import { convertSizeToKBMBGB, uuid, verifyIfIsFile } from "@/utils/file";
import useStore from "./useStore";
import { WindowAddTab, WindowRemoveTab, WindowRemoveWindow } from "@/store/actions";
export default function useCommands() {
  
  const [history, setHistory] = useState<string[]>([])
  const [commandQueue, setCommandQueue] = useState<string[]>([]);
  const [currentDirectory, setCurrentDirectory] = useState<string>(basePath);
  const [currentDirectoryItems , setCurrentDirectoryItems] = useState<string[]>([]);


  const {fs} = useFS();
  const {states, dispatch} = useStore();

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
      const { command, args, vanillaCommand } = parsedCommand;
  
      if (commands[command]) {
        commands[command].execute(args, vanillaCommand);
      } else {
        const errorMessage = `${command} is not a valid command`;
        setHistory([...history, errorMessage]);
  
        // Display the description if available
        if (commands[command] && commands[command].description) {
          setHistory([...history, `Description: ${commands[command].description}`]);
        }
      }
    }
  };

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
      fs?.mkdir(destination, (err:ApiError) => {
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

  const Count = (args:CommandArgs,vanillaCommand?:string[]) => {
     // count amount of lines of the path
    fs?.readFile(currentDirectory + "/" + Object.keys(args || {})[0],'utf8', (err, data) => {
      console.log(data)
      if(err) {
        setHistory([...history, "Error counting lines"]);
        setHistory([...history, err.message]);
        return;
      }
      if(data === undefined) return;
      const lines = data.split('\n');
      setHistory([...history, lines.length.toString()]);
    });
  }

  const Cat = (args:CommandArgs,vanillaCommand?:string[]) => {
    const itemToRead = (currentDirectory + "/" + Object.keys(args || {})[0]).replaceAll("//", "/")
    fs?.readFile(itemToRead,'utf8', (err, data) => {
      if(err) {
        setHistory([...history, "Error reading file"]);
        setHistory([...history, err.message]);
        return;
      }
      if(data === undefined) return;
      setHistory([...history, data]);
    });
  }

  const Time = (args:CommandArgs,vanillaCommand?:string[]) => {
    const currentTime = new Date();
    setHistory([...history, currentTime.toLocaleTimeString()]);
  }

  const GetDate = (args:CommandArgs,vanillaCommand?:string[]) => {
    const currentDate = new Date();
    setHistory([...history, currentDate.toString()]);
  }

  const Head = (args:CommandArgs,vanillaCommand?:string[]) => {
    const itemToRead = (currentDirectory + "/" + Object.keys(args || {})[0]).replaceAll("//", "/")
    fs?.readFile(itemToRead,'utf8', (err, data) => {
      if(err) {
        setHistory([...history, "Error reading file"]);
        setHistory([...history, err.message]);
        return;
      }
      if(data === undefined) return;
      const lines = data.split('\n');
      setHistory([...history, lines[0]]);
    });
  }

  const Tail = (args:CommandArgs,vanillaCommand?:string[]) => {
    const itemToRead = (currentDirectory + "/" + Object.keys(args || {})[0]).replaceAll("//", "/")
    fs?.readFile(itemToRead,'utf8', (err, data) => {
      if(err) {
        setHistory([...history, "Error reading file"]);
        setHistory([...history, err.message]);
        return;
      }
      if(data === undefined) return;
      const lines = data.split('\n');
      setHistory([...history, lines[lines.length - 1]]);
    });
  }

  const Close = (args:CommandArgs,vanillaCommand?:string[]) => {
    dispatch(WindowRemoveWindow('Console'))
  }

  const Exit = (args:CommandArgs,vanillaCommand?:string[]) => {
    dispatch(WindowRemoveWindow('Console'))
  }

  const Code = (args:CommandArgs,vanillaCommand?:string[]) => {
    const itemToOpen = (currentDirectory + "/" + Object.keys(args || {})[0]).replaceAll("//", "/")
    dispatch(WindowAddTab({
      title: 'Code Editor',
      tab:{
        maximized: false,
        minimized: false,
        focused: true,
        title: 'Code Editor',
        ficTitle: Object.keys(args || {})[0],
        uuid: uuid(6),
        value: itemToOpen,
      }
    }))
  }

  const Help = (args: CommandArgs, vanillaCommand?: string[]) => {
    const newHistory: string[] = ["Available commands:"];
  
    Object.entries(commands).forEach(([key, value]) => {
      setHistory([...history, `${key} - ${value.description}`]);
      newHistory.push(`${key} - ${value.description}`);
    });
  
    // Use join to create a single string with line breaks
    const formattedOutput = newHistory.join('\n');
  
    setHistory([...history, formattedOutput]);
  };

  const commands: CommandAction = {
    clear: {
      execute: (args) => {
        ClearConsole(args);
      },
      description: "Clears the console",
    },
    cls: {
      execute: (args) => {
        ClearConsole(args);
      },
      description: "Clears the console (similar to 'clear')",
    },
    cd: {
      execute: (args) => {
        ChangeDirectory(args);
      },
      description: "Changes the current directory",
    },
    ls: {
      execute: (args) => {
        ListDirectory(args);
      },
      description: "Lists the contents of the directory",
    },
    pwd: {
      execute: (args) => {
        PrintWorkingDirectory(args);
      },
      description: "Prints the current working directory",
    },
    mkdir: {
      execute: (args) => {
        MakeDirectory(args);
      },
      description: "Creates a new directory",
    },
    rm: {
      execute: (args) => {
        RemoveDirectory(args);
      },
      description: "Removes a directory",
    },
    touch: {
      execute: (args) => {
        Touch(args);
      },
      description: "Creates a new empty file",
    },
    mv: {
      execute: (args, vanillaCommand) => {
        Move(args, vanillaCommand);
      },
      description: "Moves a file or directory",
    },
    cp: {
      execute: (args, vanillaCommand) => {
        Copy(args, vanillaCommand);
      },
      description: "Copies a file or directory",
    },
    rename: {
      execute: (args, vanillaCommand) => {
        Rename(args, vanillaCommand);
      },
      description: "Renames a file or directory",
    },
    dp: {
      execute: (args, vanillaCommand) => {
        Duplicate(args, vanillaCommand);
      },
      description: "Duplicates a file or directory",
    },
    size: {
      execute: (args, vanillaCommand) => {
        Size(args, vanillaCommand);
      },
      description: "Displays the size of a file or directory",
    },
    count: {
      execute: (args, vanillaCommand) => {
        Count(args, vanillaCommand);
      },
      description: "Counts the number of files in a directory",
    },
    cat: {
      execute: (args, vanillaCommand) => {
        Cat(args, vanillaCommand);
      },
      description: "Displays the contents of a file",
    },
    time: {
      execute: (args, vanillaCommand) => {
        Time(args, vanillaCommand);
      },
      description: "Displays the current time",
    },
    date: {
      execute: (args, vanillaCommand) => {
        GetDate(args, vanillaCommand);
      },
      description: "Displays the current date",
    },
    head: {
      execute: (args, vanillaCommand) => {
        Head(args, vanillaCommand);
      },
      description: "Displays the first lines of a file",
    },
    tail: {
      execute: (args, vanillaCommand) => {
        Tail(args, vanillaCommand);
      },
      description: "Displays the last lines of a file",
    },
    close: {
      execute: (args, vanillaCommand) => {
        Close(args, vanillaCommand);
      },
      description: "Closes the application",
    },
    exit: {
      execute: (args, vanillaCommand) => {
        Exit(args, vanillaCommand);
      },
      description: "Exits the command environment",
    },
    code: {
      execute: (args, vanillaCommand) => {
        Code(args, vanillaCommand);
      },
      description: "Opens a code editor",
    },
    help: {
      execute: (args, vanillaCommand) => {
        Help(args, vanillaCommand);
      },
      description: "Displays the available commands",
    },
  };



  return {
    history,
    setHistory,
    currentDirectory,
    runCommand,
    commands,
  };
}