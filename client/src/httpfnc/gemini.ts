import { GoogleGenAI, type Content } from "@google/genai";

// 1. Get the API key from the environment variable (using the Vite context you provided).
const API_KEY = import.meta.env.VITE_GOOGLE_GENAI_API_KEY;

// 2. Add an explicit check for the key (Best Practice)
if (!API_KEY || API_KEY === "YOUR_FALLBACK_KEY_OR_THROW_ERROR") {
  throw new Error("GEMINI_API_KEY environment variable is not set correctly.");
}

// 3. Pass the API key explicitly to the constructor.
const ai = new GoogleGenAI({
  apiKey: API_KEY,
});

/**
 * Type definition for a single message in the conversation history.
 * This aligns with the Content object structure used by the Gemini API.
 */
export interface ChatMessage {
  // Added 'system' role for the hidden prompt
  role: "user" | "assistant" | "model" | "system"; 
  content: string;
}

/**
 * Calls the Gemini model with either a simple text prompt or a full conversation history.
 * @param promptOrHistory A single string prompt or an array of ChatMessage objects.
 * @returns The response text from the model.
 */
export async function callGemini(promptOrHistory: string | ChatMessage[]): Promise<string> {

  // 1. Determine the content structure for the API call
  let contents: Content[];
  let systemInstruction: string | undefined;

  if (typeof promptOrHistory === 'string') {
    // If it's a string, wrap it in the required Content array structure.
    contents = [{ role: 'user', parts: [{ text: promptOrHistory }] }];
  } else {
    // If it's an array (history), map it to the SDK's expected Content array structure.
    // 1. Extract the System role message for the systemInstruction parameter
    const systemMessage = promptOrHistory.find(msg => msg.role === 'system');
    if (systemMessage) {
        systemInstruction = systemMessage.content;
    }

    // 2. Filter out the 'system' message and map the rest
    contents = promptOrHistory
        .filter(msg => msg.role !== 'system') // Exclude the 'system' message from the main content array
        .map(msg => ({
            // The API uses 'model' for the assistant's role, and we accept 'assistant' in our type
            role: msg.role === "assistant" ? "model" : msg.role,
            parts: [{ text: msg.content }]
        }));
  }

  // 2. Make the API call
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: contents, // Use the determined contents array
    config: {
        // Pass the extracted system instruction to the dedicated parameter
        systemInstruction: systemInstruction, 
        // Set the response format to JSON if a system instruction is present (assuming the instruction enforces JSON)
        // This is optional but can help ensure a valid JSON output from the model
        responseMimeType: systemInstruction ? "application/json" : undefined, 
    }
  });

  if (response.text)
    return response.text;
  else return "Sorry, I couldn't generate a response at this time.";
}