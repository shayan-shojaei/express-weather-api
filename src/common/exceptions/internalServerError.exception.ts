import { HttpException } from '@common/exceptions';

export class InternalServerErrorException extends HttpException {
    constructor(message?: string) {
        super(message || 'Internal Server Error', 500);
    }
}
