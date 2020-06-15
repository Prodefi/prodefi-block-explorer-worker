import { CronJob } from 'cron';
import { env } from '../config/global';
import { logger } from '../config/logger';
import createSocketIO from "socket.io";
import stakingVendor from '../vendor/staking';

export function getStakingValidatorSocket(io: createSocketIO.Server): CronJob {    
    return new CronJob({
        cronTime: '*/1 * * * * *',
        onTick: () => {
            stakingVendor.getStakingValidators()
                .then(response => {
                    io.to(env.SOCKET_ROOM).emit("stakingValidator", JSON.stringify(response));
                    const height = response.height;
                    let activeValidator = 0 ;
                    let inactiveValidator = 0;
                    let bondedToken = 0;
                    let allToken = 0; 
                    if (response && response.result && response.result.length > 0) {
                        response.result.map( (v: any) => {
                            if (v.jailed == false && v.status == 2) { // => that is a active validator 
                                activeValidator++;
                                bondedToken += parseFloat(v.delegator_shares);
                            } else {
                                inactiveValidator ++;
                            }
                            allToken += parseFloat(v.delegator_shares);
                        })
                    }

                    const latestStakingValidatorInfo = {
                        activeValidator,
                        inactiveValidator,
                        bondedToken,
                        allToken,
                        height
                    }

                    io.to(env.SOCKET_ROOM).emit("latestStakingValidatorInfo", JSON.stringify(latestStakingValidatorInfo));
                })
                .catch(err => {
                    logger.error("CRON-SOCKET: getStakingValidatorSocket with error: " + err);
                })

        },
        start: true,
    });
}