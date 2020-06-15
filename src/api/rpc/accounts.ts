import { NextFunction, Request, Response } from "express";
import axios from "axios";
import { env } from "../../config/global";
import Tx from "../../entity/db-tx";

export class AccountController {
    public async getAccount(req: Request, res: Response, next: NextFunction) {
        const { address } =  req.params;
        return axios.get(`${env.RPC_URL}/auth/accounts/${address}`)
            .then(response => {
                Tx.create(response.data)
                return res.status(200).json(response.data);
            })
            .catch(err => {
                return res.status(400).json(err);
            })
    }
}