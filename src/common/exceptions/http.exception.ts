import { HttpStatus } from '@common/enums';

export class HttpException extends Error {
    status: number;

    constructor(message: string, status: HttpStatus) {
        super(message);
        this.status = status;
    }
}
