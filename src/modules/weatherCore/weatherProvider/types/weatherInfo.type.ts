/**
 * OpenWeatherMap API response type
 */
export type WeatherInfo = {
    cod: 200;
    name: string;
    sys: {
        country: string;
    };
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
