import { Config } from '@common/config';
import express from 'express';

const app = express();

app.listen(Config.Server.PORT, (error?: Error) => {
    if (error) {
        console.error('An error occurred:');
        console.error(error);
        process.exit(1);
    }

    console.log(`Server is running on port ${Config.Server.PORT}`);
});
