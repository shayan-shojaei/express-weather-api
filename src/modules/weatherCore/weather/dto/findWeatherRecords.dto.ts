import { IsOptional, IsString } from 'class-validator';

/**
 * @swagger
 * components:
 *   schemas:
 *     FindWeatherRecordsDto:
 *       type: object
 *       properties:
 *         cityName:
 *           type: string
 *           example: 'London'
 *         country:
 *           type: string
 *           example: 'GB'
 *           description: The country code
 */
export class FindWeatherRecordsDto {
    @IsString()
    @IsOptional()
    cityName?: string;

    @IsString()
    @IsOptional()
    country?: string;
}
