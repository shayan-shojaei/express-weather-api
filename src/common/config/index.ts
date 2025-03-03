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
    Database: {},
};
