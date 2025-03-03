import { ClassConstructor } from 'class-transformer';
import { NextFunction, Request, Response } from 'express';
import { ValidationHelper } from './validation.helper';

export type HandleRouteOptions<BodyType extends object> = {
    body?: ClassConstructor<BodyType>;
};

export const handleRoute = <T, BodyType extends object>(
    func: (req: Request, res: Response, next: NextFunction) => Promise<T>,
    options?: HandleRouteOptions<BodyType>,
) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (options?.body) {
                req.body = await ValidationHelper.validate(
                    req.body,
                    options.body,
                );
            }

            await func(req, res, next);
        } catch (error) {
            next(error);
        } finally {
            next();
        }
    };
};
