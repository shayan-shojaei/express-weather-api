import { Config } from '@common/config';
import { Database } from '@common/database';
import { WeatherController } from '@domains/weather/weather.controller';
import express from 'express';

const startServer = async () => {
    const app = express();

    // Initialize database connection
    await Database.initialize();
    console.log('Database connection established');

    // Middlewares
    app.use(express.json());

    // Routes
    app.use('/weather', WeatherController());

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
    });
};

void startServer();
