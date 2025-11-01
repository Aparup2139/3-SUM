// src/config/llama.js
// Configuration for connecting to the Llama LLM (e.g., via a hosted API or Ollama endpoint).
import dotenv from 'dotenv';

dotenv.config();

// Configuration constants for Llama API
const LLAMA_API_URL = process.env.LLAMA_API_URL || 'http://localhost:11434/api/generate'; 
const LLAMA_MODEL_NAME = process.env.LLAMA_MODEL_NAME || 'llama3';
const LLAMA_API_KEY = process.env.LLAMA_API_KEY; 

// --- Llama Client Wrapper ---
const LLaMAClient = {
    async generateContent(prompt) {
        if (!LLAMA_API_KEY && LLAMA_API_URL.includes('http')) {
             console.warn("LLAMA_API_KEY is missing. Assuming local Ollama or unauthenticated endpoint.");
        }
        
        try {
            const response = await fetch(LLAMA_API_URL, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    ...(LLAMA_API_KEY && { 'Authorization': `Bearer ${LLAMA_API_KEY}` })
                },
                body: JSON.stringify({
                    model: LLAMA_MODEL_NAME,
                    prompt: prompt,
                    stream: false,
                }),
            });

            if (!response.ok) {
                throw new Error(`LLaMA API HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            // Llama/Ollama responses often use 'response' or 'text'
            return data.response || data.text || ''; 

        } catch (error) {
            console.error('LLaMA API communication error:', error.message);
            return 'Error: Could not connect to Llama AI service.';
        }
    }
};

// Function used by server.js to confirm initialization (can be async if needed)
export const initializeLLaMAClient = () => {
    console.log(`LLaMA Client initialized, targeting: ${LLAMA_MODEL_NAME} at ${LLAMA_API_URL}`);
};


/**
 * Initializes the RAG system by connecting to the event vector store.
 * This function handles the Retrieval aspect of RAG.
 */
export const initRAGSystem = async () => {
    console.log('Llama RAG system ready for semantic search.');
    return {
        llmClient: LLaMAClient,
        retrieveEvents: async (query) => {
            console.log(`Retrieving context for Llama RAG: "${query}"`);
            const mockContexts = [
                "Event: Global Tech Summit. Category: Tech. Date: Nov 15th. Description: Deep dive into the future of AI and LLMs.",
                "Event: Indie Music Fest. Category: Music. Date: Nov 20th. Description: Showcase of local bands in the jazz and rock genres.",
            ];
            return mockContexts; 
        }
    };
};
