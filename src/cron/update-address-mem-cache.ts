import { CronJob } from 'cron';
import txServiceInstance from '../vendor/transaction';
import { TimeUtility } from '../util/time-util';
import  cache from 'memory-cache';

export function updateAddressMemcache(): CronJob {
    return new CronJob({
        cronTime: '0 0 */3 * * *', // https://stackoverflow.com/questions/41597538/node-cron-run-job-every-3-hours
        onTick: () => {
            const now = new Date()
            const memCacheKeyBeginToday = now.getFullYear().toString()
                .concat("-")
                .concat((now.getMonth() + 1).toString())
                .concat("-").concat(now.getDay().toString()) 
                .concat("_UTC_addresses")
  
            txServiceInstance.getSetSenderAndReceipentToDate(TimeUtility.getBeginTodayUTC()).then(res => {
                let setAddress = new Set(res);
                cache.clear();
                cache.put(memCacheKeyBeginToday, setAddress);
            }).catch(err => {})
        },
        start: true,
    });
}