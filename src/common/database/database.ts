import { Config } from '@common/config';
import { DataSource, EntityTarget, Repository } from 'typeorm';

export class Database {
    private static datasource: DataSource;

    static async initialize(): Promise<void> {
        if (Database.datasource) {
            return;
        }

        Database.datasource = new DataSource({
            type: 'postgres',
            host: Config.Database.HOST,
            port: Config.Database.PORT,
            username: Config.Database.USERNAME,
            password: Config.Database.PASSWORD,
            database: Config.Database.DATABASE,
            entities: ['src/**/*.entity.ts'],
            synchronize: true,
        });

        await Database.datasource.initialize();
    }

    static async close(): Promise<void> {
        await Database.datasource.destroy();
    }

    static getRepository<T>(entity: EntityTarget<T>): Repository<T> {
        return Database.datasource.getRepository(entity);
    }
}
