import { NextFunction, Request, Response } from "express";

export class StatusController {

    public status(req: Request, res: Response, next: NextFunction) {
        return res.status(200).json({ message: "I'm strong and healthy!..." });
    }
    
}