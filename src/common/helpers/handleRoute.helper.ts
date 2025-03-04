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

/**
 * Wrapper for route handlers to handle errors and validation
 * @param func - The route handler function
 * @param options - Options for validating the request body and query
 * @returns The route handler
 */
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
            // If options.body is defined, validate the request body
            if (options?.body) {
                req.body = await ValidationHelper.validate(
                    req.body,
                    options.body,
                );
            }

            // If options.query is defined, validate the request query
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
