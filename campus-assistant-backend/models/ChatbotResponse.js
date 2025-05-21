const mongoose = require('mongoose');

const ChatbotResponseSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ChatbotResponse', ChatbotResponseSchema);
