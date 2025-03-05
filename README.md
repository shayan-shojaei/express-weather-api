# Weather API Project

This project is a simple weather API project that uses the OpenWeatherMap API to get the weather data for a given city. Express.js is used to create a simple server that listens for requests and responds with the weather data. The project is written in TypeScript and uses the Axios library to make HTTP requests.

## Design

### OpenWeatherMap API

The OpenWeatherMap API is used to get the weather data for a given city. The API provides a simple way to get the current weather data for a city by providing the city name and country code. The API returns the temperature, humidity, wind speed, and weather description for the city.

### Database

PostgreSQL is used as the database for this project. Weather data is persisted in the `weather_data` table. The table has the following columns:

- `id`: A unique identifier for the weather data.
- `cityName`: The name of the city for which the weather data is retrieved.
- `country`: The country code.
- `temperature`: The temperature in the city.
- `humidity`: The humidity in the city.
- `windSpeed`: The wind speed in the city.
- `description`: The weather description. (e.g. "clear sky", "few clouds", etc.)
- `fetchedAt`: The timestamp when the weather data was fetched from the OpenWeatherMap API.
- `createdAt`: The timestamp when the record was created.
- `updatedAt`: The timestamp when the record was last updated.

Users can also authenticate and the user data is stored in the `users` table. The table has the following columns:

- `id`: A unique identifier for the user.
- `email`: The email address of the user.
- `password`: The hashed password of the user.
- `createdAt`: The timestamp when the record was created.
- `updatedAt`: The timestamp when the record was last updated.
- `deletedAt`: The timestamp when the record was deleted.

### Cache

Redis is used as the cache for this project. The weather data is cached in Redis to reduce the number of requests to the *OpenWeatherMap* API. The cache is set to expire after 5 minutes. If the weather data is requested again within the 5-minute window, the data is retrieved from the cache instead of making a request to the API.

### Documentation

The API is documented using Swagger and `swagger-jsdoc`. The Swagger UI is available at `/docs`.

### Authentication

Bearer token authentication is used to authenticate users. Users can sign up and log in to get a jwt access token. The access token is used to authenticate requests to the API.

### Error Handling

Errors are handled using custom http exception classes to avoid duplicating error handling logic in the controllers. The error handler middleware catches errors thrown in the controllers and sends an appropriate response to the client.

### Testing

The project uses Jest and Supertest for testing. There are e2e tests available in the `test` directory. The tests cover the API endpoints and the error handling logic.

## Usage

### OpenWeatherMap API Key

An API key is required to use the OpenWeatherMap API. You can get an API key by signing up on the [OpenWeatherMap website](https://home.openweathermap.org/api_keys).

### Environment Variables

Create a `.env` file in the root directory of the project. You can copy the `.env.example` file and update the values with your own.

```bash
cp .env.example .env
```

The `.env` file should contain the following environment variables:

```env
NODE_ENV=development # development, production, test, local

PORT=3000

PGSQL_HOST=<Your PostgreSQL host>
PGSQL_PORT=<Your PostgreSQL port>
PGSQL_USER=<Your PostgreSQL username>
PGSQL_PASSWORD=<Your PostgreSQL password>
PGSQL_DATABASE=<Your PostgreSQL database>

REDIS_HOST=<Your Redis host>
REDIS_PORT=<Your Redis port>
REDIS_USERNAME=<Your Redis username>
REDIS_PASSWORD=<Your Redis password>
REDIS_EXPIRATION=<Your Redis expiration time in seconds>

OPENWEATHERMAP_API_URL=https://api.openweathermap.org/data/3.0/
OPENWEATHERMAP_GEOCODING_API_URL=https://api.openweathermap.org/geo/1.0/
OPENWEATHERMAP_API_KEY=<Your OpenWeatherMap API key>

JWT_SECRET=<Your JWT secret>
JWT_EXPIRATION=<Your JWT expiration time in days>
```

### Docker

You can run the project using Docker. Make sure you have Docker and Docker Compose installed on your machine.

```bash
docker-compose up --build -d
```

This will build the Docker image of the app along with an instance of PostgreSQL and Redis. The app will be running on `http://localhost:3000`.

### Local Development

You can run the project locally by following these steps:

#### Install the dependencies

```bash
npm install
```

#### Development mode

```bash
npm run start:dev
```

This will start the server in development mode using `ts-node-dev` which will automatically restart the server when changes are made to the source code.

#### Production mode

To run the server in production mode, build the project and start the server:

```bash
npm run build
npm run start:prod
```

Or you can use the following command to build and start the server in one go:

```bash
npm run start
```

#### Testing

To run the tests, use the following command:

```bash
npm run test:e2e
```
