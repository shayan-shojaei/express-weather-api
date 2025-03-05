import { WeatherInfo } from '@modules/weatherCore/weatherProvider';

export type CachedWeather = {
    date: Date;
    weather: WeatherInfo;
};
