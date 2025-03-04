import { Config } from '@common/config';
import { AxiosInstance, create } from 'axios';
import { LocationInfo } from '@modules/weatherCore/locationGeocoder';

export class LocationGeocoderService {
    private readonly axios: AxiosInstance;

    constructor() {
        this.axios = create({
            baseURL: Config.OpenWeatherMap.GEOCODING_API_URL,
            params: {
                appId: Config.OpenWeatherMap.API_KEY,
            },
        });
    }

    async geocodeLocation(
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
}
