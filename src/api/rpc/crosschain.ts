import { NextFunction, Request, Response } from "express";
import axios from "axios";
import { env } from "../../config/global";

export class CrosschainController {
    public async crosschainTokens(req: Request, res: Response, next: NextFunction) {
        return axios.get(`${env.RPC_URL}/crosschain/tokens`)
            .then(response => {
                return res.status(200).json(response.data);
            })
            .catch(err => {
                return res.status(400).json(err);
            })
    }

    public async crosschainTokenBalance(req: Request, res: Response, next: NextFunction) {
        const { tokenAddress } =  req.params;
        return axios.get(`${env.RPC_URL}/crosschain/tokens/${tokenAddress}/balance`)
            .then(response => {
                return res.status(200).json(response.data);
            })
            .catch(err => {
                return res.status(400).json(err);
            })
    }
    
    public async crosschainTokenTransactions(req: Request, res: Response, next: NextFunction) {
        const { tokenAddress } =  req.params;
        return axios.get(`${env.RPC_URL}/crosschain/tokens/${tokenAddress}/transactions`)
            .then(response => {
                return res.status(200).json(response.data);
            })
            .catch(err => {
                return res.status(400).json(err);
            })
    }
}