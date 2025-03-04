import { Config } from '@common/config';
import Redis from 'ioredis';

export class Cache {
    private static redisClient: Redis;

    static async connect() {
        this.redisClient = new Redis({
            host: Config.Redis.HOST,
            port: Config.Redis.PORT,
            username: Config.Redis.USERNAME,
            password: Config.Redis.PASSWORD,
        });
    }

    static close() {
        this.redisClient.disconnect();
    }

    static getClient(): Redis {
        if (!this.redisClient) {
            throw new Error('Redis client is not connected');
        }

        return this.redisClient;
    }
}
