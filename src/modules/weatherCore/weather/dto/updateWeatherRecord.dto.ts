import {
    IsDefined,
    IsNotEmpty,
    IsNumber,
    IsString,
    Max,
    Min,
} from 'class-validator';

/**
 * @swagger
 *
 * components:
 *  schemas:
 *     UpdateWeatherRecordDto:
 *       type: object
 *       properties:
 *         temperature:
 *           type: number
 *           description: The temperature
 *           example: 25.5
 *         description:
 *           type: string
 *           description: The weather description
 *           example: 'clear sky'
 *         humidity:
 *           type: number
 *           description: The humidity (0-100)
 *           example: 50
 *         windSpeed:
 *           type: number
 *           description: The wind speed (non-negative)
 *           example: 5
 */
export class UpdateWeatherRecordDto {
    @IsNumber({ allowInfinity: false, allowNaN: false })
    @IsDefined()
    temperature: number;

    @IsNotEmpty()
    @IsString()
    @IsDefined()
    description: string;

    @IsNumber({ allowInfinity: false, allowNaN: false })
    @Min(0)
    @Max(100)
    @IsDefined()
    humidity: number;

    /**
     * Non-negative number representing wind speed
     */
    @IsNumber({ allowInfinity: false, allowNaN: false })
    @Min(0)
    @IsDefined()
    windSpeed: number;
}
