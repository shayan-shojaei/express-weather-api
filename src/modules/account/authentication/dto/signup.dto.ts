import {
    IsEmail,
    IsNotEmpty,
    IsString,
    IsStrongPassword,
} from 'class-validator';

/**
 * @swagger
 * components:
 *   schemas:
 *     SignupDto:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           example: 'someone@somewhere.ir'
 *           required: true
 *         password:
 *           type: string
 *           example: 'Abc12345'
 *           description: Password must be at least 8 characters long and contain at least 1 number,
 *                       1 lowercase letter and 1 uppercase letter.
 *           required: true
 */
export class SignupDto {
    @IsEmail()
    @IsNotEmpty()
    @IsString()
    email: string;

    @IsStrongPassword({
        minLength: 8,
        minNumbers: 1,
        minLowercase: 1,
        minUppercase: 1,
        minSymbols: 0,
    })
    @IsNotEmpty()
    @IsString()
    password: string;
}
