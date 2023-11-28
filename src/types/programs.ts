import { tabStateProps, windowStateProps } from "./windows"

export type programProps = {
  tab: tabStateProps
  window: windowStateProps
  style?: React.CSSProperties
}

export type consoleProps = programProps & {
  vanilla?: boolean
  interceptBrowserConsole?: boolean
}

export type explorerProps = programProps & {
  previousPath?: string
  onBack?: () => void
}


export type explorerActionBarProps = {
  path: string
  onBack: () => void
  onReload: () => void
}

export type ImageReaderProps = programProps & {
  path: string
} 

export type MusicProps = {
  uuid: string
  title: string
  artist: string
  cover: string
  musicFile: File | null
  duration: number
}

export type MusicItemProps = {
  index: number
  music: MusicProps
  onClick?: (music:MusicProps) => void
}

export type PictureProps = {
  image64: string
  name: string
}

export type GalleryItemProps = {
  image64: string
  name: string
  index: number
}

export type WeatherProps = {
  last_updated: string;
  last_updated_epoch: number;
  temp_c: number;
  temp_f: number;
  feelslike_c: number;
  feelslike_f: number;
  condition: {
    text: string;
    icon: string;
    code: number;
  };
  wind_mph: number;
  wind_kph: number;
  wind_degree: number;
  wind_dir: string;
  pressure_mb: number;
  pressure_in: number;
  precip_mm: number;
  precip_in: number;
  humidity: number;
  cloud: number;
  is_day: number;
  uv: number;
  gust_mph: number;
  gust_kph: number;
};
