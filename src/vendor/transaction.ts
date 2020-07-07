import { env } from "../config/global";
import crypto from "crypto";
import axios from "axios";
import Tx from "../entity/db-tx";
import UniqueAddress from "../entity/db-unique-address";
import { logger } from "../config/logger";
import MissingTx from "../entity/db-missing-tx";
import Block from "../entity/db-block";

class TransactionService {
    getTxByTxHash = (txHash: string) => {
        const apiLink = `${env.RPC_URL}/txs/${txHash}`;
        return new Promise<any | null>((resolve, reject) => {
            axios.get(apiLink).then(response => {
                if (response && response.data) {
                    Promise.all([
                        Tx.create(response.data),
                        MissingTx.updateOne({ txhash: txHash }, {'deleted_at': new Date()})
                    ])

                    resolve(response.data);
                }
            }).catch(err => {
                MissingTx.create({ txhash: txHash });
                logger.error(`Get transaction hash ${txHash} with error: ${err});`)
                reject(err);
            });
        }); 
        
    }

    getSetSenderAndReceipentToDate = (toDate : number) => {
        const conditionFunction1 = Tx.aggregate([
            { $match: { timestamp: { $lte: new Date(toDate) } } },
            { "$group": {
              "_id": `$tx.value.msg.value.from_address`
            }}
        ])

        const conditionFunction2 = Tx.aggregate([
            { $match: { timestamp: { $lte: new Date(toDate) } } },
            { "$group": {
              "_id": `$tx.value.msg.value.to_address`
            }}
        ])

        const conditionFunction3 = Tx.aggregate([
            { $match: { timestamp: { $lte: new Date(toDate) } } },
            { "$group": {
              "_id": `$tx.value.msg.value.delegator_address`
            }}
        ])

        const conditionFunction4 = Tx.aggregate([
            { $match: { timestamp: { $lte: new Date(toDate) } } },
            { "$group": {
              "_id": `$tx.value.msg.value.validator_address`
            }}
        ])

        return new Promise<String[] | null>((resolve, reject) => {
            Promise.all([
                conditionFunction1,
                conditionFunction2,
                conditionFunction3,
                conditionFunction4
            ]).then((response: any) => {
                let result : String[] = [];
                response.forEach((element : any) =>{
                    element.map((v: any) => {
                        if (v._id.length > 0){
                            result = result.concat(v._id)
                        }
                    })
                });
                resolve(result);
            }).catch(err => {
                reject(null);
            });
        })
    }

    getTotalAddresses = () => {
        const total = UniqueAddress.estimatedDocumentCount().exec();

        return total;
    }

    getSetSenderAndReceipentFromDate = (fromDate : number) => {
        const conditionFunction1 = Tx.aggregate([
            { $match: { timestamp: { $gt: new Date(fromDate) } } },
            { "$group": {
              "_id": `$tx.value.msg.value.from_address`
            }}
        ])

        const conditionFunction2 = Tx.aggregate([
            { $match: { timestamp: { $gt: new Date(fromDate) } } },
            { "$group": {
              "_id": `$tx.value.msg.value.to_address`
            }}
        ])

        const conditionFunction3 = Tx.aggregate([
            { $match: { timestamp: { $gt: new Date(fromDate) } } },
            { "$group": {
              "_id": `$tx.value.msg.value.delegator_address`
            }}
        ])

        const conditionFunction4 = Tx.aggregate([
            { $match: { timestamp: { $gt: new Date(fromDate) } } },
            { "$group": {
              "_id": `$tx.value.msg.value.validator_address`
            }}
        ])

        return new Promise<String[] | null>((resolve, reject) => {
            Promise.all([
                conditionFunction1,
                conditionFunction2,
                conditionFunction3,
                conditionFunction4
            ]).then((response: any) => {
                let result : String[] = [];
                response.forEach((element : any) =>{
                    element.map((v: any) => {
                        if (v._id.length > 0){
                            result = result.concat(v._id)
                        }
                    })
                });
                resolve(result);
            }).catch(err => {
                reject(null);
            });
        })
    }
    
    getTx = (tx: string) => {
        // https://github.com/dappforce/dappforce-tendermint-explorer/commit/c8fd3831bdc27f380a1fd8a311dfa23fe881314e => hash tx
        let b64str = tx.replace(/^:base64:/, '');
        let buffer = Buffer.from(b64str, 'base64');
        let hex = crypto.createHash('sha256').update(buffer).digest('hex');
        const txHash = hex.substr(0, 65).toUpperCase();

        const apiLink = `${env.RPC_URL}/txs/${txHash}`;
        return new Promise<any | null>((resolve, reject) => {
            axios.get(apiLink).then(response => {
                if (response && response.data) {
                    Tx.create(response.data);

                    try {
                        UniqueAddress.create({address: response.data.tx.value.msg.value.from_address});
                        UniqueAddress.create({address: response.data.tx.value.msg.value.to_address});
                    } catch(error) {
                        logger.error(`Add Unique Address error: ${error});`)
                    }

                    resolve(response.data);
                }
            }).catch(err => {
                MissingTx.create({ txhash: txHash });
                logger.error(`Get transaction tx ${tx} with error: ${err});`)
                reject(err);
            });
        });
    }
    
    countTxByTime = (fromDate: number, toDate: number) => { // call local DB
        return new Promise<any | null>((resolve, reject) => {
// for test
            // dbBlock.aggregate([
            //     {
            //         $match: {
            //             'block.header.time': {
            //                 $gte: new Date(fromDate),
            //                 $lte: new Date(toDate)
            //             }
            //         }
            //     },
            //     { 
            //         $group: {
            //             _id: { 
            //                 "year":  { "$year": "$block.header.time" },
            //                 "month": { "$month": "$block.header.time" },
            //                 "day":   { "$dayOfMonth": "$block.header.time" },
            //             },
            //             count: { $sum: 1 }
            //         }
            //     }
            // ]).sort({ 'block.header.time': 'asc' }).exec() // sort by created_at DESC

            Tx.aggregate([
                {
                    $match: {
                        timestamp: {
                            $gte: new Date(fromDate),
                            $lte: new Date(toDate)
                        }
                    }
                },
                { 
                    $group: {
                        _id: { 
                            "year":  { "$year": "$timestamp" },
                            "month": { "$month": "$timestamp" },
                            "day":   { "$dayOfMonth": "$timestamp" }
                        },
                        count:{$sum: 1}
                    }
                }
            ]).sort({ _id: 'desc' }).exec() // sort by timestamp DESC
                .then((response: any) => {
                    const rangeDate = Math.round((toDate - fromDate)/86400000); // 86400000 millis = 1 day
                    if (response && response.length > 0){
                        let previousDate = fromDate;
                        let result: any = [];

                        for (let i = response.length-1; i >=0; i--) {
                            const date = Date.UTC(response[i]._id.year, response[i]._id.month -1, response[i]._id.day);
                            const missing = Math.round((date - previousDate) / 86400000);
                            result = result.concat(Array(missing).fill(0));
                            result = result.concat(response[i].count);
                            previousDate = date;
                            previousDate = date + 86400000;

                        }

                        if (result.length < rangeDate) result = result.concat(Array(rangeDate - result.length).fill(0));
                        resolve(result);
                    } else {
                        resolve(Array(rangeDate).fill(0));
                        // resolve(Array(rangeDate).fill(Math.floor(Math.random()* Math.floor(1000))));
                    }
                                       
                })
                .catch((err: any) => {
                    logger.error(`getLatestBlockHeight with err: ${err}`)
                    reject(err);
                })   ;  
        });
    }

    calculateCurrentTPS = (fromBlock: number, toBlock: number) => {
        return new Promise<any | null>((resolve, reject) => {
            const getLatestBlockTime  = Block.findOne({}, { "block.header.time": 1, _id: 0 }, { sort: { 'block.header.height' : -1 }}).exec()
            const getLatestBlockTimeSubtract10 = Block.findOne({}, { "block.header.time": 1, _id: 0 }, { sort: { 'block.header.height' : -1 }}).skip(10).exec()
            const getTotalTxsLatest10Block = Block.aggregate([
                { 
                    $match: {
                        $and: [
                            { 'block.header.height': { $gte: fromBlock } },
                            { 'block.header.height': { $lte: toBlock } }
                        ]
                    }
                },
                { 
                    $group: { 
                        _id : null, 
                        totalTxs : { 
                            $sum: {
                                $convert: { 'input': '$block.header.num_txs', 'to': 'int' }
                            } 
                        } 
                    } 
                }
            ])
            
            Promise.all([
                getLatestBlockTime,
                getLatestBlockTimeSubtract10,
                getTotalTxsLatest10Block
            ]).then((data: any) => {
                const latestBlockTime = new Date(data[0].block.header.time).getTime() / 1000
                const latestBlockTimeSubtract10 = new Date(data[1].block.header.time).getTime() / 1000
                const totalTxsLatest10Block = data[2][0].totalTxs
                const currentTPS = totalTxsLatest10Block /(latestBlockTime - latestBlockTimeSubtract10)
                resolve(Math.ceil(currentTPS))
                
            }).catch(err => {
                logger.error(`countTxsPreviousSecond with err: ${err});`)
                reject(err);
            });  
        });
    }
}


const txServiceInstance = new TransactionService();

export default txServiceInstance;

// db.bios.find( { birth: { $gt: new Date('1940-01-01'), $lt: new Date('1960-01-01') } } )