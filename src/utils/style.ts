export const hexToRgba = (hex:string) => {
  const r = parseInt(hex.slice(1,3),16)
  const g = parseInt(hex.slice(3,5),16)
  const b = parseInt(hex.slice(5,7),16)
  const a = parseInt(hex.slice(7,9),16) / 255
  return `rgba(${r},${g},${b},255)`
}