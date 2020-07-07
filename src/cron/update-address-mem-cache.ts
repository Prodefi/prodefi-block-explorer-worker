import { CronJob } from 'cron';
import txServiceInstance from '../vendor/transaction';
import { TimeUtility } from '../util/time-util';
import  cache from 'memory-cache';
 
export function updateAddressMemcache(): CronJob {
    return new CronJob({
        cronTime: '*/5 * * * * *',
        onTick: () => {
            const now = new Date()
            const memCacheKeyBeginToday = now.getFullYear().toString()
                .concat("-")
                .concat((now.getMonth() + 1).toString())
                .concat("-").concat(now.getDay().toString())
                .concat("_").concat(now.getHours().toString()).concat("H")
                .concat("_UTC_addresses")
            let cacheAddress = cache.get(memCacheKeyBeginToday);
            if (cacheAddress != null) {
                // nothing to do
            } else {        
                txServiceInstance.getSetSenderAndReceipentToDate(TimeUtility.getBeginTodayUTC()).then(res => {
                    let setAddress = new Set(res);
                    cache.clear();
                    cache.put(memCacheKeyBeginToday, setAddress);
                }).catch(err => {})
            }
        },
        start: true,
    });
}
