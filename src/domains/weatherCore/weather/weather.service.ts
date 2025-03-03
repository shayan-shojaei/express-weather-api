import { Database } from '@common/database';
import { Weather } from '@domains/weatherCore/weather';
import { WeatherRepository } from '@domains/weatherCore/weather/weather.repository';
import { WeatherProviderService } from '@domains/weatherCore/weatherProvider/weatherProvider.service';
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
