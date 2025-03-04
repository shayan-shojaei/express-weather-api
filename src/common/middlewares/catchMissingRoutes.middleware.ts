import { Request, Response } from 'express';

export const catchMissingRoutes = (req: Request, res: Response) => {
    // If headers have already been sent, do nothing
    if (res.headersSent) return;

    res.sendStatus(404);
};
