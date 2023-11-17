export function generateIcon(extension:string){
  switch (extension) {
    case 'txt':
      return '/assets/icons/txt.png'
    case 'png':
      return '/assets/icons/image.png'
    case 'jpg':
      return '/assets/icons/image.png'
    case 'jpeg':
      return '/assets/icons/image.png'
    case 'gif':
      return '/assets/icons/image.png'
    case 'js':
      return '/assets/icons/js.png'
    case 'ts':
      return '/assets/icons/ts.png'
    case 'tsx':
      return '/assets/icons/ts.png'
    case 'jsx':
      return '/assets/icons/js.png'
    case 'css':
      return '/assets/icons/css.png'
    case 'scss':
      return '/assets/icons/css.png'
    case 'sass':
      return '/assets/icons/css.png'
    case 'html':
      return '/assets/icons/html.png'
    case 'json':
      return '/assets/icons/json.png'
    case 'md':
      return '/assets/icons/md.png'
    case 'pdf':
      return '/assets/icons/pdf.png'
    case 'smc':
      return '/assets/icons/smc.png'
    case 'state':
      return '/assets/icons/state.png'
    default: '/assets/icons/file.png'
  }
}