import { Router } from 'express';
import { AuthenticationController } from './authentication/authentication.controller';

export const AccountController = () => {
    const router = Router();

    router.use('/auth', AuthenticationController());

    return router;
};
