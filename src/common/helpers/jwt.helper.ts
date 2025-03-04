import { Config } from '@common/config';
import { sign, verify } from 'jsonwebtoken';

export class JWTHelper {
    /**
     * Generates a JWT token
     *
     * The token is signed using the JWT_SECRET from the environment variables
     * and has an expiry time of JWT_EXPIRATION days
     *
     * @param payload The payload to sign
     * @returns The generated token
     */
    static generateToken<T extends object>(payload: T): string {
        return sign(payload, Config.JWT.SECRET, {
            expiresIn: `${Config.JWT.EXPIRATION}d`,
        });
    }

    /**
     * Verifies a JWT token
     *
     * @param token The token to verify
     * @returns returns the payload of the token if it is valid, otherwise null
     */
    static verifyToken<T>(token: string): T {
        try {
            return verify(token, Config.JWT.SECRET) as T;
        } catch (e) {
            return null;
        }
    }
}
