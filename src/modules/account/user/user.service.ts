import { SignupDto } from '@modules/account/authentication';
import { User } from '@modules/account/user';
import { UserRepository } from '@modules/account/user/user.repository';

export class UserService {
    private readonly userRepository = new UserRepository();

    constructor() {}

    async findOneByEmail(email: string): Promise<User> {
        return this.userRepository.findOneByEmail(email);
    }

    async create(signupDto: SignupDto): Promise<User> {
        return this.userRepository.create(signupDto);
    }

    async findOneById(id: string): Promise<User> {
        return this.userRepository.findOneById(id);
    }
}
