import { CronJob } from 'cron';
import MissingTx from '../entity/db-missing-tx';
import txServiceInstance from '../vendor/transaction';

export function getMissingTx(): CronJob {
    return new CronJob({
        cronTime: '*/1 * * * * *', // interval per second
        onTick: () => {
            MissingTx.findOne({ deleted_at: null }, { sort: { 'created_at' : 'desc' }}).exec()
                .then((txhash: any) => {
                    if (txhash){
                        txServiceInstance.getTxByTxHash(txhash);
                    }
                })
                .catch(err => {})
        },
        start: true,
    });
}