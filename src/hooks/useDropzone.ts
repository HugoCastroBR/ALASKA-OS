import { useState } from "react";


const useDropzone = (options = {}) => {
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = (acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
  }

  return { files, onDrop };
}

export default useDropzone;