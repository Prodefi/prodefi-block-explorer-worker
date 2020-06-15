import { CronJob } from 'cron';
import { env } from '../config/global';
import { logger } from '../config/logger';
import createSocketIO from "socket.io";
import stakingVendor from '../vendor/staking';

export function getStakingValidatorUptimeSocket(io: createSocketIO.Server): CronJob {   
    let mapValidators = new Map(); 
    let count = 0;
    const startUptime = new Date().getTime();
    let countTimeTo15minute = 0;
    let streamData = "";

    return new CronJob({
        cronTime: '*/1 * * * * *',
        onTick: () => {
            if (countTimeTo15minute == 0 || countTimeTo15minute == 900){ // 900s = 15minutes
                countTimeTo15minute ++;
                stakingVendor.getStakingValidators()
                    .then(response => {
                        count ++;
                        if (response && response.result && response.result.length > 0) {
                            const result = response.result.map( (v: any) => {
                                const countActiveTime = mapValidators.get(v.operator_address);
                                if (countActiveTime && v.jailed == false && v.status == 2) {
                                    mapValidators.set(v.operator_address, countActiveTime+1);
                                    v.uptime = (countActiveTime+ 1)/ count * 100;
                                } else { // first appear
                                    mapValidators.set(v.operator_address, 1);
                                    v.uptime = 1 /count * 100;
                                }
                            return v; 
                            })
                            streamData = JSON.stringify({
                                startUptime,
                                result
                            });
                            io.to(env.SOCKET_ROOM).emit("stakingValidatorUptimeInfo", streamData);
                        }
                    })
                    .catch(err => {
                        logger.error("CRON-SOCKET: getStakingValidatorUptimeSocket with error: " + err);
                    })
            } else if (countTimeTo15minute > 900){
                countTimeTo15minute  = 1;
                io.to(env.SOCKET_ROOM).emit("stakingValidatorUptimeInfo", streamData);
            } else {
                countTimeTo15minute ++;
                io.to(env.SOCKET_ROOM).emit("stakingValidatorUptimeInfo", streamData);
            }

        },
        start: true,
    });
}