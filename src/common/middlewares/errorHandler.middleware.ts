import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@common/exceptions';

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    if (err instanceof HttpException) {
        const { status, ...error } = err;
        res.status(status).json({ message: err.message, ...error });
    } else {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }

    next();
};
