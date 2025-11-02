import React, { useState, useRef, useEffect } from "react";
import { Sparkles, X, Send, Zap, BookOpen } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";
import { callGemini, type ChatMessage } from "@/httpfnc/gemini";
import { useQuery } from "@tanstack/react-query";
import type { TaskDataType } from "@/types/types";
import { fetchEvents } from "@/httpfnc/user";
import { baseUrl } from "@/constast";
import { Skeleton } from "../ui/skeleton";

// Define a type for the AI's structured response (tool-use)
interface AIResponsePayload {
  iCanBookThisEvent: boolean;
  message: string;
  // Assuming 'title' is what we can use to generate an event-specific URL
  eventTitle?: string;
}

/**
 * Floating button to open the AI chat modal.
 */
export const FloatingAIButton = ({
  setIsAiModalOpen,
}: {
  setIsAiModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <button
      onClick={() => setIsAiModalOpen(true)}
      // Tailwind classes for the floating button style
      className="fixed right-8 bottom-8 z-50 group cursor-pointer"
    >
      <div className="relative">
        {/* Animated background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 rounded-full blur-lg opacity-75 group-hover:opacity-100 animate-pulse"></div>
        {/* Main button content */}
        <div className="relative bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 p-4 rounded-full shadow-2xl transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
          <Sparkles className="text-white" size={28} strokeWidth={2.5} />
        </div>
        {/* Corner ping animations */}
        <div className="absolute top-0 right-0 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
        <div
          className="absolute bottom-0 left-0 w-2 h-2 bg-blue-400 rounded-full animate-ping"
          style={{ animationDelay: "0.5s" }}
        ></div>
      </div>
    </button>
  );
};

const ChatMessageDisplay = ({ msg, sampleEvents }: { msg: ChatMessage, sampleEvents: TaskDataType[] }) => {
  let payload: AIResponsePayload | null = null;
  let text = msg.content;

  try {
    // Try to extract JSON if wrapped in ```json ... ```
    const jsonMatch = msg.content.match(/```json\s*(\{[\s\S]*?\})\s*```/);
    if (jsonMatch) {
      payload = JSON.parse(jsonMatch[1]);
    } else if (msg.content.trim().startsWith("{") && msg.content.trim().endsWith("}")) {
      // Try parsing raw JSON (no markdown)
      payload = JSON.parse(msg.content);
    }
  } catch (e) {
    console.error("Failed to parse AI response:", e);
  }

  if (payload) {
    text = payload.message;
  }

  console.log("pyalod event title:", payload?.eventTitle)
  const eventId = sampleEvents.find(s => s.title.toLowerCase() === payload?.eventTitle?.toLowerCase())
  console.log("eventid:", eventId);
  const eventUrl = `/home/event/6906af95a34a1f58b49d5a4a`;

  return (
    <div
      className={`max-w-[80%] rounded-lg p-3 whitespace-pre-wrap ${msg.role === "user"
        ? "bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 text-white"
        : "bg-foreground/5 text-foreground border border-foreground/10"
        }`}
    >
      <p className="text-sm">{text}</p>

      {payload?.iCanBookThisEvent && (
        <div className="mt-3 pt-3 border-t border-white/20">
          <a
            href={eventUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-white bg-green-600 rounded-full hover:bg-green-700 transition-colors shadow-md"
          >
            <BookOpen size={16} />
            Go to Event Page
          </a>
          {payload.eventTitle && (
            <p className="mt-1 text-xs text-white/80">
              (Found event: {payload.eventTitle})
            </p>
          )}
        </div>
      )}
    </div>
  );
};


/**
 * The main AI Chat Modal component.
 */
const AIChatModal = ({
  setIsAiModalOpen,
}: {
  setIsAiModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [message, setMessage] = useState("");

  const { data: sampleEvents, isLoading: eventsLoading } = useQuery<TaskDataType[]>({
    queryKey: ["fetchAllEvents"],
    queryFn: () => fetchEvents(baseUrl + `events`),
  });

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  // Ref for auto-scrolling the chat
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Function to create the system message (only once after events load)
  const createSystemMessage = (events: TaskDataType[]) => {
    // 1. Filter and map to simple titles
    const filteredEvents = events.map(s => ({ title: s.title, city: s.city, venue: s.venue, id: s.id }));

    // 2. Convert to a single string format for the AI context
    const eventListString = filteredEvents.map(e => `- ${e.title} (${e.city}, ${e.venue})`).join('\n');

    // 3. Construct the full system prompt
    const systemPrompt = `
      You are an AI Event Assistant. Your primary function is to help the user with information about the current events.
      
      **Current Available Events (${filteredEvents.length} in total):**
      ${eventListString}
      
      **Instructions for Response:**
      1. **ALWAYS** respond in a JSON format enclosed in a \`\`\`json block.
      2. The JSON structure **MUST** be: \`{ "iCanBookThisEvent": boolean, "message": string, "eventTitle"?: string }\`.
      3. **message**: This is the human-readable text you will show to the user.
      4. **iCanBookThisEvent**: Set this to \`true\` **ONLY** if the user asks for a specific event (by title or detailed description) and you can confirm an event exists in the list provided.
      5. **eventTitle**: If \`iCanBookThisEvent\` is \`true\`, set this to the **exact title** of the matched event from the list. If \`false\`, you can omit it.
      6. **General Queries**: For simple questions (e.g., "how many events are there?", "list all events"), set \`iCanBookThisEvent\` to \`false\`.
      
      Example of a booking response (if user asks about 'Tech Innovation Summit'):
      \`\`\`json
      {
        "iCanBookThisEvent": true,
        "message": "That's a fantastic choice! The Tech Innovation Summit is scheduled for next week. You can find more details and book your spot on the event page.",
        "eventTitle": "Tech Innovation Summit"
      }
      \`\`\`
      
      Begin by greeting the user and letting them know you have information about ${filteredEvents.length} events.
      `;

    return { role: "assistant", content: systemPrompt };
  };


  // Effect to scroll to the bottom whenever messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

  // Initial setup: Load events and construct the initial system message
  useEffect(() => {
    if (sampleEvents && messages.length === 0) {
      const initialSystemMessage = createSystemMessage(sampleEvents);
      // Set the initial chat state:
      // 1. System prompt (hidden from UI, but at index 0 for API)
      // 2. Initial friendly AI message (index 1 for UI)
      setMessages([
        // System Prompt / AI Context - This message is the context but will be filtered for display
        {
          role: "system",
          content: initialSystemMessage.content
        },
        // Initial Greeting Message (for UI)
        {
          role: "assistant",
          content: `Hello! I'm your AI assistant powered by Gemini. I currently have details on **${sampleEvents.length}** events. How can I help you today?`,
        },
      ]);
    }
  }, [sampleEvents, messages.length]);


  const handleSend = async () => {
    if (!message.trim() || isLoading) return;

    // 1. Construct the new user message object
    const newUserMessage: ChatMessage = { role: "user", content: message.trim() };

    // 2. Define the full history to send to the API (must end with a 'user' role)
    // The history includes the (un-displayed) system prompt at index 0.
    const newHistory = [...messages, newUserMessage];

    // 3. Update the UI with the user message immediately
    setMessages(newHistory);
    setMessage(""); // Clear the input
    setIsLoading(true); // Start loading

    try {
      // 4. Call the API with the *full* new history array.
      const responseText = await callGemini(newHistory);

      // 5. Add the AI's response to the chat history
      const newAIMessage: ChatMessage = { role: "assistant", content: responseText };
      setMessages((prevMessages) => [...prevMessages, newAIMessage]);

    } catch (error) {
      console.error("Gemini API Error:", error);
      // Display an error message to the user
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: "⚠️ Sorry, an error occurred while fetching the response. Check your API key or backend logs." }
      ]);
    } finally {
      setIsLoading(false); // End loading
    }
  };

  // Filter messages to exclude the 'system' role for UI rendering
  const displayMessages = messages.filter(msg => msg.role !== 'system');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl h-[600px] mx-4 bg-background rounded-lg border border-foreground/10 shadow-2xl flex flex-col overflow-hidden">

        {/* --- Modal Header --- */}
        <div className="flex items-center justify-between p-4 border-b border-foreground/10 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-orange-600/10">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-full blur-md opacity-50"></div>
              <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 p-2 rounded-full">
                <Zap className="text-white" size={20} />
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                AI Assistant
              </h2>
              <p className="text-xs text-muted-foreground">
                {isLoading ? "AI is generating response..." : "Powered by AI"}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAiModalOpen(false)}
            className="p-2 hover:bg-foreground/5 rounded-md transition-colors"
          >
            <X size={20} className="text-foreground/60" />
          </button>
        </div>

        {/* --- Chat Messages Area --- */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {displayMessages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"
                }`}
            >
              <ChatMessageDisplay
                sampleEvents={sampleEvents || []}
                msg={msg} />
            </div>
          ))}
          {/* Scroll target */}
          <div ref={messagesEndRef} />
        </div>

        {/* --- Message Input Area --- */}
        <div className="p-4 border-t border-foreground/10 bg-background">
          <div className="flex items-end gap-2 bg-foreground/5 border border-foreground/10 rounded-xl px-3 py-2 focus-within:border-primary/70 transition-all">
            <TextareaAutosize
              minRows={1}
              maxRows={8}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Type your message..."
              className="flex-1 resize-none bg-transparent outline-none text-sm text-white placeholder-neutral-500 py-1"
              disabled={isLoading}
            />

            {eventsLoading ? <Skeleton className="w-12 h-8 rounded" /> :
              <button
                onClick={handleSend}
                disabled={!message.trim() || isLoading}
                className="p-2 rounded-lg bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-700 hover:via-pink-700 hover:to-orange-700 transition-transform hover:scale-110"
              >
                <Send size={18} className="text-white" />
              </button>}
          </div>

          <p className="text-xs text-muted-foreground mt-2 text-center">
            Press <b>Enter</b> to send, <b>Shift+Enter</b> for new line
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIChatModal;