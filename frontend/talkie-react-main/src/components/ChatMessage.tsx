import { cn } from "@/lib/utils";

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
}

const ChatMessage = ({ role, content }: ChatMessageProps) => {
  const isUser = role === 'user';
  
  return (
    <div className={cn(
      "flex w-full mb-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-700",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-[80%] rounded-2xl px-5 py-4 backdrop-blur-sm transform transition-all duration-300 hover:scale-[1.02]",
        isUser 
          ? "bg-gradient-primary text-chat-user-foreground rounded-br-md shadow-glow-md hover:shadow-glow-lg" 
          : "bg-chat-assistant text-chat-assistant-foreground rounded-bl-md shadow-3d border border-border/50"
      )}>
        {!isUser && (
          <div className="w-8 h-1 bg-gradient-secondary rounded-full mb-3 shadow-glow-sm"></div>
        )}
        <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap break-words">
          {content}
        </p>
        {isUser && (
          <div className="flex justify-end mt-2">
            <div className="w-2 h-2 rounded-full bg-accent animate-glow-pulse"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
