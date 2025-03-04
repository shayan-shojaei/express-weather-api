import { HttpStatus } from '@common/enums';
import { HttpException } from '@common/exceptions';

export class NotFoundException extends HttpException {
    constructor(message?: string) {
        super(message || 'Not Found', HttpStatus.NOT_FOUND);
    }
}
