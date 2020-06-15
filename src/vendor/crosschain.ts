import axios from "axios";
import { env } from "../config/global";
import { logger } from "../config/logger";

class CrosschainService {
    getCrosschainTxsByTokenAddress = (tokenAddress: String) => {
        const apiLink = `${env.RPC_URL}/crosschain/tokens/${tokenAddress}/transactions`;
        return new Promise<any | null>((resolve, reject) => {
            axios.get(apiLink).then(response => {
                if (response && response.data) {
                    resolve(response.data);
                }
            }).catch(err => {
                logger.error(`getCrosschainTxsByTokenAddress with error: ${err}`)
                reject(err);
            });
        });
    }
}

const crosschainServiceInstance = new CrosschainService();

export default crosschainServiceInstance;