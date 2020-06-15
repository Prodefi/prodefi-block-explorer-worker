import { NextFunction, Request, Response } from "express";
import stakingVendor from "../../vendor/staking";
import { logger } from "../../config/logger";

export class StakingController {
    public async getStakingValidators(req: Request, res: Response, next: NextFunction) {
        stakingVendor.getStakingValidators()
            .then((response: any) => {
                if (response) {
                    return res.status(200).json(response);
                }
            })
            .catch(err => {
                logger.error(`getStakingValidators with err: ${err}`);
                return res.status(400).json({ message: "Bad request!..." });
            });
    }

    public async getAllDelegationsFromAValidator(req: Request, res: Response, next: NextFunction) {
        const { validatorAddress } = req.params;
        console.log("validatorAddress = ", validatorAddress)
        stakingVendor.getAllDelegationsFromAValidator(validatorAddress)
            .then((response: any) => {
                if (response) {
                    return res.status(200).json(response);
                }
            })
            .catch(err => {
                logger.error(`getAllDelegationsFromAValidator with err: ${err}`);
                return res.status(400).json({ message: "Bad request!..." });
            });
    }

    public async getStakingValidatorByOperatorAddress(req: Request, res: Response, next: NextFunction) {
        const { address } = req.params;
        stakingVendor.getStakingValidatorByOperatorAddress(address)
            .then((response: any) => {
                if (response) {
                    return res.status(200).json(response);
                }
            })
            .catch(err => {
                logger.error(`getStakingValidatorByOperatorAddress with err: ${err}`);
                return res.status(400).json({ message: "Bad request!..." });
            });
    }

    public async getStakingValidatorByPdtValconsAddress(req: Request, res: Response, next: NextFunction) {
        const { pdtvalconsAddress, blockHeight } = req.params;

        stakingVendor.getStakingValidatorByPdtValconsAddress(pdtvalconsAddress, blockHeight)
            .then((response: any) => {
                if (response) {
                    return res.status(200).json(response);
                }
            })
            .catch(err => {
                logger.error(`getStakingValidatorByPdtValconsAddress with err: ${err}`);
                return res.status(400).json({ message: "Bad request!..." });
            });
    }
    


}