import { CronJob } from 'cron';
import  cache from 'memory-cache'
import txServiceInstance from '../vendor/transaction';
import { TimeUtility } from '../util/time-util';
import { env } from '../config/global';
import createSocketIO from "socket.io";

export function getTotalAddress(io: createSocketIO.Server): CronJob {
    // let now = new Date();
    // const memCacheKeyBeginToday = now.getFullYear().toString()
    //     .concat("-")
    //     .concat((now.getMonth() + 1).toString())
    //     .concat("-").concat(now.getDay().toString()) 
    //     .concat("_").concat(now.getHours().toString()).concat("H")
    //     .concat("_UTC_addresses") 

    return new CronJob({
        cronTime: '*/1 * * * * *', // interval per second
        onTick: () => {

            txServiceInstance.getTotalAddresses().then(res => {
                io.to(env.SOCKET_ROOM).emit("totalAddresses", res);
            });

            // let cacheAddress = cache.get(memCacheKeyBeginToday);
            // if (cacheAddress != null) {
            //     let setCacheAddress = new Set(cacheAddress);
            //     txServiceInstance.getSetSenderAndReceipentFromDate(TimeUtility.getBeginTodayUTC()).then(res => {
            //         let newSetAddress = new Set(res);
            //         newSetAddress.forEach((address : any) =>{
            //             setCacheAddress.add(address)
            //         })
            //         io.to(env.SOCKET_ROOM).emit("totalAddresses", setCacheAddress.size);
            //     }).catch(err => {})

            // } else {
            //     // cache.clear();
            //     // txServiceInstance.getSetSenderAndReceipentFromDate(TimeUtility.getBeginEpochTime()).then(res => {
            //     //     let setAddress = new Set(res);
            //     //     io.to(env.SOCKET_ROOM).emit("totalAddresses", setAddress.size);    
            //     // })

            //     txServiceInstance.getSetSenderAndReceipentToDate(TimeUtility.getBeginTodayUTC()).then(res => {
            //         let setAddress = new Set(res);
            //         cache.clear();
            //         cache.put(memCacheKeyBeginToday, setAddress);

            //         io.to(env.SOCKET_ROOM).emit("totalAddresses", setAddress.size);
            //     }).catch(err => {})
            // }            
        },
        start: true,
    });
}