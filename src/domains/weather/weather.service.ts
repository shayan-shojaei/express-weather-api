import { Database } from '@common/database';
import { Weather } from '@domains/weather';
import { WeatherRepository } from '@domains/weather/weather.repository';

export class WeatherService {
    constructor() {}

    private readonly weatherRepository = new WeatherRepository(
        Database.getRepository(Weather),
    );

    async findAll(): Promise<Weather[]> {
        return this.weatherRepository.findAll();
    }
}
