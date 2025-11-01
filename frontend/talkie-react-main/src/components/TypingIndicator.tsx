const TypingIndicator = () => {
  return (
    <div className="flex w-full mb-6 justify-start animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      <div className="bg-chat-assistant text-chat-assistant-foreground max-w-[80%] rounded-2xl rounded-bl-md px-5 py-4 shadow-3d border border-border/50 backdrop-blur-sm">
        <div className="w-8 h-1 bg-gradient-accent rounded-full mb-3 shadow-glow-sm animate-shimmer bg-[length:200%_100%]"></div>
        <div className="flex gap-2">
          <div className="w-3 h-3 bg-gradient-primary rounded-full animate-bounce [animation-delay:-0.3s] shadow-glow-sm"></div>
          <div className="w-3 h-3 bg-gradient-secondary rounded-full animate-bounce [animation-delay:-0.15s] shadow-glow-sm"></div>
          <div className="w-3 h-3 bg-gradient-accent rounded-full animate-bounce shadow-glow-sm"></div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
