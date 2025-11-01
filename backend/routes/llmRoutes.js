// routes/llmRoutes.js

import express from 'express';
// Import the exported function from your llm_config.js


const router = express.Router();

// Define the API endpoint for LLM generation
router.post("/generate", async (req, res) => {
    // You are expecting a JSON body: { "query": "...", "history": [...] }
    const { query, history } = req.body;

    if (!query) {
        return res.status(400).json({ message: "Query is required" });
    }

    try {
        // Call the LLM function
        const responseText = await getHuggingFaceCompletion(query, history);
        
        return res.status(200).json({ answer: responseText });

    } catch (error) {
        // Handle error thrown by the LLM service
        return res.status(500).json({ message: error.message });
    }
});

export default router;