import { Router } from "express";
import { StatusController } from "./api/status/status-controller";
import { BlockController } from "./api/rpc/blocks";
import { TxController } from "./api/rpc/tx";
import { CrosschainController } from "./api/rpc/crosschain";
import { AccountController } from "./api/rpc/accounts";
import { ValidatorSetController } from "./api/rpc/validator-sets";
import { BankController } from "./api/rpc/bank";
import { StakingController } from "./api/rpc/staking";

export function registerApiRoutes(router: Router, prefix: string = ''): void {
    router.get("/status", new StatusController().status)

    router.get(`${prefix}/blocks/latest`, new BlockController().latestBlocks)
    router.get(`${prefix}/blocks/:height`, new BlockController().getBlockByHeight)
    router.get(`${prefix}/blocks/custom/listing`, new BlockController().listing)
    
    router.get(`${prefix}/txs`, new TxController().searchTransactions)
    router.get(`${prefix}/txs/latest`, new TxController().latestTx)
    router.get(`${prefix}/txs/custom/listing`, new TxController().listing)
    router.get(`${prefix}/txhash/:hash`, new TxController().getTxByTxHash)
    router.get(`${prefix}/txs/:tx`, new TxController().getTx)

    router.get(`${prefix}/auth/accounts/:address`, new AccountController().getAccount)
    router.get(`${prefix}/bank/balances/:address`, new BankController().getBankBalance)

    router.get(`${prefix}/crosschain/tokens`, new CrosschainController().crosschainTokens)
    router.get(`${prefix}/crosschain/tokens/:tokenAddress/balance`, new CrosschainController().crosschainTokenBalance)
    router.get(`${prefix}/crosschain/tokens/:tokenAddress/transactions`, new CrosschainController().crosschainTokenTransactions)

    router.get(`${prefix}/chart/txs`, new TxController().countTxByTime)

    router.get(`${prefix}/validatorsets/latest`, new ValidatorSetController().getLatestValidatorSet)
    router.get(`${prefix}/validatorsets/listing`, new ValidatorSetController().listing20LatestValidatorSet)
    router.get(`${prefix}/validatorsets/:height`, new ValidatorSetController().getValidatorSetByHeight)
    

    router.get(`${prefix}/staking/validators`, new StakingController().getStakingValidators)
    router.get(`${prefix}/staking/validators/:address`, new StakingController().getStakingValidatorByOperatorAddress)
    router.get(`${prefix}/staking/validators/:validatorAddress/delegations`, new StakingController().getAllDelegationsFromAValidator)
    router.get(`${prefix}/staking/validators/pdtvalcons/:pdtvalconsAddress/:blockHeight`, new StakingController().getStakingValidatorByPdtValconsAddress)
}