require('dotenv').config({ path: './apiKey.env' });

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: '*' }));
app.use(bodyParser.json());

// Load API Keys
const HF_API_KEY = process.env.HF_API_KEY?.trim();
const HF_MODEL_URL = "https://router.huggingface.co/hf-inference/models/facebook/blenderbot-400M-distill";
const MONGO_URI = process.env.MONGO_URI?.trim();
const DB_NAME = "universityDB";
const COLLECTION_NAME = "faq";

// Validate API Keys
if (!HF_API_KEY) {
    console.error("❌ Missing Hugging Face API Key!");
    process.exit(1);
}
if (!MONGO_URI) {
    console.error("❌ Missing MongoDB URI!");
    process.exit(1);
}

// MongoDB Connection
let db;
const connectToMongoDB = async () => {
    try {
        const client = new MongoClient(MONGO_URI);
        await client.connect();
        db = client.db(DB_NAME);
        console.log("✅ Connected to MongoDB Atlas");
    } catch (err) {
        console.error("❌ MongoDB Connection Error:", err.message);
        process.exit(1);
    }
};
connectToMongoDB();

// Root Route
app.get('/', (req, res) => {
    res.send("<h2>✅ Server is running! Use POST /chat to talk to the chatbot.</h2>");
});

// Chatbot API (POST /chat)
app.post('/chat', async (req, res) => {
    try {
        const userMessage = req.body?.message?.trim().toLowerCase();

        if (!userMessage) {
            return res.status(400).json({ error: "Invalid request. 'message' field is required." });
        }

        console.log(`🔹 User Message: "${userMessage}"`);

        if (!db) {
            console.error("❌ Database connection issue.");
            return res.status(500).json({ error: "Database connection issue. Please try again later." });
        }

        // Fetch FAQ response from MongoDB
        const collection = db.collection(COLLECTION_NAME);
        const words = userMessage.split(" ");
        const faqResponse = await collection.findOne({ keywords: { $in: words } });

        if (faqResponse) {
            console.log(`✅ Database Match Found: "${faqResponse.response}"`);
            return res.json({ 
                response: faqResponse.response,
                url: faqResponse.url || null
            });
        }

        // No match found → Call AI Model for response
        console.log("❌ No Database Match. Calling AI...");

        try {
            const response = await axios.post(
                HF_MODEL_URL,
                { inputs: userMessage },
                {
                    headers: {
                        Authorization: `Bearer ${HF_API_KEY}`,
                        'Content-Type': 'application/json',
                        'User-Agent': 'Mozilla/5.0'
                    },
                    maxRedirects: 5
                }
            );

            if (!response.data || response.data.error) {
                console.error("❌ Hugging Face API Error:", response.data.error);
                return res.status(500).json({ error: "AI service error. Try again later." });
            }

            const botReply = response.data?.[0]?.generated_text || "I'm not sure how to respond.";
            console.log(`🤖 AI Response: "${botReply}"`);
            res.json({ response: botReply, url: null });

        } catch (aiError) {
            console.error("❌ Hugging Face API Request Failed:", aiError.response?.data || aiError.message);
            return res.status(500).json({ error: "Failed to fetch AI response. Please try again later." });
        }

    } catch (error) {
        console.error('❌ General Server Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
