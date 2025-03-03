export type WeatherInfo = {
    cod: 200;
    weather: {
        main: string;
        description: string;
    }[];
    visibility: number;
    wind: {
        speed: number;
    };
    main: {
        temp: number;
        humidity: number;
        feels_like: number;
    };
};
