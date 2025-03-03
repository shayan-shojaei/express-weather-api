import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'weather_data' })
export class Weather {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'city_name' })
    cityName: string;

    @Column()
    country: string;

    @Column({ type: 'float' })
    temperature: number;

    @Column({ nullable: true })
    description: string;

    @Column({ type: 'int' })
    humidity: number;

    @Column({ name: 'wind_speed', type: 'float' })
    windSpeed: number;

    @CreateDateColumn({ name: 'fetched_at' })
    fetchedAt: Date;

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt?: Date;
}
