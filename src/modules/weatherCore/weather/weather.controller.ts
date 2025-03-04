import { handleRoute } from '@common/helpers';
import { WeatherService } from '@modules/weatherCore/weather/weather.service';
import { NextFunction, Request, Response, Router } from 'express';
import {
    FetchWeatherDto,
    FindWeatherRecordsDto,
    UpdateWeatherRecordDto,
} from './dto';
import { HttpStatus } from '@common/enums';

export const WeatherController = () => {
    const router = Router();

    const weatherService = new WeatherService();

    /**
     * @swagger
     *
     * /weather:
     *   get:
     *     tags: [Weather]
     *     summary: Get all weather records
     *     parameters:
     *       - in: query
     *         name: cityName
     *         schema:
     *           type: string
     *       - in: query
     *         name: country
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: A list of weather records
     */
    router.get(
        '/',
        handleRoute(
            async (req: Request, res: Response, next: NextFunction) => {
                const findWeatherRecordsDto =
                    req.query as FindWeatherRecordsDto;

                const weatherRecords = await weatherService.findAll(
                    findWeatherRecordsDto,
                );

                res.status(HttpStatus.OK).send(weatherRecords);
            },
            {
                query: FindWeatherRecordsDto,
            },
        ),
    );

    /**
     * @swagger
     *
     * /weather/{id}:
     *   get:
     *     tags: [Weather]
     *     summary: Get a weather record by ID
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: the ID of the weather record
     *     responses:
     *       200:
     *         description: The weather record with the given ID
     */
    router.get(
        '/:id',
        handleRoute(async (req: Request, res: Response, next: NextFunction) => {
            const id = req.params.id;

            const weatherRecord = await weatherService.findOneById(id);

            res.status(HttpStatus.OK).send(weatherRecord);
        }),
    );

    /**
     * @swagger
     *
     * /weather/latest/{cityName}:
     *   get:
     *     tags: [Weather]
     *     summary: Get the latest weather record by city name
     *     parameters:
     *       - in: path
     *         name: cityName
     *         required: true
     *         schema:
     *           type: string
     *         description: the name of the city to get the latest weather record
     *     responses:
     *       200:
     *         description: The latest weather record with the given city name
     */
    router.get(
        '/latest/:cityName',
        handleRoute(async (req: Request, res: Response, next: NextFunction) => {
            const cityName = req.params.cityName;

            const weatherRecord =
                await weatherService.findLatestByCityName(cityName);

            res.status(HttpStatus.OK).send(weatherRecord);
        }),
    );

    /**
     * @swagger
     *
     * /weather:
     *   post:
     *     tags: [Weather]
     *     summary: Fetch weather data for a city and save it to the database
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *          schema:
     *            $ref: '#/components/schemas/FetchWeatherDto'
     *     responses:
     *       201:
     *         description: The weather record that was saved
     */
    router.post(
        '/',
        handleRoute(
            async (req: Request, res: Response, next: NextFunction) => {
                const fetchWeatherDto = req.body as FetchWeatherDto;

                const weather =
                    await weatherService.fetchWeather(fetchWeatherDto);

                res.status(HttpStatus.CREATED).send(weather);
            },
            {
                body: FetchWeatherDto,
            },
        ),
    );

    /**
     * @swagger
     *
     * /weather/{id}:
     *   put:
     *     tags: [Weather]
     *     summary: Update a weather record by ID
     *     parameters:
     *      - in: path
     *        name: id
     *        required: true
     *        schema:
     *          type: string
     *        description: the ID of the weather record
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *          schema:
     *            $ref: '#/components/schemas/UpdateWeatherRecordDto'
     *     responses:
     *       200:
     *         description: The updated weather record
     */
    router.put(
        '/:id',
        handleRoute(
            async (req: Request, res: Response, next: NextFunction) => {
                const id = req.params.id;
                const updateWeatherRecordDto =
                    req.body as UpdateWeatherRecordDto;

                const updatedWeatherRecord = await weatherService.updateOneById(
                    id,
                    updateWeatherRecordDto,
                );

                res.status(HttpStatus.OK).send(updatedWeatherRecord);
            },
            {
                body: UpdateWeatherRecordDto,
            },
        ),
    );

    /**
     * @swagger
     *
     * /weather/{id}:
     *   delete:
     *     tags: [Weather]
     *     summary: Delete a weather record by ID
     *     parameters:
     *      - in: path
     *        name: id
     *        required: true
     *        schema:
     *          type: string
     *        description: the ID of the weather record
     *     responses:
     *       204:
     *         description: The weather record was deleted
     */
    router.delete(
        '/:id',
        handleRoute(async (req: Request, res: Response, next: NextFunction) => {
            const id = req.params.id;

            await weatherService.deleteOneById(id);

            res.sendStatus(HttpStatus.NO_CONTENT);
        }),
    );

    return router;
};
