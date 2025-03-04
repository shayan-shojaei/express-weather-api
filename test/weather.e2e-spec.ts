import { App } from 'supertest/types';
import { startServer } from '@app/app';
import request from 'supertest';
import { FetchWeatherDto } from '@modules/weatherCore/weather/dto';
import { HttpStatus } from '@common/enums';

describe('Weather', () => {
    let app: App;

    beforeAll(async () => {
        app = await startServer();
    });

    describe('POST /weather', () => {
        let initialResponseTime: number;

        it('should fetch weather data from the OpenWeather API', async () => {
            const body: FetchWeatherDto = {
                cityName: 'London',
                country: 'GB',
            };

            const startTime = Date.now();

            const response = await request(app).post('/weather').send(body);

            initialResponseTime = Date.now() - startTime;

            expect(response.statusCode).toBe(HttpStatus.CREATED);
        });
    });
});
