import { Config } from '@common/config';
import axios from 'axios';
import type { AxiosInstance } from 'axios';
import { LocationInfo } from '@modules/weatherCore/locationGeocoder';
import Redis from 'ioredis';
import { Cache } from '@common/cache';

export class LocationGeocoderService {
    private readonly axios: AxiosInstance;
    private readonly redis: Redis;

    constructor() {
        this.axios = axios.create({
            baseURL: Config.OpenWeatherMap.GEOCODING_API_URL,
            params: {
                appId: Config.OpenWeatherMap.API_KEY,
            },
        });
        this.redis = Cache.getClient();
    }

    async geocodeLocation(
        country: string,
        city: string,
    ): Promise<LocationInfo> {
        let location = await this.getCachedLocation(country, city);

        if (!location) {
            location = await this.fetchLocation(country, city);

            if (location) {
                await this.cacheLocation(country, city, location);
            }
        }

        return location;
    }

    private async fetchLocation(
        country: string,
        city: string,
    ): Promise<LocationInfo> {
        const response = await this.axios.get<LocationInfo[]>('/direct', {
            params: {
                q: `${city},${country}`,
                limit: 1,
            },
        });

        if (!response.data || response.data.length === 0) {
            return null;
        }

        return response.data[0];
    }

    private async cacheLocation(
        country: string,
        city: string,
        location: LocationInfo,
    ): Promise<void> {
        const cacheKey = this.createCacheKey(country, city);
        await this.redis.hset('geocode', cacheKey, JSON.stringify(location));
    }

    private async getCachedLocation(
        country: string,
        city: string,
    ): Promise<LocationInfo> {
        const cacheKey = this.createCacheKey(country, city);
        const cachedLocation = await this.redis.hget('geocode', cacheKey);

        if (!cachedLocation) {
            return null;
        }

        return JSON.parse(cachedLocation) as LocationInfo;
    }

    private createCacheKey(country: string, city: string): string {
        return `${country}-${city}`;
    }
}
