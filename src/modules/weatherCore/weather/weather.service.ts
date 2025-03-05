import { Database } from '@common/database';
import { BadRequestException, NotFoundException } from '@common/exceptions';
import {
    FetchWeatherDto,
    FindWeatherRecordsDto,
    UpdateWeatherRecordDto,
    Weather,
} from '@modules/weatherCore/weather';
import { WeatherRepository } from '@modules/weatherCore/weather/weather.repository';
import { WeatherProviderService } from '@modules/weatherCore/weatherProvider/weatherProvider.service';
import { isUUID } from 'class-validator';

export class WeatherService {
    private readonly weatherRepository = new WeatherRepository(
        Database.getRepository(Weather),
    );
    private readonly weatherProvider = new WeatherProviderService();

    constructor() {}

    async findAll(
        findWeatherRecordsDto: FindWeatherRecordsDto,
    ): Promise<Weather[]> {
        return this.weatherRepository.findAll(findWeatherRecordsDto);
    }

    async findOneById(id: string): Promise<Weather> {
        if (!isUUID(id)) {
            throw new NotFoundException();
        }

        const weatherRecord = await this.weatherRepository.findOneById(id);

        if (!weatherRecord) {
            throw new NotFoundException();
        }

        return weatherRecord;
    }

    async findLatestByCityName(cityName: string): Promise<Weather> {
        if (!cityName) {
            throw new BadRequestException('City name is required');
        }

        const weatherRecord =
            await this.weatherRepository.findLatestByCityName(cityName);

        if (!weatherRecord) {
            throw new NotFoundException();
        }

        return weatherRecord;
    }

    async fetchWeather(fetchWeatherDto: FetchWeatherDto): Promise<Weather> {
        const cachedWeather = await this.weatherProvider.getWeather(
            fetchWeatherDto.country,
            fetchWeatherDto.cityName,
        );

        const weather = Weather.fromWeatherInfo(
            cachedWeather.weather,
            cachedWeather.date,
        );

        return this.weatherRepository.insert(weather);
    }

    async updateOneById(
        id: string,
        updateWeatherRecordDto: UpdateWeatherRecordDto,
    ): Promise<Weather> {
        if (!isUUID(id)) {
            throw new NotFoundException();
        }

        const updatedWeatherRecord =
            await this.weatherRepository.findOneAndUpdate(
                id,
                updateWeatherRecordDto,
            );

        if (!updatedWeatherRecord) {
            throw new NotFoundException();
        }

        return updatedWeatherRecord;
    }

    async deleteOneById(id: string): Promise<void> {
        if (!isUUID(id)) {
            throw new NotFoundException();
        }

        // Note: Could use soft-delete instead of hard-delete
        // here, based on business requirements.
        const deleted = await this.weatherRepository.deleteOneById(id);

        if (!deleted) {
            throw new NotFoundException();
        }
    }
}
