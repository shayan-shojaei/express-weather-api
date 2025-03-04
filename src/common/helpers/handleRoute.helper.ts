import { ClassConstructor } from 'class-transformer';
import { NextFunction, Request, Response } from 'express';
import { ValidationHelper } from './validation.helper';
import type { QueryParams } from '@common/types';
import { HttpStatus } from '../enums';
import { UnauthorizedException } from '../exceptions';

export type HandleRouteOptions<
    BodyType extends object,
    QueryType extends object,
> = {
    body?: ClassConstructor<BodyType>;
    query?: ClassConstructor<QueryType>;
    authenticated?: boolean;
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
    func: (
        req: Request<any, any, BodyType, QueryType>,
        res: Response,
        next: NextFunction,
    ) => Promise<T>,
    options?: HandleRouteOptions<BodyType, QueryType>,
) => {
    return async (
        req: Request<any, any, BodyType, QueryType>,
        res: Response,
        next: NextFunction,
    ) => {
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
                req.query = await ValidationHelper.validate(
                    req.query,
                    options.query,
                );
            }

            if (options?.authenticated) {
                if (!req.user) {
                    throw new UnauthorizedException();
                }
            }

            await func(req, res, next);
        } catch (error) {
            next(error);
        } finally {
            next();
        }
    };
};
