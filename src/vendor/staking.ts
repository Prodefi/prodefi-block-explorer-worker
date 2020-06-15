import axios from "axios";
import { env } from "../config/global";
import { logger } from "../config/logger";

class Staking {
    getStakingValidators = () => {
        const apiLink = `${env.RPC_URL}/staking/validators`;
        return new Promise<any | null>((resolve, reject) => {
            axios.get(apiLink).then(response => {
                if (response && response.data) {
                    resolve(response.data);
                }
            }).catch(err => {
                logger.error(`getStakingValidators with error: ${err}`)
                reject(err);
            });
        });
    }

    getAllDelegationsFromAValidator = (validatorAddress : string) => {
        const apiLink = `${env.RPC_URL}/staking/validators/${validatorAddress}/delegations`;
        return new Promise<any | null>((resolve, reject) => {
            axios.get(apiLink).then(response => {
                if (response && response.data) {
                    resolve(response.data);
                }
            }).catch(err => {
                logger.error(`getAllDelegationsFromAValidator with error: ${err}`)
                reject(err);
            });
        });
    }

    getStakingValidatorByOperatorAddress = (address: string) => {
        const apiLink = `${env.RPC_URL}/staking/validators/${address}`;
        return new Promise<any | null>((resolve, reject) => {
            axios.get(apiLink).then(response => {
                if (response && response.data) {
                    resolve(response.data);
                }
            }).catch(err => {
                logger.error(`getStakingValidatorByOperatorAddress with error: ${err}`)
                reject(err);
            });
        });
    }

    getStakingValidatorByPdtValconsAddress = (pdtvalconsAddress: string, blockHeight: string) => {
        const apiLinkValidatorSetsByBlockHeight = `${env.RPC_URL}/validatorsets/${blockHeight}`;
        const apiLinkAllStakingValidators = `${env.RPC_URL}/staking/validators`;
        return new Promise<any | null>((resolve, reject) => {
            let pubkey = "";

            Promise.all([
                axios.get(apiLinkValidatorSetsByBlockHeight),
                axios.get(apiLinkAllStakingValidators),
            ]).then(response => {
                const validators = response[0].data.result.validators;
                validators.map((validator: any) => {
                    if (validator.address == pdtvalconsAddress){
                        pubkey = validator.pub_key;
                    }
                })

                const validatorsInfo = response[1].data.result;

                validatorsInfo.map((v: any) => {
                    if (v.consensus_pubkey == pubkey){
                        resolve(v)
                    }
                })
                
                reject({ message: "Record not found!..."});


            }).catch(err => {
                logger.error(`getStakingValidatorByPdtValconsAddress with error: ${err}`)
                reject(err);
            });
        })
    }

}

const stakingVendor = new Staking();

export default stakingVendor;