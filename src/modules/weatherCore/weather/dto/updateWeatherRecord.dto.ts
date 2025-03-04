import {
    IsDefined,
    IsNotEmpty,
    IsNumber,
    IsString,
    Max,
    Min,
} from 'class-validator';

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
