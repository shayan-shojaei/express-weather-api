import { HttpStatus } from '@common/enums';
import { HttpException } from '@common/exceptions';

export class UnauthorizedException extends HttpException {
    constructor(message?: string) {
        super(message || 'Unauthorized', HttpStatus.UNAUTHORIZED);
    }
}
