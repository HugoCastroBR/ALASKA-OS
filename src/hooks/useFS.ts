import { FSModule } from 'browserfs/dist/node/core/FS';
import * as BrowserFS from 'browserfs';
import { useEffect, useState } from "react";
import { fileToBase64, getExtension, getLastPathSegment, removeTypeFromBase64 } from '@/utils/file';

type useFileSystemProps = {
  fs: FSModule | null;
  isLoadingFS: boolean;
  copyFileByPath: (fromPath:string, toPath:string) => void;
  copyExternalFile: (file:File,toPath:string) => void;
}


const useFS = ():useFileSystemProps => {
  const [fs, setFs] = useState<FSModule | null>(null);
  const [isLoadingFS, setIsLoadingFS] = useState(false);


  useEffect(() => {
    if (!('BrowserFS' in window)) {
      BrowserFS.install(window);
      BrowserFS.configure({
        fs: "IndexedDB",
        options: {},
      }, (e) => {
        if (e) {
          // An error occurred.
          throw e;
        }
        const rootFS = BrowserFS.BFSRequire("fs");
        setFs(rootFS);
        
      });
    }
    setIsLoadingFS(false);
  }, [setFs]);


  const copyFileByPath = (fromPath:string,toPath:string) => {
    fs?.readFile(fromPath, 'utf-8', (err, data) => {
      if (err) {
        console.log(err)
        return
      }
      if (data) {
        fs?.writeFile(`${toPath}/${getLastPathSegment(fromPath)}`, data, (err) => {
          if (err) {
            console.log(err)
            return
          }
          console.log('File copied!')
        })
      }
    })
  }

  const copyExternalFile = (file:File,toPath:string) => {
    fileToBase64(file).then((base64) => {
      const file64 = removeTypeFromBase64(base64)
      fs?.writeFile(`${toPath}/${file.name}`, file64, (err) => {
        if(err){
          console.log(err)
          return
        }
        console.log('file copied!')
      })
    })
  }
  
  return { fs, copyFileByPath, copyExternalFile , isLoadingFS };
}

export default useFS;
