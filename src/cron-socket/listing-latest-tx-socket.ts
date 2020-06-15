import { CronJob } from 'cron';
import { env } from '../config/global';
import { logger } from '../config/logger';
import createSocketIO from "socket.io";
import Tx from '../entity/db-tx';

export function listingLatestTxSocket(io: createSocketIO.Server): CronJob {
    return new CronJob({
        cronTime: '*/1 * * * * *',
        onTick: () => {
            Tx.find({}, { _id: 0 }, { sort: { 'timestamp' : -1 }}).limit(10).exec()
            .then(response => {
                io.to(env.SOCKET_ROOM).emit("listingLatestTx", JSON.stringify(response));
            })
            .catch(err => {
                logger.error("CRON-SOCKET: listingLatestTxSocket with error: " + err);
            })
        },
        start: true,
    });
}