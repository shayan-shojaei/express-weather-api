import { JWTPayload } from '@modules/account/authentication';
import { ClassConstructor } from 'class-transformer';

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
