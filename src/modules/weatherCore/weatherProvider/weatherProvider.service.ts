import { Config } from '@common/config';
import { AxiosInstance, create } from 'axios';
import { LocationGeocoderService } from '@modules/weatherCore/locationGeocoder/locationGeocoder.service';
import type {
    WeatherError,
    WeatherInfo,
} from '@modules/weatherCore/weatherProvider';
import Redis from 'ioredis';
import { Cache } from '@common/cache';
import { BadRequestException, NotFoundException } from '@common/exceptions';
import { LocationInfo } from '../locationGeocoder';
import { CachedWeather } from './types/cachedWeather.type';

export class WeatherProviderService {
    private readonly axios: AxiosInstance;
    private readonly locationGeocoderService = new LocationGeocoderService();
    private readonly redis: Redis;

    constructor() {
        this.axios = create({
            baseURL: Config.OpenWeatherMap.API_URL,
            params: {
                appId: Config.OpenWeatherMap.API_KEY,
            },
        });
        this.redis = Cache.getClient();
    }

    async getWeather(country: string, city: string): Promise<CachedWeather> {
        const location = await this.locationGeocoderService.geocodeLocation(
            country,
            city,
        );

        if (!location) {
            throw new BadRequestException('Location not found');
        }

        let cachedWeather = await this.getCachedWeather(location);

        if (!cachedWeather) {
            const weatherInfo = await this.fetchWeather(location);

            if (weatherInfo) {
                cachedWeather = await this.cacheWeather(location, weatherInfo);
            }
        }

        if (!cachedWeather) {
            throw new NotFoundException('Weather not found');
        }

        return cachedWeather;
    }

    private async fetchWeather(location: LocationInfo): Promise<WeatherInfo> {
        const weatherData = await this.axios.get<WeatherInfo | WeatherError>(
            '/weather',
            {
                params: {
                    lat: location.lat,
                    lon: location.lon,
                },
            },
        );

        // External API error
        if (weatherData.data.cod === 400) {
            throw new Error(
                `Weather not available: ${weatherData.data.message}`,
            );
        }

        return weatherData.data;
    }

    private async getCachedWeather(
        location: LocationInfo,
    ): Promise<CachedWeather | null> {
        const cacheKey = this.createCacheKey(location);
        const cachedWeather = await this.redis.get(cacheKey);

        if (!cachedWeather) {
            return null;
        }

        return JSON.parse(cachedWeather) as CachedWeather;
    }

    private async cacheWeather(
        location: LocationInfo,
        weather: WeatherInfo,
    ): Promise<CachedWeather> {
        const cacheKey = this.createCacheKey(location);
        const cacheData: CachedWeather = {
            date: new Date(),
            weather,
        };

        await this.redis.setex(
            cacheKey,
            Config.Redis.TTL,
            JSON.stringify(cacheData),
        );

        return cacheData;
    }

    private createCacheKey(location: LocationInfo): string {
        return `weather:${location.lat}:${location.lon}`;
    }
}
