import axios from "axios";
import { env } from "../config/global";
import { logger } from "../config/logger";

class Bank {
    
    getBankBalance = (address: string) => {
        const apiLink = `${env.RPC_URL}/bank/balances/${address}`;
        return new Promise<any | null>((resolve, reject) => {
            axios.get(apiLink).then(response => {
                if (response && response.data) {
                    resolve(response.data);
                }
            }).catch(err => {
                logger.error(`getBankBalance with error: ${err}`)
                reject(err);
            });
        });
    }

}

const bankVendor = new Bank();

export default bankVendor;