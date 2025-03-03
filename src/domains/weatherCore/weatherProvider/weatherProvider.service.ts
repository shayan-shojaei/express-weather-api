import { Config } from '@common/config';
import { AxiosInstance, create } from 'axios';
import { LocationGeocoderService } from '@domains/weatherCore/locationGeocoder/locationGeocoder.service';
import type {
    WeatherError,
    WeatherInfo,
} from '@domains/weatherCore/weatherProvider';

export class WeatherProviderService {
    private readonly axios: AxiosInstance;
    private readonly locationGeocoderService = new LocationGeocoderService();

    constructor() {
        this.axios = create({
            baseURL: Config.OpenWeatherMap.API_URL,
            params: {
                appId: Config.OpenWeatherMap.API_KEY,
            },
        });
    }

    async getWeather(country: string, city: string): Promise<WeatherInfo> {
        const location = await this.locationGeocoderService.geocodeLocation(
            country,
            city,
        );

        if (!location) {
            throw new Error('Location not found');
        }

        const weatherData = await this.axios.get<WeatherInfo | WeatherError>(
            '/weather',
            {
                params: {
                    lat: location.lat,
                    lon: location.lon,
                },
            },
        );

        if (weatherData.data.cod === 400) {
            throw new Error('Weather not available');
        }

        return weatherData.data;
    }
}
