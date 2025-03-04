import { NextFunction, Request, Response } from 'express';
import { ClassConstructor, plainToInstance } from 'class-transformer';

export const transformResponse = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    res.transformAndSend = function <T>(data: T, cls: ClassConstructor<T>) {
        data = plainToInstance(cls, data);

        res.send(data);
    };

    next();
};
