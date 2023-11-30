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


export type Coord = {
  lon: number;
  lat: number;
};

export type Weather = {
  id: number;
  main: string;
  description: string;
  icon: string;
};

export type Main = {
  temp: number;
  feels_like: number;
  pressure: number;
  humidity: number;
  temp_min: number;
  temp_max: number;
  sea_level: number;
  grnd_level: number;
};

export type Wind = {
  speed: number;
  deg: number;
  gust: number;
};

export type Clouds = {
  all: number;
};

export type Rain = {
  '1h'?: number;
  '3h'?: number;
};

export type Snow = {
  '1h'?: number;
  '3h'?: number;
};

export type Sys = {
  type: number;
  id: number;
  message: number;
  country: string;
  sunrise: number;
  sunset: number;
};

export type WeatherProps = {
  coord: Coord;
  weather: Weather[];
  base: string;
  main: Main;
  visibility: number;
  wind: Wind;
  clouds: Clouds;
  rain?: Rain;
  snow?: Snow;
  dt: number;
  sys: Sys;
  timezone: number;
  id: number;
  name: string;
  cod: number;
};

export type ForecastFiveDays = {
  cod: string;
  message: number;
  cnt: number;
  list: {
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      pressure: number;
      sea_level: number;
      grnd_level: number;
      humidity: number;
      temp_kf: number;
    };
    weather: {
      id: number;
      main: string;
      description: string;
      icon: string;
    }[];
    clouds: {
      all: number;
    };
    wind: {
      speed: number;
      deg: number;
      gust: number;
    };
    visibility: number;
    pop: number;
    rain?: {
      '3h': number;
    };
    snow?: {
      '3h': number;
    };
    sys: {
      pod: string;
    };
    dt_txt: string;
  }[];
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
};

export type TodoProps = {
  uuid: string
  title: string
  description: string
  completed: boolean
  createdAt: string
}

export type TodoListProps = {
  uuid: string
  title: string
  icon: string
  todos: TodoProps[]
  createdAt: string
}