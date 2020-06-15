
import createSocketIO from "socket.io";
import { getLatestBlockSocket } from "./cron-socket/get-latest-block-socket";
import { env } from "./config/global";
import { getStakingValidatorSocket } from "./cron-socket/get-staking-validator-socket";
import { listingLatestTxSocket } from "./cron-socket/listing-latest-tx-socket";
import { getStakingValidatorUptimeSocket } from "./cron-socket/get-staking-validator-uptime-socket";
import { getTotalAddress } from "./cron-socket/get-total-addresses";

export function initSocket(server: any): void {
    let io = createSocketIO(server);

    io.on('connection', function (socket) {
        socket.join(env.SOCKET_ROOM);
        socket.on('disconnect', () => {
            socket.leave(env.SOCKET_ROOM);
        });
    });


    getLatestBlockSocket(io);
    listingLatestTxSocket(io);
    getStakingValidatorSocket(io);
    getStakingValidatorUptimeSocket(io);
    getTotalAddress(io);
    

}