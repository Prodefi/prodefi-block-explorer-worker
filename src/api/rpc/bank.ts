import { NextFunction, Request, Response } from "express";
import bankVendor from "../../vendor/bank";
import { logger } from "../../config/logger";

export class BankController {
    public async getBankBalance(req: Request, res: Response, next: NextFunction) {
        const { address } = req.params;
        bankVendor.getBankBalance(address)
            .then((response: any) => {
                if (response) {
                    return res.status(200).json(response);
                }
            })
            .catch(err => {
                logger.error(`getBankBalance with err: ${err}`);
                return res.status(400).json({ message: "Bad request!..." });
            });
    }
}