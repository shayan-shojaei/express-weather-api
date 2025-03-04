import { Database } from '@common/database';
import { Weather } from '@modules/weatherCore/weather';
import { WeatherRepository } from '@modules/weatherCore/weather/weather.repository';
import { WeatherProviderService } from '@modules/weatherCore/weatherProvider/weatherProvider.service';
import { FetchWeatherDto } from './dto';

export class WeatherService {
    constructor() {}

    private readonly weatherRepository = new WeatherRepository(
        Database.getRepository(Weather),
    );
    private readonly weatherProvider = new WeatherProviderService();

    async findAll(): Promise<Weather[]> {
        await this.weatherProvider.getWeather('GB', 'London');

        return this.weatherRepository.findAll();
    }

    async fetchWeather(fetchWeatherDto: FetchWeatherDto): Promise<Weather> {
        const weatherInfo = await this.weatherProvider.getWeather(
            fetchWeatherDto.country,
            fetchWeatherDto.cityName,
        );

        const weather = Weather.fromWeatherInfo(
            fetchWeatherDto.country,
            fetchWeatherDto.cityName,
            weatherInfo,
        );

        return this.weatherRepository.insert(weather);
    }
}
