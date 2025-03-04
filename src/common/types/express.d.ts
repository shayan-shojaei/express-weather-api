import { JWTPayload } from '@app/modules/account/authentication';
import { ClassConstructor } from 'class-transformer';
import * as express from 'express';

declare global {
    namespace Express {
        interface Request {
            user?: JWTPayload;
        }

        interface Response {
            transformAndSend: <T extends object>(
                data: any,
                cls: ClassConstructor<T>,
            ) => void;
        }
    }
}
