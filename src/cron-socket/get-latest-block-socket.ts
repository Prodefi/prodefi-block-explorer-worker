import { CronJob } from 'cron';
import { env } from '../config/global';
import { logger } from '../config/logger';
import createSocketIO from "socket.io";
import blockServiceInstance from '../vendor/block';
import txServiceInstance from '../vendor/transaction';

export function getLatestBlockSocket(io: createSocketIO.Server): CronJob {
    let latestHeight = -1; // currentLatestHeight != height, because height of the latest block is a uint
    let totalTx = -1;
    let currentTPS = 0;
    let peakTPS = env.PEAK_TPS;
    let currentTime: any = new Date();

    return new CronJob({
        cronTime: '*/1 * * * * *',
        onTick: () => {
            logger.info(`current latest block height: ${latestHeight}`)
            blockServiceInstance.socketGetLatestBlock(latestHeight)
                .then((rs: any) => {
                    if (rs && rs.block && rs.block.header) {
                        let newHeight = rs.block.header.height || latestHeight;
                        newHeight = parseInt(newHeight);
                        if (newHeight > latestHeight){
                            latestHeight = newHeight;
                        }

                        const newTotalTx = rs.block.header.total_txs || totalTx;
                        if (parseInt(newTotalTx) > totalTx){
                            totalTx = parseInt(newTotalTx);
                        }

                        currentTime = rs.block.header.time || currentTime;

                        io.to(env.SOCKET_ROOM).emit("latestBlock", JSON.stringify(rs));
                    }
                    Promise.all([
                        txServiceInstance.calculateCurrentTPS(latestHeight - 10,latestHeight),
                        blockServiceInstance.getBlockByHeight(latestHeight - 10, false)
                    ])
                        .then (data => {
                            currentTPS = parseInt(data[0]);
                            if (peakTPS < currentTPS) peakTPS = currentTPS;  

                            const latestBlockInfo = {
                                txs: totalTx,
                                height: latestHeight,
                                // remove because Replace “Current/Peak TPS” with “Total Addresses”
                                // tps: currentTPS + " / " + peakTPS,
                                time: currentTime,
                                validatorBlockTime: (new Date(currentTime).getTime() - new Date(data[1].block.header.time).getTime())/(10*1000)
                            }

                            io.to(env.SOCKET_ROOM).emit("latestBlockInfo", JSON.stringify(latestBlockInfo));

                            logger.info(`SOCKET_LATEST_BLOCK: totalTx = ${totalTx}, height = ${latestHeight}, time = ${currentTime}, validatorBlockTime = ${latestBlockInfo.validatorBlockTime}`)

                        }).catch(err => {
                            logger.error("get latestBlockInfo socket with error: " + err);
                        });
                })
                .catch(err => {
                    logger.error("getLatestBlockSocket with error: " + err);
                });
        },
        start: true,
    });
}