import { ClassConstructor } from 'class-transformer';
import * as express from 'express';

declare global {
    namespace Express {
        interface Response {
            transformAndSend: <T extends object>(
                data: any,
                cls: ClassConstructor<T>,
            ) => void;
        }
    }
}
