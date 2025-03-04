import { IsNotEmpty, IsString } from 'class-validator';

export class FetchWeatherDto {
    @IsString()
    @IsNotEmpty()
    cityName: string;

    @IsString()
    @IsNotEmpty()
    country: string;
}
