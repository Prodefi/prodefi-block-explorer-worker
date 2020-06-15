import mongoose, { Schema } from 'mongoose';

const MissingBlockSchema: Schema = new Schema({
    height: { type: String, unique: true },
    deleted_at: {type: Date, default: null},
    created_at: {type: Date, default: Date.now}
});

export default mongoose.model('MissingBlock', MissingBlockSchema);