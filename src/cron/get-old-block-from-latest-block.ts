import { CronJob } from 'cron';
import { logger } from '../config/logger';
import blockServiceInstance from '../vendor/block';

export function getOldBlockFromLatestBlock(start: number, end: number): CronJob {
    return new CronJob({
        cronTime: '*/1 * * * * *', // interval per second
        onTick: () => {
            if (start == -1) {
                blockServiceInstance.getLatestBlockHeightFromPartner()
                    .then((height: any) => {
                        if (height) {
                            if (start != parseInt(height)) {
                                start = parseInt(height);
                            }
                        }
                    })
                    .catch(err => {
                        logger.error("CRON-GET_OLD_BLOCK: Get with error: " + err);
                    });
            } else if (start == end) { // done
            } else {
                // get 15 block per second
                let promises = [];
                for(let i = 0; i <15; i ++){
                    if (start -i > 0) {
                        promises.push(blockServiceInstance.getBlockByHeight(start -i, true))
                    }
                    
                }

                Promise.all(promises).then(() => {
                        start  = start -15;
                        if (start <= end) start = end; // done
                    })                
                }
        },
        start: true,
    });
}