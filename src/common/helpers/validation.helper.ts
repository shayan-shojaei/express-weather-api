import { BadRequestException } from '@common/exceptions';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

export class ValidationHelper {
    static async validate<T extends object>(
        body: unknown = {},
        classType: ClassConstructor<T>,
    ): Promise<T> {
        const instance = plainToInstance(classType, body);
        const errors = await validate(instance);

        if (errors.length > 0) {
            const errorMessages = Object.fromEntries(
                errors.map((error) => [
                    error.property,
                    Object.values(error.constraints),
                ]),
            );

            throw new BadRequestException('Validation Error', errorMessages);
        }

        return instance;
    }
}
