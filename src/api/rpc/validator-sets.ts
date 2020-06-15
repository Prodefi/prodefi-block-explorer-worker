import { NextFunction, Request, Response } from "express";
import validatorSetVendor from "../../vendor/validator-sets";
import { logger } from "../../config/logger";

export class ValidatorSetController {
    public async getLatestValidatorSet(req: Request, res: Response, next: NextFunction) {
        validatorSetVendor.getLatestValidatorSet()
            .then((response: any) => {
                if (response) {
                    return res.status(200).json(response);
                }
            })
            .catch(err => {
                logger.error(`getLatestValidatorSet with err: ${err}`);
                return res.status(400).json({ message: "Bad request!..." });
            });
    }

    public async getValidatorSetByHeight(req: Request, res: Response, next: NextFunction) {
        const { height } = req.params;
        validatorSetVendor.getValidatorSetByHeight(parseInt(height))
            .then((response: any) => {
                if (response) {
                    return res.status(200).json(response);
                }
            })
            .catch(err => {
                logger.error(`getValidatorSetByHeight with err: ${err}`);
                return res.status(400).json({ message: "Bad request!..." });
            });
    }

    public async listing20LatestValidatorSet(req: Request, res: Response, next: NextFunction) {
        const consensusPubkey = req.query.consensusPubkey ? String(req.query.consensusPubkey) : "";
        if (consensusPubkey == ""){
            return res.status(400).json({ message: "Bad request!..." });
        }

        const defaultLatestBlockHeight = 20; 
        const blockHeight = req.query.blockHeight  && Number(req.query.blockHeight) != NaN ? Number(req.query.blockHeight) : defaultLatestBlockHeight;
        
        let promises = [];

        for (let i = blockHeight; i > blockHeight -20; i--){
            promises.push(validatorSetVendor.getValidatorSetByHeight(i));
        }

        Promise.all(promises).then(response  => {
            let result  = new Array(20);
            response.map((validatorSet: any) => {
               const resultIndex = blockHeight - validatorSet.result.block_height;
               result[resultIndex] = {
                    block_height: validatorSet.result.block_height,
                    isValidator: false
               };
               const validators = validatorSet.result.validators;
               validators.map((validator : any) => {
                    if (validator.pub_key ==consensusPubkey){
                        result[resultIndex] = {
                            block_height: validatorSet.result.block_height,
                            isValidator: true
                        };
                    }
               })
            })
            return res.status(200).json({ result});
        })
        .catch(err => {
            logger.error(`listing20LatestValidatorSet with err: ${err}`);
            return res.status(400).json({ message: "Bad request!..." });
        });
    }
}