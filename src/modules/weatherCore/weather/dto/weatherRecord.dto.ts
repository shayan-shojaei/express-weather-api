import { Exclude, Expose } from 'class-transformer';

/**
 * @swagger
 * components:
 *   schemas:
 *     WeatherRecordDto:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: 123e4567-e89b-12d3-a456-426614174000
 *         cityName:
 *           type: string
 *           example: London
 *         country:
 *           type: string
 *           description: country code
 *           example: GB
 *         temperature:
 *           type: number
 *           format: float
 *           example: 26
 *         description:
 *           type: string
 *           example: clear sky
 *         humidity:
 *           type: number
 *           format: int
 *           example: 50
 *         windSpeed:
 *           type: number
 *           format: float
 *           example: 5.1
 *         fetchedAt:
 *           type: string
 *           format: date-time
 *           description: the date and time when the weather data was fetched
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: the date and time when the record was created
 */
@Exclude()
export class WeatherRecordDto {
    @Expose()
    id: string;

    @Expose()
    cityName: string;

    @Expose()
    country: string;

    @Expose()
    temperature: number;

    @Expose()
    description: string;

    @Expose()
    humidity: number;

    @Expose()
    windSpeed: number;

    @Expose()
    fetchedAt: Date;

    @Expose()
    createdAt: Date;
}
