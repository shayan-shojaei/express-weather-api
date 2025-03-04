import { SignupDto } from '../authentication/dto';
import { User } from './entity';
import { UserRepository } from './user.repository';

export class UserService {
    private readonly userRepository = new UserRepository();

    constructor() {}

    async findOneByEmail(email: string): Promise<User> {
        return this.userRepository.findOneByEmail(email);
    }

    async create(signupDto: SignupDto): Promise<User> {
        return this.userRepository.create(signupDto);
    }
}
