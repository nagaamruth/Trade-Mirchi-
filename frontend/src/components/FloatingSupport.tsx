"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Bot, X, ArrowRight, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import axios from "axios";

export default function FloatingSupport() {
  const [isBotOpen, setIsBotOpen] = useState(false);
  const [messages, setMessages] = useState<{role: "user" | "bot", content: string}[]>([
    { role: "bot", content: "Hello! I'm your Trade Mirchi AI assistant. How can I help you with agricultural trading today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isBotOpen]);

  const sendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setIsLoading(true);

    try {
      const res = await axios.post("/api/chat", { message: userMsg, history: messages });
      setMessages(prev => [...prev, { role: "bot", content: res.data.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: "bot", content: "Sorry, I'm having trouble connecting right now." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isBotOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-32 md:bottom-24 right-4 md:right-6 w-[calc(100vw-2rem)] sm:w-96 h-[30rem] max-h-[70vh] bg-card border border-white/10 rounded-2xl shadow-2xl z-[100] flex flex-col overflow-hidden"
          >
            <div className="bg-primary/10 p-4 border-b border-white/5 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-semibold text-sm block leading-tight">Trade Mirchi AI</span>
                  <span className="text-[10px] text-primary flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"/> Online</span>
                </div>
              </div>
              <button onClick={() => setIsBotOpen(false)} className="text-muted-foreground hover:text-foreground bg-white/5 w-8 h-8 rounded-full flex items-center justify-center transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4 bg-background/50">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`p-3 rounded-2xl text-sm max-w-[85%] ${
                    msg.role === "user" 
                      ? "bg-primary text-primary-foreground rounded-br-sm" 
                      : "bg-secondary/50 text-foreground/90 border border-white/5 rounded-bl-sm"
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="p-3 rounded-2xl text-sm bg-secondary/50 border border-white/5 rounded-bl-sm flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span className="text-muted-foreground text-xs">AI is thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={sendMessage} className="p-3 border-t border-white/5 bg-card shrink-0">
              <div className="flex gap-2 relative">
                <input 
                  type="text" 
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask about prices, trading..." 
                  className="flex-1 bg-secondary/30 border border-white/5 rounded-full pl-4 pr-12 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
                />
                <button 
                  type="submit" 
                  disabled={isLoading || !input.trim()}
                  className="absolute right-1 top-1 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground disabled:opacity-50 transition-opacity"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-24 md:bottom-6 right-4 md:right-6 flex flex-col gap-3 z-[90]">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsBotOpen(!isBotOpen)}
          className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center border transition-colors ${isBotOpen ? 'bg-secondary border-white/10 text-foreground' : 'bg-primary text-primary-foreground border-primary-foreground/20'}`}
        >
          {isBotOpen ? <X className="w-6 h-6" /> : <Bot className="w-7 h-7" />}
        </motion.button>
        
        <motion.a
          href="https://wa.me/919059815694" 
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-14 h-14 rounded-full bg-emerald-500 text-white shadow-2xl flex items-center justify-center border border-emerald-400"
        >
          <MessageCircle className="w-7 h-7" />
        </motion.a>
      </div>
    </>
  );
}
