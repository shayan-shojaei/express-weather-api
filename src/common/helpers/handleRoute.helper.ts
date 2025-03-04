import { ClassConstructor } from 'class-transformer';
import { NextFunction, Request, Response } from 'express';
import { ValidationHelper } from './validation.helper';
import { QueryParams } from '@common/types';

export type HandleRouteOptions<
    BodyType extends object,
    QueryType extends object,
> = {
    body?: ClassConstructor<BodyType>;
    query?: ClassConstructor<QueryType>;
};

export const handleRoute = <
    T,
    BodyType extends object,
    QueryType extends object,
>(
    func: (req: Request, res: Response, next: NextFunction) => Promise<T>,
    options?: HandleRouteOptions<BodyType, QueryType>,
) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (options?.body) {
                req.body = await ValidationHelper.validate(
                    req.body,
                    options.body,
                );
            }

            if (options?.query) {
                req.query = (await ValidationHelper.validate(
                    req.query,
                    options.query,
                )) as QueryParams;
            }

            await func(req, res, next);
        } catch (error) {
            next(error);
        } finally {
            next();
        }
    };
};
