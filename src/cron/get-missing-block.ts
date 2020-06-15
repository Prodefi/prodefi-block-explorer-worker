import { CronJob } from 'cron';
import MissingBlock from '../entity/db-missing-block';
import blockServiceInstance from '../vendor/block';

export function getMissingBlock(): CronJob {
    return new CronJob({
        cronTime: '*/1 * * * * *', // interval per second
        onTick: () => {
            MissingBlock.findOne({ deleted_at: null }, {}, { sort: { 'height' : -1 }}).exec()
                .then((rs: any) => {
                    if (rs && rs.height && rs.height > 0){
                        blockServiceInstance.getBlockByHeight(rs.height, true);
                    }
                    
                })
                .catch(err => {})
        },
        start: true,
    });
}