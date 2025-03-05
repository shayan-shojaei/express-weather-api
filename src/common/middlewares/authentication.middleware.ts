import { UnauthorizedException } from '@common/exceptions';
import { JWTHelper } from '@common/helpers';
import { UserJWTPayload } from '@modules/account/authentication';
import { NextFunction, Request, Response } from 'express';

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
