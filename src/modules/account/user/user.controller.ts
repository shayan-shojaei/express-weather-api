import { Router } from 'express';
import { handleRoute } from '@common/helpers';
import { HttpStatus } from '@common/enums';
import { UserService } from './user.service';
import { authentication } from '@common/middlewares';
import { UserDto } from './dto';

export const UserController = () => {
    const router = Router();

    const userService = new UserService();

    /**
     * @swagger
     *
     * /account/users/me:
     *   get:
     *     tags: [User]
     *     summary: Get the current user's details
     *     security:
     *      - bearerAuth: []
     *     responses:
     *       200:
     *         description: The current user's details
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/UserDto'
     *       401:
     *        description: Unauthorized
     */
    router.use(authentication).get(
        '/me',
        handleRoute(async (req, res) => {
            const user = await userService.findOneById(req.user.id);

            return res.status(HttpStatus.OK).transformAndSend(user, UserDto);
        }),
    );

    return router;
};
