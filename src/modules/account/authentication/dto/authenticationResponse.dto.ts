import { Exclude, Expose } from 'class-transformer';

/**
 * @swagger
 *
 * components:
 *   schemas:
 *     AuthenticationResponseDto:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           example: 'eyJhbGciOiJI ...'
 */
@Exclude()
export class AuthenticationResponseDto {
    @Expose()
    token: string;
}
