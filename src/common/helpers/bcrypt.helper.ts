import { compare, hash } from 'bcrypt';

export class BcryptHelper {
    /**
     * Hashes a password using bcrypt and 10 rounds of salting
     *
     * @param password The password to hash
     * @returns The hashed password
     */
    static async hashPassword(password: string) {
        return hash(password, 10);
    }

    /**
     * Compares a password with a hash using bcrypt
     *
     * @param password The password to compare
     * @param hash The hash to compare
     * @returns A promise that resolves to a boolean indicating if the password matches the hash
     */
    static async comparePassword(password: string, hash: string) {
        return compare(password, hash);
    }
}
