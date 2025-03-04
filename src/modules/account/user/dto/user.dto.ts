import { Exclude, Expose } from 'class-transformer';

/**
 * @swagger
 * components:
 *   schemas:
 *     UserDto:
 *       type: object
 *       properties:
 *         id:
 *          type: string
 *          format: uuid
 *         email:
 *           type: string
 *           example: 'someone@somewhere.ir'
 *         createdAt:
 *           type: string
 *           format: date-time
 */
@Exclude()
export class UserDto {
    @Expose()
    id: string;

    @Expose()
    email: string;

    @Expose()
    createdAt: Date;
}
