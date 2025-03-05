import { ClassConstructor, plainToInstance } from 'class-transformer';
import { NextFunction, Request, Response } from 'express';

export const transformResponse = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    res.transformAndSend = function <T>(data: any, cls: ClassConstructor<T>) {
        data = plainToInstance(cls, data);

        res.send(data);
    };

    next();
};
