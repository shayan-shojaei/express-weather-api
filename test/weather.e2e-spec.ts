import { startServer } from '@app/app';
import request from 'supertest';
import {
    FetchWeatherDto,
    UpdateWeatherRecordDto,
    WeatherRecordDto,
} from '@modules/weatherCore/weather/dto';
import { HttpStatus } from '@common/enums';
import { Server } from 'http';

describe('Weather', () => {
    let app: Server;

    let token: string;

    beforeAll(async () => {
        app = await startServer();

        const response = await request(app).post('/account/auth/login').send({
            email: 'user@test.com',
            password: 'Pass1234',
        });

        token = `Bearer ${response.body.token}`;
    });

    afterAll(() => app.close());

    describe('POST /weather', () => {
        it('should throw a 401 error if the user is not authenticated', async () => {
            const body: FetchWeatherDto = {
                cityName: 'London',
                country: 'GB',
            };

            const response = await request(app).post('/weather').send(body);

            expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED);
        });

        it('should throw an error if the request body is empty', async () => {
            const body: FetchWeatherDto = {
                cityName: undefined,
                country: undefined,
            };

            const response = await request(app)
                .post('/weather')
                .send(body)
                .set('authorization', token);

            expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
        });

        let initialResponseTime: number;
        it('should fetch weather data from the OpenWeather API', async () => {
            const body: FetchWeatherDto = {
                cityName: 'London',
                country: 'GB',
            };

            const startTime = Date.now();

            const response = await request(app)
                .post('/weather')
                .send(body)
                .set('authorization', token);

            initialResponseTime = Date.now() - startTime;

            expect(response.statusCode).toBe(HttpStatus.CREATED);
        });

        it('should fetch weather data from the cache', async () => {
            const body: FetchWeatherDto = {
                cityName: 'London',
                country: 'GB',
            };

            const startTime = Date.now();

            const response = await request(app)
                .post('/weather')
                .send(body)
                .set('authorization', token);

            const responseTime = Date.now() - startTime;

            expect(response.statusCode).toBe(HttpStatus.CREATED);

            expect(responseTime).toBeLessThan(initialResponseTime);
        });
    });

    describe('GET /weather', () => {
        it('should return a list of all weather records', async () => {
            const response = await request(app).get('/weather');

            expect(response.statusCode).toBe(HttpStatus.OK);

            expect(response.body).toBeInstanceOf(Array);
        });

        it('should return a list of weather records filtered by city name', async () => {
            const response = await request(app).get('/weather').query({
                cityName: 'London',
            });

            expect(response.statusCode).toBe(HttpStatus.OK);

            expect(response.body).toBeInstanceOf(Array);
            expect(response.body.length).toBeGreaterThan(0);
        });

        it('should return a list of weather records filtered by country code', async () => {
            const response = await request(app).get('/weather').query({
                country: 'GB',
            });

            expect(response.statusCode).toBe(HttpStatus.OK);

            expect(response.body).toBeInstanceOf(Array);
            expect(response.body.length).toBeGreaterThan(0);
        });

        it('should return an empty list of weather records filtered by a non-existing country', async () => {
            const response = await request(app).get('/weather').query({
                country: 'YZ',
            });

            expect(response.statusCode).toBe(HttpStatus.OK);
            expect(response.body).toBeInstanceOf(Array);
            expect(response.body.length).toEqual(0);
        });
    });

    describe('GET /weather/:id', () => {
        let weatherId: string;

        beforeAll(async () => {
            const body: FetchWeatherDto = {
                cityName: 'New York',
                country: 'US',
            };

            const response = await request(app)
                .post('/weather')
                .send(body)
                .set('authorization', token);

            weatherId = response.body.id;
        });

        it('should return a weather record by id', async () => {
            const response = await request(app).get(`/weather/${weatherId}`);

            expect(response.statusCode).toBe(HttpStatus.OK);

            expect(response.body).toHaveProperty('id');
            expect(response.body).toHaveProperty('cityName');
            expect(response.body).toHaveProperty('country');
            expect(response.body).toHaveProperty('temperature');
            expect(response.body).toHaveProperty('description');
            expect(response.body).toHaveProperty('humidity');
            expect(response.body).toHaveProperty('windSpeed');
            expect(response.body).toHaveProperty('fetchedAt');
            expect(response.body).toHaveProperty('createdAt');
        });

        it('should return a 404 error if the id is not a valid uuid', async () => {
            const invalidId = 'invalid-id';
            const response = await request(app).get(`/weather/${invalidId}`);

            expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
        });

        it('should return a 404 error if the id does not exist', async () => {
            const nonExistingId = '00000000-0000-0000-0000-000000000000';
            const response = await request(app).get(
                `/weather/${nonExistingId}`,
            );

            expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
        });
    });

    describe('PUT /weather/:id', () => {
        let weatherRecord: WeatherRecordDto;
        const updateBody: UpdateWeatherRecordDto = {
            description: 'Sunny',
            humidity: 50,
            temperature: 25,
            windSpeed: 10,
        };

        beforeAll(async () => {
            const body: FetchWeatherDto = {
                cityName: 'Paris',
                country: 'FR',
            };

            const response = await request(app)
                .post('/weather')
                .send(body)
                .set('authorization', token);

            weatherRecord = response.body;
        });

        it('should throw a 401 error if the user is not authenticated', async () => {
            const response = await request(app)
                .put(`/weather/${weatherRecord.id}`)
                .send(updateBody);

            expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED);
        });

        it('should throw a 400 error if the request body is empty', async () => {
            const response = await request(app)
                .put(`/weather/${weatherRecord.id}`)
                .send({})
                .set('authorization', token);

            expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
        });

        it('should update a weather record by id', async () => {
            const response = await request(app)
                .put(`/weather/${weatherRecord.id}`)
                .send(updateBody)
                .set('authorization', token);

            expect(response.statusCode).toBe(HttpStatus.OK);

            expect(response.body).toHaveProperty('id');
            expect(response.body).toHaveProperty('cityName');
            expect(response.body).toHaveProperty('country');
            expect(response.body).toHaveProperty('temperature');
            expect(response.body).toHaveProperty('description', 'Sunny');
            expect(response.body).toHaveProperty('humidity');
            expect(response.body).toHaveProperty('windSpeed');
            expect(response.body).toHaveProperty('fetchedAt');
            expect(response.body).toHaveProperty('createdAt');

            expect(response.body.id).toBe(weatherRecord.id);
            expect(response.body.cityName).toBe(weatherRecord.cityName);
            expect(response.body.country).toBe(weatherRecord.country);

            expect(response.body.description).toBe(updateBody.description);
            expect(response.body.temperature).toBe(updateBody.temperature);
            expect(response.body.humidity).toBe(updateBody.humidity);
            expect(response.body.windSpeed).toBe(updateBody.windSpeed);
        });

        it('should return a 404 error if the id is not a valid uuid', async () => {
            const invalidId = 'invalid-id';

            const response = await request(app)
                .put(`/weather/${invalidId}`)
                .send(updateBody)
                .set('authorization', token);

            expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
        });

        it('should return a 404 error if the id does not exist', async () => {
            const nonExistingId = '00000000-0000-0000-0000-000000000000';

            const response = await request(app)
                .put(`/weather/${nonExistingId}`)
                .send(updateBody)
                .set('authorization', token);

            expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
        });
    });

    describe('DELETE /weather/:id', () => {
        let weatherId: string;

        beforeAll(async () => {
            const body: FetchWeatherDto = {
                cityName: 'Tokyo',
                country: 'JP',
            };

            const response = await request(app)
                .post('/weather')
                .send(body)
                .set('authorization', token);

            weatherId = response.body.id;
        });

        it('should throw a 401 error if the user is not authenticated', async () => {
            const response = await request(app).delete(`/weather/${weatherId}`);

            expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED);
        });

        it('should delete a weather record by id', async () => {
            const response = await request(app)
                .delete(`/weather/${weatherId}`)
                .set('authorization', token);

            expect(response.statusCode).toBe(HttpStatus.NO_CONTENT);

            expect(response.body).toEqual({});

            // Check if the record was deleted
            const getResponse = await request(app).get(`/weather/${weatherId}`);

            expect(getResponse.statusCode).toBe(HttpStatus.NOT_FOUND);
        });
    });
});
