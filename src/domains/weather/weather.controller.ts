import { Database } from '@common/database';
import { Router } from 'express';
import { WeatherService } from '@domains/weather/weather.service';

export const WeatherController = () => {
    const router = Router();

    const weatherService = new WeatherService();

    router.get('/', async (req, res) => {
        const weathers = await weatherService.findAll();
        res.json(weathers);
    });

    return router;
};
