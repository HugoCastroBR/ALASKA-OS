import { FSModule } from 'browserfs/dist/node/core/FS';
import * as BrowserFS from 'browserfs';
import { useEffect, useState } from "react";

type useFileSystemProps = {
  fs: FSModule | null;
  isLoadingFS: boolean;
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

  
  return { fs, isLoadingFS };
}

export default useFS;
