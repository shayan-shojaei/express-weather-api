import { IsNotEmpty, IsString } from 'class-validator';

/**
 * @swagger
 * components:
 *   schemas:
 *     FetchWeatherDto:
 *       type: object
 *       properties:
 *         cityName:
 *           type: string
 *           example: 'London'
 *           required: true
 *         country:
 *           type: string
 *           example: 'GB'
 *           description: The country code
 *           required: true
 */
export class FetchWeatherDto {
    @IsString()
    @IsNotEmpty()
    cityName: string;

    @IsString()
    @IsNotEmpty()
    country: string;
}
