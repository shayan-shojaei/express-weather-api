import { HttpStatus } from '@common/enums';
import { HttpException } from '@common/exceptions';

export class BadRequestException extends HttpException {
    constructor(
        message?: string,
        private readonly error?: object | object[] | string | string[],
    ) {
        super(message || 'Bad Request', HttpStatus.BAD_REQUEST);
    }
}
