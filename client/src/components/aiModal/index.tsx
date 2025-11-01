import React, { useState } from 'react';
import { Sparkles, X, Send, Zap } from 'lucide-react';

export const FloatingAIButton = ({ setIsAiModalOpen }: { setIsAiModalOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
  return (
    <button
      onClick={() => setIsAiModalOpen(true)}
      className="fixed right-8 bottom-8 z-50 group"
    >
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-full blur-lg opacity-75 group-hover:opacity-100 animate-pulse"></div>
        
        <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 p-4 rounded-full shadow-2xl transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
          <Sparkles className="text-white" size={28} strokeWidth={2.5} />
        </div>
        
        <div className="absolute top-0 right-0 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
        <div className="absolute bottom-0 left-0 w-2 h-2 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
      </div>
    </button>
  );
};

const AIChatModal = ({
  setIsAiModalOpen,
}: {
  setIsAiModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I\'m your AI assistant. How can I help you today?' }
  ]);

  const handleSend = () => {
    if (message.trim()) {
      setMessages([...messages, { role: 'user', content: message }]);
      setMessage('');
      
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: 'I\'m here to help! This is a demo response.' 
        }]);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl h-[600px] mx-4 bg-background rounded-lg border border-foreground/10 shadow-2xl flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-foreground/10 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-orange-600/10">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-full blur-md opacity-50"></div>
              <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 p-2 rounded-full">
                <Zap className="text-white" size={20} />
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">AI Assistant</h2>
              <p className="text-xs text-muted-foreground">Powered by AI</p>
            </div>
          </div>
          <button
            onClick={() => setIsAiModalOpen(false)}
            className="p-2 hover:bg-foreground/5 rounded-md transition-colors"
          >
            <X size={20} className="text-foreground/60" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 text-white'
                    : 'bg-foreground/5 text-foreground border border-foreground/10'
                }`}
              >
                <p className="text-sm">{msg.content}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-foreground/10 bg-background">
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 bg-foreground/5 rounded-md px-4 py-2.5 text-sm text-foreground border border-foreground/10 focus:border-primary focus:outline-none transition-colors placeholder:text-muted-foreground"
            />
            <button
              onClick={handleSend}
              disabled={!message.trim()}
              className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-md transition-all transform hover:scale-105 disabled:hover:scale-100"
            >
              <Send size={18} />
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIChatModal;