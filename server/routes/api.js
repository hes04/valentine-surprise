import express from 'express';
import Memory from '../models/Memory.js';

const router = express.Router();

// Upload a new memory
router.post('/upload', async (req, res) => {
    try {
        const { type, content } = req.body;
        if (!content) {
            return res.status(400).json({ error: 'Content is required' });
        }
        const newMemory = new Memory({ type, content });
        await newMemory.save();
        res.status(201).json(newMemory);
    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ error: 'Failed to save memory' });
    }
});

// Get all memories
router.get('/memories', async (req, res) => {
    try {
        const memories = await Memory.find().sort({ timestamp: -1 });
        res.json(memories);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch memories' });
    }
});

export default router;
