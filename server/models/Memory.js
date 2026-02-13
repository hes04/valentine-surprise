import mongoose from 'mongoose';

const MemorySchema = new mongoose.Schema({
    type: { type: String, required: true }, // 'note' or 'photo'
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('Memory', MemorySchema);
