import { WeatherProps } from './../types/programs';
import { ForecastFiveDays } from "@/types/programs";

const geoApiUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=';
const weatherApiUrl = 'https://api.openweathermap.org/data/2.5/weather?';
const foreCastApiUrl = 'https://api.openweathermap.org/data/2.5/forecast?';
const key = process.env.WEATHER_API_KEY

export const getCity = async (city: string) => {
  const response = await fetch(`${geoApiUrl}${city}&appid=${key}`)
  const data = await response.json()
  return data
};

export const getWeather = async (lat: number, lon: number):Promise<WeatherProps> => {
  const response = await fetch(`${weatherApiUrl}units=metric&lat=${lat.toFixed(2)}&lon=${lon.toFixed(2)}&appid=${key}`)
  const data = await response.json()
  return data
};

export const getForecast = async (lat: number, lon: number):Promise<ForecastFiveDays>=> {
  const response = await fetch(`${foreCastApiUrl}units=metric&lat=${lat.toFixed(2)}&lon=${lon.toFixed(2)}&appid=${key}`)
  const data = await response.json()
  return data
};

