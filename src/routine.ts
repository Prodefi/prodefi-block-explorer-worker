
import { getNewTxFromLatestBlock } from "./cron/get-new-tx-from-latest-block";
import { getOldBlockFromLatestBlock } from "./cron/get-old-block-from-latest-block";
import { getMissingBlock } from "./cron/get-missing-block";
import { getMissingTx } from "./cron/get-missing-tx";
import { env } from "./config/global";
import { updateAddressMemcache } from "./cron/update-address-mem-cache";

export function registerRoutine(): void {
    getOldBlockFromLatestBlock(env.START_AT_BLOCK, env.END_AT_BLOCK); 
    getMissingBlock();
    getMissingTx();
    
    getNewTxFromLatestBlock();
    updateAddressMemcache();
    // verifyUpdateAddressMemcache();
}