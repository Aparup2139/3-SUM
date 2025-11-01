import { useState, useRef, useEffect } from "react";
import { Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import ChatMessage from "@/components/ChatMessage";
import TypingIndicator from "@/components/TypingIndicator";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hi! I\'m your AI assistant. How can I help you today?' }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage = inputValue.trim();
    setInputValue("");

    const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setIsTyping(true);

    try {
      const response = await fetch('http://localhost:5000/api/llm/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: userMessage,
          history: messages
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      setMessages([...newMessages, { 
        role: 'assistant', 
        content: data.answer || 'Sorry, I received an empty response.' 
      }]);
      
    } catch (error) {
      console.error('Error calling API:', error);
      toast.error('Failed to get response. Make sure your API is running at http://localhost:5000');
      
      setMessages([...newMessages, { 
        role: 'assistant', 
        content: 'Sorry, I couldn\'t connect to the server. Please make sure the API is running.' 
      }]);
    } finally {
      setIsTyping(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-chat relative overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-[120px] animate-float [animation-delay:-1.5s]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[150px] animate-glow-pulse"></div>
      </div>

      {/* Header */}
      <div className="bg-card/80 backdrop-blur-xl shadow-3d border-b border-border/50 relative z-10">
        <div className="max-w-4xl mx-auto px-4 py-5">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Sparkles className="h-8 w-8 text-primary animate-glow-pulse" />
              <div className="absolute inset-0 blur-md">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-neon bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]">
                Puff ‘n Prompt
              </h1>
              <p className="text-sm text-muted-foreground">Powered by your local Moeen and Kali(IYKYK)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto relative z-10">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              role={message.role}
              content={message.content}
            />
          ))}
          
          {isTyping && <TypingIndicator />}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-border/50 bg-card/80 backdrop-blur-xl shadow-3d relative z-10">
        <div className="max-w-4xl mx-auto px-4 py-5">
          <div className="flex gap-3">
            <div className="flex-1 relative group">
              <Input
                ref={inputRef}
                type="text"
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isTyping}
                className="bg-chat-input border-border/50 shadow-3d transition-all duration-300 focus:shadow-glow-md pr-4 text-base"
              />
              <div className="absolute inset-0 rounded-lg bg-gradient-primary opacity-0 group-focus-within:opacity-10 blur-xl transition-opacity duration-300 pointer-events-none"></div>
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className="bg-gradient-primary hover:opacity-90 transition-all duration-300 shadow-glow-md hover:shadow-glow-lg hover:scale-105 disabled:opacity-50 disabled:scale-100"
              size="icon"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-3 text-center animate-in fade-in-0 duration-1000">
            Press <span className="text-primary font-semibold">Enter</span> to send • <span className="text-accent font-semibold">Shift + Enter</span> for new line
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
