import { IsNotEmpty, IsString } from 'class-validator';
import { SignupDto } from './signup.dto';

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginDto:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           example: 'someone@somewhere.ir'
 *           required: true
 *         password:
 *           type: string
 *           example: 'Abc12345'
 *           required: true
 */
export class LoginDto extends SignupDto {
    @IsNotEmpty()
    @IsString()
    declare password: string;
}
