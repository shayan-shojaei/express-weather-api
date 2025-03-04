import { IsOptional, IsString } from 'class-validator';

export class FindWeatherRecordsDto {
    @IsString()
    @IsOptional()
    cityName?: string;

    @IsString()
    @IsOptional()
    country?: string;
}
