import axios from "axios";
import { env } from "../config/global";
import { logger } from "../config/logger";

class ValidatorSet {
    getLatestValidatorSet = () => {
        const apiLink = `${env.RPC_URL}/validatorsets/latest`;
        return new Promise<any | null>((resolve, reject) => {
            axios.get(apiLink).then(response => {
                if (response && response.data) {
                    resolve(response.data);
                }
            }).catch(err => {
                logger.error(`getLatestValidatorSet with error: ${err}`)
                reject(err);
            });
        });
    }

    getValidatorSetByHeight = (height: number) => {
        const apiLink = `${env.RPC_URL}/validatorsets/${height}`;
        return new Promise<any | null>((resolve, reject) => {
            axios.get(apiLink).then(response => {
                if (response && response.data) {
                    resolve(response.data);
                }
            }).catch(err => {
                logger.error(`getValidatorSetByHeight with error: ${err}`)
                reject(err);
            });
        });
    }
}

const validatorSetVendor = new ValidatorSet();

export default validatorSetVendor;