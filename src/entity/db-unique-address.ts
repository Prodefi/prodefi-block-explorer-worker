import mongoose, { Schema } from 'mongoose';

const UniqueAddressSchema: Schema = new Schema({
    address: { type: String, unique: true },
    created_at: {type: Date, default: Date.now}
});

export default mongoose.model('UniqueAddress', UniqueAddressSchema);