import mongoose, { Schema } from 'mongoose';

const BlockSchema: Schema = new Schema({
  block_meta: {
    block_id: {
      hash: { type: String },
      parts: {
        total: { type: String },
        hash: { type: String }
      }
    },
    header: {
      version: {
        block: { type: String },
        app: { type: String },
      },
      chain_id: { type: String },
      height: { type: Number },
      time: { type: Date },
      num_txs: { type: String },
      total_txs: { type: String },
      last_block_id: {
        hash: { type: String },
        parts: {
          total: { type: String },
          hash: { type: String }
        }
      },
      last_commit_hash: { type: String },
      data_hash: { type: String },
      validators_hash: { type: String },
      next_validators_hash: { type: String },
      consensus_hash: { type: String },
      app_hash: { type: String },
      last_results_hash: { type: String },
      evidence_hash: { type: String },
      proposer_address: { type: String },
    }
  },
  block: {
    header: {
      version: {
        block: { type: String },
        app: { type: String },
      },
      chain_id: { type: String },
      height: { type: Number, unique: true, required: true, index: true },
      time: { type: Date },
      num_txs: { type: String },
      total_txs: { type: String },
      last_block_id: {
        hash: { type: String },
        parts: {
          total: { type: String },
          hash: { type: String }
        }
      },
      last_commit_hash: { type: String },
      data_hash: { type: String },
      validators_hash: { type: String },
      next_validators_hash: { type: String },
      consensus_hash: { type: String },
      app_hash: { type: String },
      last_results_hash: { type: String },
      evidence_hash: { type: String },
      proposer_address: { type: String, index: true },
    },
    data: {
      txs: [{ type: String }]
    },
    evidence: {
      evidence: { type: String }
    },
    last_commit: {
      block_id: {
        hash: { type: String },
        parts: {
          total: { type: String },
          hash: { type: String }
        }
      },
      precommits: [{
        type: { type: Number },
        height: { type: String },
        round: { type: String },
        block_id: {
          hash: { type: String },
          parts: {
            total: { type: String },
            hash: { type: String }
          }
        },
        timestamp: { type: Date, index: true },
        validator_address: { type: String },
        validator_index: { type: String },
        signature: { type: String },
      }]
    }
  }
});

export default mongoose.model('Block', BlockSchema);