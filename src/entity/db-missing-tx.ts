import mongoose, { Schema } from 'mongoose';

const MissingTxSchema: Schema = new Schema({
    txhash: { type: String, unique: true },
    deleted_at: {type: Date, default: null},
    created_at: {type: Date, default: Date.now}
});

export default mongoose.model('MissingTransaction', MissingTxSchema);