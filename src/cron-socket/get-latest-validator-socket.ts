// import { CronJob } from 'cron';
// import { env } from '../config/global';
// import { logger } from '../config/logger';
// import createSocketIO from "socket.io";
// import validatorSetVendor from '../vendor/validator-sets';

// export function getLatestValidatorSocket(io: createSocketIO.Server): CronJob {
//     return new CronJob({
//         cronTime: '*/1 * * * * *',
//         onTick: () => {
//             validatorSetVendor.getLatestValidatorSet()
//                 .then(response => {
//                     io.to(env.SOCKET_ROOM).emit("latestValidatorSet", JSON.stringify(response));
//                 })
//                 .catch(err => {
//                     logger.error("CRON-SOCKET: getLatestValidatorSocket with error: " + err);
//                 })

//         },
//         start: true,
//     });
// }