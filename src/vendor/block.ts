import axios from "axios";
import { env } from "../config/global";
import { logger } from "../config/logger";
import Block from "../entity/db-block";
import txServiceInstance from "./transaction";
import MissingBlock from "../entity/db-missing-block";
let bech32 = require("bech32");

class BlockService {
    socketGetLatestBlock = (currentBlockHeight: number) => {
        const apiLink = `${env.RPC_URL}/blocks/latest`;
        return new Promise<any | null>((resolve, reject) => {
            axios.get(apiLink).then(response => {
                if (response && response.data && response.data.block && response.data.block.header && response.data.block.header.height) {
                    if (currentBlockHeight != parseInt(response.data.block.header.height)){
                        Block.create(response.data);
                    }
                }

                if (response && response.data) {
                    // convert proposer address with prefix pdtvalcons 
                    const proposerAddress: string = response.data.block.header.proposer_address;
                    let word = bech32.toWords(Buffer.from(proposerAddress, 'hex'));
                    const convertWithPrefix = bech32.encode('pdtvalcons', word);
                    response.data.block.header.proposer_address = convertWithPrefix;

                    resolve(response.data);
                }
            }).catch(err => {
                logger.error(`getLatestBlock with error: ${err});`)
                reject(err);
            });
        });
    }

    getBlockByHeight = (height: number, isRetrieveTxs: boolean) => {
        logger.info("BLOCK HEIGHT: " + height)
        const apiLink = `${env.RPC_URL}/blocks/${height}`;  // API partner
        return new Promise<any | null>((resolve, reject) => {
            axios.get(apiLink).then(response => {
                let promises = [];
                promises.push(Block.create(response.data));
                promises.push(MissingBlock.updateOne({ height: height }, {'deleted_at': new Date()}));
                if (isRetrieveTxs && response && response.data.block && response.data.block.data && response.data.block.data.txs) {
                    let txs = response.data.block.data.txs;
                    txs.map((tx: string) => {
                        promises.push(txServiceInstance.getTx(tx));
                    })
                }
                Promise.all(promises).catch(() => MissingBlock.create({ height }));

                if (response && response.data) {
                    // convert proposer address with prefix pdtvalcons 
                    const proposerAddress: string = response.data.block.header.proposer_address;
                    let word = bech32.toWords(Buffer.from(proposerAddress, 'hex'));
                    const convertWithPrefix = bech32.encode('pdtvalcons', word);
                    response.data.block.header.proposer_address = convertWithPrefix;
                    
                    resolve(response.data);
                }
            }).catch(err => {
                MissingBlock.create({ height });
                logger.error(`getBlockByHeight by height: ${height} with err: ${err}) ;`)
                reject(err);
            });
        }); 
        
    }

    getTxsByLatestBlockAndSaveTx = () => { // call local DB
        return new Promise<any | null>((resolve, reject) => {
            Block.findOne({}, { "block.data.txs": 1, _id: 0 }, { sort: { 'block.header.height' : -1 }}).exec()
                .then((response: any) => {
                    if (response && response.block && response.block.data && response.block.data.txs) {
                        Promise.all(
                            response.block.data.txs.map((tx: string) => {
                                txServiceInstance.getTx(tx)
                            })
                        );
                        resolve(response.block.header.data.txs);
                    }
                })
                .catch(err => {
                    logger.error(`getTxsByLatestBlockAndSaveTx with err: ${err});`)
                    reject(err);
                })   ;  
        }); 
        
    }

    getTxsByBlockHeightAndSaveTx = (height: number) => { // call local DB
        return new Promise<any | null>((resolve, reject) => {
            Block.findOne({"block.header.height": height }, { "block.data.txs": 1, _id: 0 }, {}).exec()
                .then((response: any) => {
                    if (response && response.block && response.block.data && response.block.data.txs) {
                        Promise.all(
                            response.block.data.txs.map((tx: string) => {
                                txServiceInstance.getTx(tx)
                            })
                        );
                        resolve(response.block.data.txs);
                    }
                })
                .catch(err => {
                    logger.error(`getTxsByBlockHeightAndSaveTx by with err: ${err});`)
                    reject(err);
                })   ;  
        });
    }

    getLatestBlockHeight = () => { // call local DB
        return new Promise<any | null>((resolve, reject) => {
            Block.findOne({}, { "block.header.height": 1, _id: 0 }, { sort: { 'block.header.height': -1 } }).exec()
                .then((response: any) => {
                    if (response && response.block && response.block.header && response.block.header.height) {
                        resolve(response.block.header.height);
                    }
                })
                .catch(err => {
                    logger.error(`getLatestBlockHeight with err: ${err});`)
                    reject(err);
                })   ;  
        });
    }

    getLatestBlockHeightFromPartner = () => { // call local DB
        const apiLink = `${env.RPC_URL}/blocks/latest`;
        return new Promise<any | null>((resolve, reject) => {
            axios.get(apiLink).then(response => {
                if (response && response.data && response.data.block && response.data.block.header && response.data.block.header.height) {
                    resolve(response.data.block.header.height);
                } else {
                    resolve(-1);
                }
            }).catch(err => {
                logger.error(`getLatestBlockHeightFromPartner with error: ${err});`)
                reject(err);
            });
        });
    }

}

const blockServiceInstance = new BlockService();

export default blockServiceInstance;