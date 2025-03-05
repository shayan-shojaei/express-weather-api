import { JWTHelper } from '@app/common/helpers/jwt.helper';
import { BadRequestException } from '@common/exceptions';
import { BcryptHelper } from '@common/helpers';
import { User } from '../user';
import { UserService } from '../user/user.service';
import { LoginDto, SignupDto } from './dto';
import { UserJWTPayload } from './types';

export class AuthenticationService {
    private readonly userService = new UserService();

    constructor() {}

    async signup(signupDto: SignupDto): Promise<string> {
        const existingUser = await this.userService.findOneByEmail(
            signupDto.email,
        );

        if (existingUser) {
            throw new BadRequestException('User already exists');
        }

        // Hash the password before saving it to the database
        signupDto.password = await BcryptHelper.hashPassword(
            signupDto.password,
        );

        const createdUser = await this.userService.create(signupDto);

        return this.generateToken(createdUser);
    }

    async login(loginDto: LoginDto): Promise<string> {
        const existingUser = await this.userService.findOneByEmail(
            loginDto.email,
        );

        if (!existingUser) {
            throw new BadRequestException('Invalid credentials');
        }

        const isPasswordCorrect = await BcryptHelper.comparePassword(
            loginDto.password, // plain text password
            existingUser.password, // hashed password
        );

        if (!isPasswordCorrect) {
            throw new BadRequestException('Invalid credentials');
        }

        return this.generateToken(existingUser);
    }

    private async generateToken(user: User): Promise<string> {
        const payload: UserJWTPayload = {
            id: user.id,
            email: user.email,
        };

        return JWTHelper.generateToken(payload);
    }
}
