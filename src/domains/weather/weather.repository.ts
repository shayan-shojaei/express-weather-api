import { Repository } from 'typeorm';
import { Weather } from '@domains/weather';

export class WeatherRepository {
    constructor(private readonly repository: Repository<Weather>) {}

    async findAll(): Promise<Weather[]> {
        return this.repository.find();
    }
}
