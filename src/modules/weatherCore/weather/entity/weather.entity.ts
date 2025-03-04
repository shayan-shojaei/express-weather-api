import { WeatherInfo } from '@modules/weatherCore/weatherProvider';
import { DateTime } from 'luxon';
import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'weather_data' })
export class Weather {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'city_name' })
    cityName: string;

    @Column()
    country: string;

    @Column({ type: 'float' })
    temperature: number;

    @Column({ nullable: true })
    description: string;

    @Column({ type: 'int' })
    humidity: number;

    @Column({ name: 'wind_speed', type: 'float' })
    windSpeed: number;

    @Column({
        name: 'fetched_at',
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
    })
    fetchedAt: Date;

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamptz',
    })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
    updatedAt: Date;

    constructor(data: Partial<Weather>) {
        if (data) {
            Object.assign(this, data);
        }
    }

    static fromWeatherInfo(
        country: string,
        cityName: string,
        weatherInfo: WeatherInfo,
        fetchedAt?: Date,
    ): Weather {
        return new Weather({
            cityName: cityName,
            country: country,
            description: weatherInfo.weather[0].description,
            temperature: weatherInfo.main.temp,
            humidity: weatherInfo.main.humidity,
            windSpeed: weatherInfo.wind.speed,
            fetchedAt: fetchedAt || new Date(),
        });
    }
}
