import { NextFunction, Request, Response } from 'express';
import { UnauthorizedException } from '../exceptions';
import { JWTHelper } from '../helpers/jwt.helper';
import { UserJWTPayload } from '@app/modules/account/authentication';

export const authentication = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const token = req.headers['authorization']?.replace('Bearer ', '');

    if (!token) {
        throw new UnauthorizedException();
    }

    const userData = JWTHelper.verifyToken<UserJWTPayload>(token);

    if (!userData) {
        throw new UnauthorizedException();
    }

    req.user = userData;

    next();
};
