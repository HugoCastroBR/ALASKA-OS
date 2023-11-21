
export const verifyIfIsFile = (filename: string) => {
  const parts = filename.split('.');
  return parts.length > 1;
}

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
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'txt': 'text/plain',
    'pdf': 'application/pdf',
    'zip': 'application/zip',
    'rar': 'application/x-rar-compressed',
    '7z': 'application/x-7z-compressed',
    'mp3': 'audio/mpeg',
    'mp4': 'video/mp4',
    'webm': 'video/webm',
    'mkv': 'video/x-matroska',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'xls': 'application/vnd.ms-excel',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'ppt': 'application/vnd.ms-powerpoint',
    'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
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