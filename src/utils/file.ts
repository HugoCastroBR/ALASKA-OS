
export const verifyIfIsFile = (filename: string) => {
  const parts = filename.split('.');
  return parts.length > 1;
}

export const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
export const convertSizeToKBMBGB = (size: number) => {
  const kb = 1024;
  const mb = kb * 1024;
  const gb = mb * 1024;

  if (size >= gb) {
    return `${(size / gb).toFixed(2)} GB`;
  }

  if (size >= mb) {
    return `${(size / mb).toFixed(2)} MB`;
  }

  if (size >= kb) {
    return `${(size / kb).toFixed(2)} KB`;
  }

  return `${size} B`;
}

export const uuid = (length: number) => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';
  const lettersLength = letters.length;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * lettersLength);
    result += letters.charAt(randomIndex);
  }

  return result;
};

export const getExtension = (filename: string) => {
  const parts = filename.split('.');
  return parts[parts.length - 1];
}

export const removeExtension = (filename: string) => {
  const parts = filename.split('.');
  parts.pop();
  return parts.join('.');
}

export const extractParentPath = (fullPath: string): string | null => {
  const parts = fullPath.split('/');
  
  // Se houver pelo menos dois elementos no caminho, remova o último para obter o caminho pai
  if (parts.length >= 2) {
    parts.pop(); // Remove o último elemento
    return parts.join('/');
  }

  return null;
};

export function getLastPathSegment(path: string): string {
  const pathSegments = path.split('/');
  return pathSegments[pathSegments.length - 1];
}

export function verifyIfIsImage(filename: string): boolean {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
  const extension = getExtension(filename);
  return imageExtensions.includes(extension);
}

export const toBase64 = (file: File) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export const verifyIfIsObject = (value: any) => {
  return typeof value === 'object' && value !== null;
}

interface Base64ToFileOptions {
  fileName: string;
  fileType: string;
}
export const base64ToFile = (base64String: string, options: Base64ToFileOptions): File => {
  const { fileName, fileType } = options;

  const byteCharacters = atob(base64String);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: fileType });
  const file = new File([blob], fileName, { type: fileType });

  return file;
};

export const convertFileExtensionToFileType = (extension: string) => {
  const fileTypes: { [key: string]: string } = {
    'jpg': 'image/jpeg', // supported // not tested
    'jpeg': 'image/jpeg', // supported // not tested
    'png': 'image/png', // supported // tested
    'gif': 'image/gif', // supported // tested
    'txt': 'text/plain', // supported // tested
    'pdf': 'application/pdf', // supported // tested
    'zip': 'application/zip', // not supported // not tested
    'rar': 'application/x-rar-compressed', // not supported // not tested
    '7z': 'application/x-7z-compressed', // not supported // not tested
    'mp3': 'audio/mpeg', // supported // tested
    'wav': 'audio/wav', // supported // not tested
    'mp4': 'video/mp4', // supported // tested
    'webm': 'video/webm', // supported // not tested
    'mkv': 'video/x-matroska', // supported // not tested
    'doc': 'application/msword', // not supported // not tested
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // not supported // not tested
    'xls': 'application/vnd.ms-excel', // not supported // not tested
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', //  supported //  tested
    'ppt': 'application/vnd.ms-powerpoint', // not supported // not tested
    'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation', // not supported // not tested
    'exe': 'application/x-msdownload', // not supported // not tested
    'apk': 'application/vnd.android.package-archive', // not supported // not tested
    'iso': 'application/octet-stream', // not supported // not tested
    'dmg': 'application/octet-stream', // not supported // not tested
    'img': 'application/octet-stream', // not supported // not tested
    'nrg': 'application/octet-stream', // not supported // not tested
    'md': 'text/markdown', // supported // tested
    'rtf': 'application/rtf', // supported // tested
    'csv': 'text/csv', // not supported // not tested
    'json': 'application/json', // supported // tested
    'xml': 'application/xml', // not supported // not tested
    'html': 'text/html', // supported // tested
    'htm': 'text/html', // not supported // not tested
    'js': 'text/javascript', // supported // tested
    'jsx': 'text/javascript', // supported // not tested
    'ts': 'text/typescript', // supported // tested
    'tsx': 'text/typescript', // supported // not tested
    'css': 'text/css', // supported // not tested
    'py': 'text/x-python', //  supported //  tested
    'vb': 'text/x-vb', // not supported // not tested
    'yml': 'text/yaml', // not supported // not tested
    'yaml': 'text/yaml', // not supported // not tested
    'svg': 'image/svg+xml', // supported // not tested
    'ico': 'image/x-icon', // supported // not tested
    'cur': 'image/x-icon', // supported // not tested
    'webp': 'image/webp', // supported // not tested
    'avif': 'image/avif', // supported // not tested
    'tiff': 'image/tiff', // supported // not tested
    'tif': 'image/tiff', // supported // not tested
    'bmp': 'image/bmp', // supported // not tested
  };

  return fileTypes[extension];
}

export const getExtensionFromBase64 = (base64String: string) => {
  const parts = base64String.split(';');
  const contentType = parts[0].split(':')[1];
  return contentType.split('/')[1];
}

export const getMp3SecondsDuration = async (file: File) => {
  const audio = new Audio();
  audio.src = URL.createObjectURL(file);
  await audio.load();
  const duration = audio.duration;
  URL.revokeObjectURL(audio.src);
  return duration;
};


export async function getMP3Duration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const audio = new Audio();

    audio.addEventListener('loadedmetadata', () => {
      const duration = audio.duration;
      resolve(duration);
    });

    audio.addEventListener('error', (err) => {
      reject(err);
    });

    audio.src = URL.createObjectURL(file);
  });
}

export const convertMp3Base64ToFile = async (base64String: string, filename: string) => {
  const fileType = getExtensionFromBase64(base64String);
  const file = base64ToFile(base64String, { fileName: filename, fileType: convertFileExtensionToFileType(fileType) });
  const duration = await getMP3Duration(file);
  return { file, duration };
};

const getMP4Duration = async (file: File) => {
  const video = document.createElement('video');
  video.preload = 'metadata';

  return new Promise((resolve, reject) => {
    video.addEventListener('loadedmetadata', () => {
      const duration = video.duration;
      resolve(duration);
    });

    video.addEventListener('error', (err) => {
      reject(err);
    });

    video.src = URL.createObjectURL(file);
  });
};

export const convertMp4Base64ToFile = async (base64String: string, filename: string) => {
  const fileType = getExtensionFromBase64(base64String);
  const file = base64ToFile(base64String, { fileName: filename, fileType: convertFileExtensionToFileType(fileType) });
  const duration = await getMP4Duration(file);
  return { file, duration };
};

const getMetaDataFromAnyFile = async (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      resolve(result);
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsArrayBuffer(file);
  });
}

export const convertBase64ToFile = async (base64String: string, filename: string,extension: string) => {
  const fileType = extension
  const file = base64ToFile(base64String, { fileName: filename, fileType: convertFileExtensionToFileType(fileType) });
  let metadata:unknown;
  try {
    metadata = await getMetaDataFromAnyFile(file);
    return { file, metadata };
  } catch (error) {
    console.log(error);
    return { file, metadata:{
      err: error
    } };
  }
}



export const objectToXlsx = async (data: any, filename: string) => {
  const fileType = 'xlsx'
  const file = base64ToFile(data, { fileName: filename, fileType: convertFileExtensionToFileType(fileType) });
  return file;
}

export const arrayToBase64 = (array: []) => {
  const string = JSON.stringify(array);
  const base64 = btoa(string);
  return base64;
}

export const base64ToXlsx = async (base64String: string, filename: string) => {
  const fileType = 'xlsx'
  const file = base64ToFile(base64String, { fileName: filename, fileType: convertFileExtensionToFileType(fileType) });
  return file;
}

export const xlsxToBase64 = async (file: File) => {
  const base64 = await toBase64(file);
  return base64;
}

export const base64ToArray = (base64String: string) => {
  const string = atob(base64String);
  const array = JSON.parse(string);
  return array;
}