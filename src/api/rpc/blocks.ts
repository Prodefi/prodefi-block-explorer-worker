import { NextFunction, Request, Response, json } from "express";
import axios from "axios";
import { env } from "../../config/global";
import Block from "../../entity/db-block";
import blockServiceInstance from "../../vendor/block";
import { logger } from "../../config/logger";
import crypto from "crypto";
import validatorSetVendor from "../../vendor/validator-sets";
let bech32 = require("bech32");

export class BlockController {
    public async latestBlocks(req: Request, res: Response, next: NextFunction) {
        return axios.get(`${env.RPC_URL}/blocks/latest`)
            .then(response => {
                if (response && response.data){
                    // convert proposer address with prefix pdtvalcons 
                    const proposerAddress: string = response.data.block.header.proposer_address;
                    let word = bech32.toWords(Buffer.from(proposerAddress, 'hex'));
                    const convertWithPrefix = bech32.encode('pdtvalcons', word);
                    response.data.block.header.proposer_address = convertWithPrefix;

                }

                return res.status(200).json(response.data);
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
        let offset = (page -1) * limit;
        let conditions = {};

        let proposerAddress = req.query.proposerAddress ? String(req.query.proposerAddress) : "";

        if (proposerAddress == "" && req.query.pdtvalconsAddress && req.query.pdtvalconsAddress != ""){
            const decoded = bech32.decode(req.query.pdtvalconsAddress);                  
            let bytes = Buffer.from(bech32.fromWords(decoded.words));
            proposerAddress = bytes.toString('hex');
        }
        
        // calculate proposerAddress from consensusPubkey
        if (proposerAddress == "" && req.query.consensusPubkey && req.query.consensusPubkey != ""){
            let pdtvalconsAddress = "";
            await validatorSetVendor.getLatestValidatorSet()
                .then((response: any) => {
                    if (response) {
                        const validators = response.result.validators;
                        validators.map((validator: any) => {
                            if (validator.pub_key == req.query.consensusPubkey){
                            pdtvalconsAddress = validator.address;
                            }
                        })
                    }
                }).catch(err => {
                    logger.error(`getLatestValidatorSet  from listing block with err: ${err}`);
                    return res.status(400).json({ message: "Bad request!..." });
                });

                const decoded = bech32.decode(pdtvalconsAddress);                  
                let bytes = Buffer.from(bech32.fromWords(decoded.words));
                proposerAddress = bytes.toString('hex');
        }

        if (proposerAddress != ""){
            conditions = {'block.header.proposer_address': proposerAddress.toUpperCase() };
        }

// code for query in range of paging
        // let total = 0;
        // Block.count({}).exec().then((count: any) => {
        //     total = count
        //     let slice = [count, count - limit]
        //     if (page >= 2) {
        //         slice = [count - (page -1) * limit, count - page * limit] 
        //     }
        //     // Block.find({ 'block.header.height': { $lte: slice[0], $gt: slice[1] } }, { _id: 0 }).sort({'block.header.height' : -1}).exec()
        //         .then((blocks: any) => {
        //             if (blocks && blocks.length > 0){
        //                 let result = blocks.map((blockInfo: any) => {
        //                     const proposerAddress: string = blockInfo.block.header.proposer_address;
        //                     let word = bech32.toWords(Buffer.from(proposerAddress, 'hex'));
        //                     const convertWithPrefix = bech32.encode('pdtvalcons', word);
        //                     blockInfo.block.header.proposer_address = convertWithPrefix;
        //                     return blockInfo;
        //                 })

        //                 return res.status(200).json({
        //                     blocks: result,
        //                     total: total,
        //                     page: page,
        //                     perPage: limit
        //                 });
        //             }
        //                 return res.status(400).json({ message: "Record not found!..." });
        //         })
        //         .catch(err => {
        //             return res.status(400).json(err);
        //         })
        // }).catch(err => {
        //     return res.status(400).json(err);
        // })

        Promise.all([
            Block.find(
                conditions, 
                { 
                    '_id': 0,
                    'block.header.height': 1, 
                    'block_meta.block_id.hash': 1,
                    'block.header.proposer_address': 1,
                    'block.header.time': 1,
                    'block.header.num_txs': 1,            
                }, 
                { sort: { 'block.header.height': -1 } }).skip(offset).limit(limit).exec(),
            Block.find(conditions, {}).count().exec()
        ]).then((data: any) => {
            const blocks = data[0];
            if (blocks && blocks.length > 0){
                let result = blocks.map((blockInfo: any) => {
                    const proposerAddress: string = blockInfo.block.header.proposer_address;
                    let word = bech32.toWords(Buffer.from(proposerAddress, 'hex'));
                    const convertWithPrefix = bech32.encode('pdtvalcons', word);
                    blockInfo.block.header.proposer_address = convertWithPrefix;
                    return blockInfo;
                })

                return res.status(200).json({
                    blocks: result,
                    total: data[1],
                    page: page,
                    perPage: limit
                });
            }

            return res.status(400).json({ message: "Record not found!..." });

        }).catch(err => {
            return res.status(400).json(err);
        })
    }

    public async getBlockByHeight(req: Request, res: Response, next: NextFunction) { // API partner
        const { height } =  req.params;
        blockServiceInstance.getBlockByHeight(parseInt(height), false)
            .then((response: any) => {
                    // convert list tx => list tx hash
                    const txs = response.block.data.txs
                    if (txs && txs.length > 0) {
                        const txhashes = txs.map((tx:any) => {
                            // https://github.com/dappforce/dappforce-tendermint-explorer/commit/c8fd3831bdc27f380a1fd8a311dfa23fe881314e => hash tx
                            let b64str = tx.replace(/^:base64:/, '');
                            let buffer = Buffer.from(b64str, 'base64');
                            let hex = crypto.createHash('sha256').update(buffer).digest('hex');
                            return hex.substr(0, 65).toUpperCase();
                        })
                        response.block.data.txhashes = txhashes
                    }
                    
                    return res.status(200).json(response);
            })
            .catch(err => {
                logger.error(`getBlockByHeight with err: ${err}`);
                return res.status(400).json({ message: "Bad request!..." });
            });
    }
}