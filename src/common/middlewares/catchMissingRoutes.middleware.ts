import { Request, Response } from 'express';

export const catchMissingRoutes = (req: Request, res: Response) => {
    if (res.headersSent) return;

    res.sendStatus(404);
};
