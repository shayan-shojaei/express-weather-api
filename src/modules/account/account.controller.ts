import { Router } from 'express';
import { AuthenticationController } from './authentication/authentication.controller';
import { UserController } from './user/user.controller';

export const AccountController = () => {
    const router = Router();

    router.use('/auth', AuthenticationController());
    router.use('/users', UserController());

    return router;
};
