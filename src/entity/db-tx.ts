import mongoose, { Schema } from 'mongoose';

const TxSchema: Schema = new Schema({
    txhash: { type: String, unique: true, required: true },
    height: { type: Number, required: true, index: true },
    raw_log: { type: String },
    logs: [{
        msg_index: { type: Number },
        success: { type: Boolean },
        log: { type: String },
        events: [{
            type: { type: String },
            attributes: [{
                key: { type: String },
                value: { type: String }
            }]
        }]
    }],
    gas_wanted: { type: String },
    gas_used: { type: String },
    tx: {
        type: { type: String },
        value: {
            msg: [{
                type: { type: String },
                
                value: {
                    address: { type: String },
                    transaction: {
                        hash: { type: String },
                        block: { type: String },
                        from_address: { type: String },
                        to_address: { type: String },
                        value: { type: String },
                        type: { type: String }
                    },
                    submitter: { type: String },
                    from_address: { type: String },
                    to_address: { type: String },
                    amount: [{
                        denom: { type: String },
                        amount: { type: String }
                    }],

                    //
                    description:{
                        moniker: { type: String },
                        identity: { type: String },
                        website: { type: String },
                        details: { type: String }
                    },
                    commission:{
                        rate: { type: String },
                        max_rate: { type: String },
                        max_change_rate: { type: String }
                    },
                    min_self_delegation: { type: String },
                    delegator_address: { type: String },
                    validator_address: { type: String },
                    pubkey: { type: String },
                    value: {
                        denom: { type: String },
                        amount: { type: String }
                    }
                }
            }],
            fee: {
                amount: [{
                    denom: { type: String },
                    amount: { type: String }
                }],
                gas: { type: String }
            },
            signature: [{
                pub_key: {
                    type: { type: String },
                    value: { type: String }
                }, signature: { type: String }
            }],
            memo: { type: String }
        }
    },
    timestamp: { type: Date, index: true },
    events: [{
        type: { type: String },
        attributes: [{
            key: { type: String },
            value: { type: String }
        }]
    }]
});

export default mongoose.model('Transaction', TxSchema);