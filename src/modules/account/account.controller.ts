import { AuthenticationController } from '@modules/account/authentication/authentication.controller';
import { UserController } from '@modules/account/user/user.controller';
import { Router } from 'express';

export const AccountController = () => {
    const router = Router();

    router.use('/auth', AuthenticationController());
    router.use('/users', UserController());

    return router;
};
