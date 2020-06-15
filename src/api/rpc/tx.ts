import { NextFunction, Request, Response } from "express";
import axios from "axios";
import { env } from "../../config/global";
import Tx from "../../entity/db-tx";
import txServiceInstance from "../../vendor/transaction";
import { logger } from "../../config/logger";

export class TxController {
    public getTxByTxHash(req: Request, res: Response, next: NextFunction) {
        const { hash } =  req.params;
        txServiceInstance.getTxByTxHash(hash)
            .then((response: any) => {
                if (response){
                    return res.status(200).json(response);
                }
            })
            .catch(err => {
                logger.error(`getTxByTxHash with err: ${err}`);
                return res.status(400).json({ message: "Bad request!..." });
            });
    }

    public getTx(req: Request, res: Response, next: NextFunction) {
        const { tx } =  req.params;
        txServiceInstance.getTx(tx)
        .then((response: any) => {
            if (response){
                return res.status(200).json(response);
            }
        })
        .catch(err => {
            logger.error(`getTxByTxHash with err: ${err}`);
            return res.status(400).json({ message: "Bad request!..." });
        });
    }

    // TODO: change to service 
    public async searchTransactions(req: Request, res: Response, next: NextFunction) {
        const params =  req.query;
        return axios.get(`${env.RPC_URL}/txs`, { params })
            .then(response => {
                if (response.data && response.data.txs) {
                    Tx.insertMany(response.data.txs)
                    return res.status(200).json(response.data);
                } else {
                    return res.status(400).json({ message: "Bad request!..." });
                }
            })
            .catch(err => {
                return res.status(400).json(err);
            })
    }

    public async listing(req: Request, res: Response, next: NextFunction) {
        const inputLimit = req.query.limit ? Number(req.query.limit) : 0;
        const limit = inputLimit > 0 && inputLimit < env.QUERY_MAX_LIMIT ? inputLimit : env.QUERY_MAX_LIMIT;
        const inputPage = req.query.page ? Number(req.query.page) : 1;
        const page = inputPage > 0 && inputPage < env.QUERY_MAX_PAGE ? inputPage : env.QUERY_MAX_PAGE;
        
        let conditions = {};
        // let direction = -1; // default is DESC in mongoose, value 1 is ASC
        // let isReverseResult = false; // default is DESC in mongoose

        // const unknown = -1;
        // const maxSkipPage = 10000; // max skip 100 page
    
        // const totalPage = req.query.totalPage ? Number(req.query.totalPage) : unknown;
       

        let offset = 0;
        offset = (page -1) * limit;

        // if (totalPage == unknown || page <= maxSkipPage) {
        //     offset = (page -1) * limit;
        // } else if (totalPage - page < maxSkipPage) {
        //     offset = (totalPage - page) * limit;
        //     direction = 1;
        //     isReverseResult = true;
        // } else {
        //     const previousPage = req.query.previousPage ? Number(req.query.previousPage) : unknown;
        //     const previousFirstItemId = req.query.previousFirstItemId ? req.query.previousFirstItemId : "";
    
        //     if (previousPage == unknown || previousFirstItemId == ""){
        //         res.status(400).json({
        //             "message": "txs_customListing_invalid_input",
        //             "detail": "wrong_data"
        //         });
        //     }

        //     const isbackPage = page - previousPage < 0 ? true: false;
        //     if(isbackPage){
        //         conditions = {
        //             '_id': {$gte : previousFirstItemId}
        //         }
        //         offset = (page - previousPage - 1) * limit;
        //         direction = 1;
        //     } else {
        //         conditions = {
        //             '_id': {$lte : previousFirstItemId}
        //         }
        //         offset = (page - previousPage) * limit;
        //         direction = -1;
        //     }
        // }
        Promise.all([
            Tx.find(
                conditions,
                { 
                    '_id': 1,
                    'txhash': 1,
                    'height': 1,
                    'tx.value.msg': 1   
                }
                , { sort: { 'height': -1 } }).skip(offset).limit(limit).exec(),
            Tx.find({},{}).count().exec()
        ]).then((data: any) => {
            const result = {
                txs: data[0],
                total: data[1],
                page: page,
                perPage: limit
            } 
            return res.status(200).json(result);
        })
        .catch(err => {
            return res.status(400).json(err);
        })
    }

    public async latestTx(req: Request, res: Response, next: NextFunction) {
        const result: any = await Tx.findOne({}, { _id: 0 }, { sort: { 'height': -1 } }).exec();
        return res.status(200).json(result);
    }

    public async countTxByTime(req: Request, res: Response, next: NextFunction) {
        // let fromDate = req.query.fromDate;
        // let toDate = req.query.fromDate;
        const now = new Date;
        const toDate = Date.UTC(now.getUTCFullYear(),now.getUTCMonth(), now.getUTCDate() , 0, 0, 0, 0);
        const fromDate = toDate - 86400000*7; // 86400000 millis = 1day, fromDate - todate range = 14days

        txServiceInstance.countTxByTime(fromDate, toDate)
            .then((response: any) => {
                if (response){
                    return res.status(200).json(response);
                }
            })
            .catch(err => {
                logger.error(`countTxByTime with err: ${err}`);
                return res.status(400).json({ message: "Bad request!..." });
            });
    }
    
}