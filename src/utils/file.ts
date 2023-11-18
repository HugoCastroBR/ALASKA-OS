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