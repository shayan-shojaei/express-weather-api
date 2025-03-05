import { HttpStatus } from '@common/enums';
import { handleRoute } from '@common/helpers';
import { authentication } from '@common/middlewares';
import {
    FetchWeatherDto,
    FindWeatherRecordsDto,
    UpdateWeatherRecordDto,
    WeatherRecordDto,
} from '@modules/weatherCore/weather';
import { WeatherService } from '@modules/weatherCore/weather/weather.service';
import { NextFunction, Request, Response, Router } from 'express';

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
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/WeatherRecordDto'
     */
    router.get(
        '/',
        handleRoute(
            async (req, res) => {
                const findWeatherRecordsDto = req.query;

                const weatherRecords = await weatherService.findAll(
                    findWeatherRecordsDto,
                );

                res.status(HttpStatus.OK).transformAndSend(
                    weatherRecords,
                    WeatherRecordDto,
                );
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
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/WeatherRecordDto'
     *       404:
     *         description: Weather record not found
     */
    router.get(
        '/:id',
        handleRoute(async (req, res) => {
            const id = req.params.id;

            const weatherRecord = await weatherService.findOneById(id);

            res.status(HttpStatus.OK).transformAndSend(
                weatherRecord,
                WeatherRecordDto,
            );
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
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/WeatherRecordDto'
     *       404:
     *         description: Weather record not found
     */
    router.get(
        '/latest/:cityName',
        handleRoute(async (req, res) => {
            const cityName = req.params.cityName;

            const weatherRecord =
                await weatherService.findLatestByCityName(cityName);

            res.status(HttpStatus.OK).transformAndSend(
                weatherRecord,
                WeatherRecordDto,
            );
        }),
    );

    /**
     * @swagger
     *
     * /weather:
     *   post:
     *     tags: [Weather]
     *     summary: Fetch weather data for a city and save it to the database
     *     security:
     *      - bearerAuth: []
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *          schema:
     *            $ref: '#/components/schemas/FetchWeatherDto'
     *     responses:
     *       201:
     *         description: The weather record that was saved
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/WeatherRecordDto'
     *       400:
     *         description: Location not found
     *       404:
     *         description: Weather data not found
     */
    router.post(
        '/',
        authentication,
        handleRoute(
            async (req, res) => {
                const fetchWeatherDto = req.body;

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
     *     security:
     *      - bearerAuth: []
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
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/WeatherRecordDto'
     *       404:
     *         description: Weather record not found
     */
    router.put(
        '/:id',
        authentication,
        handleRoute(
            async (req, res, next) => {
                const id = req.params.id;
                const updateWeatherRecordDto = req.body;

                const updatedWeatherRecord = await weatherService.updateOneById(
                    id,
                    updateWeatherRecordDto,
                );

                res.status(HttpStatus.OK).transformAndSend(
                    updatedWeatherRecord,
                    WeatherRecordDto,
                );
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
     *     security:
     *      - bearerAuth: []
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
     *       404:
     *         description: Weather record not found
     */
    router.delete(
        '/:id',
        authentication,
        handleRoute(async (req: Request, res: Response, next: NextFunction) => {
            const id = req.params.id;

            await weatherService.deleteOneById(id);

            res.sendStatus(HttpStatus.NO_CONTENT);
        }),
    );

    return router;
};
