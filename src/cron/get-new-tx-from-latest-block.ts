import { CronJob } from 'cron';
import { logger } from '../config/logger';
import blockServiceInstance from '../vendor/block';


export function getNewTxFromLatestBlock(): CronJob {
    return new CronJob({
        cronTime: '*/1 * * * * *', // interval per second
        onTick: async () => {
            
            blockServiceInstance.getTxsByLatestBlockAndSaveTx()
                .then((rs: any) => {})
                .catch(err => {
                    logger.error(`CRON-FILL_NEW_TX with error: ${err}`);
                });
        },
        start: true,
    });
}