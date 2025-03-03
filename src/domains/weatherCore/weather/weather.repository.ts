import { Repository } from 'typeorm';
import { Weather } from '@domains/weatherCore/weather';

export class WeatherRepository {
    constructor(private readonly repository: Repository<Weather>) {}

    async findAll(): Promise<Weather[]> {
        return this.repository.find();
    }

    async insert(weather: Weather): Promise<Weather> {
        return this.repository.save(weather);
    }
}
