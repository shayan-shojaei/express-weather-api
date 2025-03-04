import { Cache } from '@common/cache';
import { Config } from '@common/config';
import { Database } from '@common/database';
import { catchMissingRoutes, errorHandler } from '@common/middlewares';
import { WeatherController } from '@modules/weatherCore/weather/weather.controller';
import express from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerSpecs = swaggerJSDoc({
    apis: ['src/modules/**/*.controller.ts', 'src/**/*.dto.ts'],
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Weather API',
            version: '1.0.0',
        },
        tags: [{ name: 'Weather', description: 'Weather related endpoints' }],
    },
});

const startServer = async () => {
    const app = express();

    // Initialize database connection
    await Database.initialize();
    console.log('Database connection established');

    // Initialize database connection
    await Cache.connect();
    console.log('Cache connection established');

    // Middlewares
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

    // Routes
    app.use('/weather', WeatherController());

    // Error handler
    app.use(errorHandler);
    app.use(catchMissingRoutes);

    // Start server
    app.listen(Config.Server.PORT, async (error?: Error) => {
        if (error) {
            console.error('An error occurred:');
            console.error(error);
            process.exit(1);
        }

        console.log(`Server is running on port ${Config.Server.PORT}`);
    });

    // Shutdown hook
    process.on('exit', async () => {
        await Database.close();
        Cache.close();
    });
};

void startServer();
