import { handleRoute } from '@common/helpers';
import { WeatherService } from '@modules/weatherCore/weather/weather.service';
import { NextFunction, Request, Response, Router } from 'express';
import { FetchWeatherDto } from './dto';

export const WeatherController = () => {
    const router = Router();

    const weatherService = new WeatherService();

    router.post(
        '/',
        handleRoute(
            async (req: Request, res: Response, next: NextFunction) => {
                const fetchWeatherDto = req.body as FetchWeatherDto;

                const weather =
                    await weatherService.fetchWeather(fetchWeatherDto);

                res.status(200).send(weather);
            },
            {
                body: FetchWeatherDto,
            },
        ),
    );

    return router;
};
