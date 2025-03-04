import 'tsconfig-paths/register';

import { BcryptHelper } from '../src/common/helpers';
import { Database } from '../src/common/database';
import { User } from '../src/modules/account/user';

export default async function globalSetup() {
    await Database.initialize();

    const userRepository = Database.getRepository(User);

    await userRepository.save({
        email: 'user@test.com',
        password: await BcryptHelper.hashPassword('Pass1234'),
    });
}
