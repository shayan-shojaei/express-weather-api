import { HttpStatus } from '@common/enums';
import { handleRoute } from '@common/helpers';
import {
    AuthenticationResponseDto,
    LoginDto,
    SignupDto,
} from '@modules/account/authentication';
import { AuthenticationService } from '@modules/account/authentication/authentication.service';
import { Router } from 'express';

export const AuthenticationController = () => {
    const router = Router();

    const authenticationService = new AuthenticationService();

    /**
     * @swagger
     *
     * /account/auth/signup:
     *   post:
     *     tags: [Authentication]
     *     summary: Create a new user account
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/SignupDto'
     *     responses:
     *       201:
     *         description:
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/AuthenticationResponseDto'
     *       400:
     *         description: Invalid request body or User already exists
     */
    router.post(
        '/signup',
        handleRoute(
            async (req, res) => {
                const token = await authenticationService.signup(req.body);

                return res
                    .status(HttpStatus.CREATED)
                    .transformAndSend({ token }, AuthenticationResponseDto);
            },
            {
                body: SignupDto,
            },
        ),
    );

    /**
     * @swagger
     *
     * /account/auth/login:
     *   post:
     *     tags: [Authentication]
     *     summary: Log in to an existing user account
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/LoginDto'
     *     responses:
     *       200:
     *         description:
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/AuthenticationResponseDto'
     *       400:
     *         description: Invalid request body or Invalid credentials
     */
    router.post(
        '/login',
        handleRoute(
            async (req, res) => {
                const token = await authenticationService.login(req.body);

                return res
                    .status(HttpStatus.OK)
                    .transformAndSend({ token }, AuthenticationResponseDto);
            },
            {
                body: LoginDto,
            },
        ),
    );

    return router;
};
