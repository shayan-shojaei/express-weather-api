import { startServer } from '@app/app';
import { HttpStatus } from '@common/enums';
import { faker } from '@faker-js/faker';
import { LoginDto, SignupDto } from '@modules/account/authentication';
import { Server } from 'http';
import request from 'supertest';

describe('Authentication', () => {
    let app: Server;

    beforeAll(async () => {
        app = await startServer();
    });

    afterAll(() => app.close());

    describe('POST /account/auth/signup', () => {
        it('should throw an error if the request body is empty', async () => {
            const response = await request(app).post('/account/auth/signup');

            expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
        });

        it('should throw an error if the email is invalid', async () => {
            const body: SignupDto = {
                email: 'invalid-email',
                password: faker.internet.password(),
            };

            const response = await request(app)
                .post('/account/auth/signup')
                .send(body);

            expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
        });

        it('should throw an error if the password is not strong enough', async () => {
            const body: SignupDto = {
                email: faker.internet.email(),
                password: 'password',
            };

            const response = await request(app)
                .post('/account/auth/signup')
                .send(body);

            expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
        });

        it('should create a new user', async () => {
            const body: SignupDto = {
                email: faker.internet.email(),
                password: faker.internet.password({
                    length: 16,
                }),
            };

            const response = await request(app)
                .post('/account/auth/signup')
                .send(body);

            expect(response.statusCode).toBe(HttpStatus.CREATED);

            expect(response.body).toHaveProperty('token');
        });
    });

    describe('POST /account/auth/login', () => {
        let loginBody: LoginDto;
        beforeAll(async () => {
            const body: SignupDto = {
                email: faker.internet.email(),
                password: faker.internet.password({
                    length: 16,
                }),
            };

            await request(app).post('/account/auth/signup').send(body);

            loginBody = {
                email: body.email,
                password: body.password,
            };
        });

        it('should throw an error if the request body is empty', async () => {
            const response = await request(app).post('/account/auth/login');

            expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
        });

        it('should throw an error if the email is invalid', async () => {
            const body = {
                email: 'invalid-email',
                password: loginBody.password,
            };

            const response = await request(app)
                .post('/account/auth/login')
                .send(body);

            expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
        });

        it('should throw an error if the email is not correct', async () => {
            const body = {
                email: faker.internet.email(),
                password: loginBody.password,
            };

            const response = await request(app)
                .post('/account/auth/login')
                .send(body);

            expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
        });

        it('should throw an error if the password is invalid', async () => {
            const body = {
                email: loginBody.email,
                password: 'invalid-password',
            };

            const response = await request(app)
                .post('/account/auth/login')
                .send(body);

            expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
        });

        it('should return a token if the credentials are valid', async () => {
            const response = await request(app)
                .post('/account/auth/login')
                .send(loginBody);

            expect(response.statusCode).toBe(HttpStatus.OK);

            expect(response.body).toHaveProperty('token');
        });
    });

    describe('GET /account/users/me', () => {
        let token: string;
        const body: SignupDto = {
            email: faker.internet.email(),
            password: faker.internet.password({
                length: 16,
            }),
        };

        beforeAll(async () => {
            const response = await request(app)
                .post('/account/auth/signup')
                .send(body);

            token = `Bearer ${response.body.token}`;
        });

        it('should throw an error if the token is not provided', async () => {
            const response = await request(app).get('/account/users/me');

            expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED);
        });

        it('should throw an error if the token is invalid', async () => {
            const response = await request(app)
                .get('/account/users/me')
                .set('Authorization', 'Bearer invalid-token');

            expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED);
        });

        it('should return the current user', async () => {
            const response = await request(app)
                .get('/account/users/me')
                .set('authorization', token);

            expect(response.statusCode).toBe(HttpStatus.OK);

            expect(response.body.email).toBe(body.email);
        });
    });
});
