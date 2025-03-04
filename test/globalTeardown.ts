import 'tsconfig-paths/register';

import { Database } from '@common/database';
import { User } from '@modules/account/user';

export default async function globalTeardown() {
    const userRepository = Database.getRepository(User);

    await userRepository.delete({});

    await Database.close();
}
