export const hexToRgba = (hex:string) => {
  const r = parseInt(hex.slice(1,3),16)
  const g = parseInt(hex.slice(3,5),16)
  const b = parseInt(hex.slice(5,7),16)
  const a = parseInt(hex.slice(7,9),16) / 255
  return `rgba(${r},${g},${b},255)`
}

export const rgbaToHex = (rgba:string) => {
  const [r,g,b,a] = rgba.slice(5,rgba.length-1).split(',')
  const hex = `#${parseInt(r).toString(16)}${parseInt(g).toString(16)}${parseInt(b).toString(16)}${parseInt(a).toString(16)}`
  return hex
}