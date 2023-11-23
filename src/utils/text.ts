export const truncateText = (text: string, length: number) => {
  if(!text) return ''
  if (text.length > length) {
    return text.substring(0, length) + '...';
  } else {
    return text;
  }
};