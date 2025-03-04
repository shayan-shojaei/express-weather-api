import { Repository } from 'typeorm';
import { Weather } from '@modules/weatherCore/weather';
import { FindWeatherRecordsDto } from './dto';

export class WeatherRepository {
    constructor(private readonly repository: Repository<Weather>) {}

    async findAll(
        findWeatherRecordsDto: FindWeatherRecordsDto,
    ): Promise<Weather[]> {
        return this.repository.find({
            where: {
                cityName: findWeatherRecordsDto.cityName,
                country: findWeatherRecordsDto.country,
            },
        });
    }

    async findOneById(id: string): Promise<Weather> {
        return this.repository.findOneBy({ id: id });
    }

    async findLatestByCityName(cityName: string): Promise<Weather> {
        return this.repository.findOne({
            where: {
                cityName: cityName,
            },
            order: {
                createdAt: 'DESC',
            },
        });
    }

    async insert(weather: Weather): Promise<Weather> {
        return this.repository.save(weather);
    }

    async findOneAndUpdate(
        id: string,
        weather: Partial<Weather>,
    ): Promise<Weather> {
        return (
            await this.repository
                .createQueryBuilder()
                .update({
                    ...weather,
                })
                .where({
                    id: id,
                })
                .returning('*')
                .execute()
        ).raw[0];
    }

    async deleteOneById(id: string): Promise<boolean> {
        const result = await this.repository.delete({ id: id });
        return result.affected === 1;
    }
}
