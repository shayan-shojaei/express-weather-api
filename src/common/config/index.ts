import 'dotenv/config';

export const Config = {
    Server: {
        PORT: +process.env.PORT || 3000,
    },
    Environment: {
        NAME: (process.env.NODE_ENV || 'development') as
            | 'development'
            | 'production'
            | 'local'
            | 'test',
        IS_PRODUCTION: process.env.NODE_ENV === 'production',
        IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
        IS_LOCAL: process.env.NODE_ENV === 'local',
        IS_TEST: process.env.NODE_ENV === 'test',
    },
    Database: {
        HOST: process.env.PGSQL_HOST,
        PORT: +process.env.PGSQL_PORT || 5432,
        USERNAME: process.env.PGSQL_USERNAME,
        PASSWORD: process.env.PGSQL_PASSWORD,
        DATABASE: process.env.PGSQL_DATABASE || 'weather_app',
    },
    Redis: {
        HOST: process.env.REDIS_HOST,
        PORT: +process.env.REDIS_PORT || 6379,
        USERNAME: process.env.REDIS_USERNAME,
        PASSWORD: process.env.REDIS_PASSWORD,
        TTL: +process.env.REDIS_EXPIRATION || 60,
    },
    OpenWeatherMap: {
        GEOCODING_API_URL: process.env.OPENWEATHERMAP_GEOCODING_API_URL,
        API_URL: process.env.OPENWEATHERMAP_API_URL,
        API_KEY: process.env.OPENWEATHERMAP_API_KEY,
    },
};
