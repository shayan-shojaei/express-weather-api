import { Request, Response } from 'express';

export const catchMissingRoutes = (req: Request, res: Response) => {
    res.sendStatus(404);
};
