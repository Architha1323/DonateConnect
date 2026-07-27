'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Minus, HeartHandshake, Sparkles, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export function Chatbot() {
  const { user } = useAuth();
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [messages, setMessages] = useState<{role: string, content: string, id: string}[]>([{
    role: 'assistant',
    content: `👋 **Welcome to DonateConnect!**\n\nI'm your Navigation Assistant. I don't use AI—I just help you get exactly where you need to go instantly! \n\nClick one of the buttons below or type what you're looking for.`,
    id: 'welcome-msg'
  }]);
  const [input, setInput] = useState('');

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleChat = () => {
    if (!isOpen) {
      setIsOpen(true);
      setIsMinimized(false);
      setHasUnread(false);
    } else if (isMinimized) {
      setIsMinimized(false);
      setHasUnread(false);
    } else {
      setIsMinimized(true);
    }
  };

  const closeChat = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: `Chat history cleared. How can I help you navigate?`,
      id: Date.now().toString()
    }]);
  };

  const handleActionClick = (action: string) => {
    processQuery(action);
  };

  const processQuery = (query: string) => {
    const q = query.toLowerCase();
    
    // Add user message
    const userMessageId = crypto.randomUUID();
    setMessages(prev => [...prev, { role: 'user', content: query, id: userMessageId }]);
    setInput('');

    setTimeout(() => {
      let response = '';
      let destination: string | null = null;

      // Navigation Logic
      if (q.includes('open dashboard') || q.includes('go to dashboard')) {
        destination = user?.role === 'ADMIN' ? '/admin/dashboard' : user?.role === 'NGO' ? '/ngo/dashboard' : '/donor/dashboard';
        response = `Navigating you to your dashboard... 🚀`;
      }
      else if (q.includes('go home') || q === 'home') {
        destination = '/';
        response = `Taking you back to the home page! 🏠`;
      }
      else if (q.includes('open profile') || q.includes('my profile')) {
        destination = '/donor/profile';
        response = `Opening your profile settings... ⚙️`;
      }
      else if (q.includes('open donations') || q.includes('track donation')) {
        destination = '/donor/donations';
        response = `Taking you to your donations page! 📦`;
      }
      else if (q.includes('open ngos') || q.includes('find ngos')) {
        destination = '/ngos';
        response = `Here is our directory of verified NGOs! 🏢`;
      }
      else if (q.includes('donate now') || q.includes('donate items')) {
        destination = '/donor/donate';
        response = `Awesome! Let's get your donation started. ❤️`;
      }
      else if (q.includes('schedule pickup')) {
        destination = '/donor/donate?action=pickup';
        response = `Taking you to the pickup scheduling form! 🚚`;
      }
      // Informational Logic
      else if (q.includes('accepted items') || q.includes('what can i donate')) {
        response = `We accept a wide variety of items in good condition, including:\n- 👕 **Clothes**\n- 📚 **Books**\n- 🧸 **Toys**\n- 🪑 **Furniture**\n- 💻 **Electronics**\n- 🍽️ **Kitchenware**`;
      }
      else if (q.includes('process') || q.includes('how it works')) {
        response = `**The Donation Process is simple!**\n1. You list the items you want to donate.\n2. You choose an NGO or schedule a doorstep pickup.\n3. We collect the items and deliver them to those in need!\n\nWould you like to [Donate Now](/donor/donate)?`;
      }
      else if (q.includes('joke')) {
        response = `Why did the donation cross the road?\n\n*To get to the NGO on the other side!* 😄`;
      }
      else if (q.includes('ai') || q.includes('explain ai')) {
        response = `I am no longer an AI! I have been upgraded to a lightning-fast static Navigation Assistant built directly into the app. No more API delays! ⚡`;
      }
      else {
        response = `I am a simple Navigation Assistant! \n\nPlease click one of the buttons below, or try asking me to **"Donate Items"**, **"Find NGOs"**, or **"Open Dashboard"**.`;
      }

      // Add assistant response
      setMessages(prev => [...prev, { role: 'assistant', content: response, id: crypto.randomUUID() }]);

      // Perform navigation if needed
      if (destination) {
        setTimeout(() => {
          router.push(destination as string);
        }, 500);
      }
    }, 300); // Small delay to feel natural
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;
    processQuery(input.trim());
  };

  const suggestedActions = [
    "Donate Items", "Track my donation", "Find NGOs", 
    "Schedule pickup", "Accepted items", "Open dashboard",
    "How it works", "Tell me a joke"
  ];

  return (
    <>
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-4 sm:right-8 w-[calc(100vw-32px)] sm:w-[400px] h-[600px] max-h-[calc(100vh-120px)] bg-background/80 dark:bg-slate-900/80 backdrop-blur-3xl border border-border/50 shadow-2xl rounded-2xl flex flex-col overflow-hidden z-50 ring-1 ring-black/5"
          >
            {/* Header */}
            <div className="bg-primary/90 dark:bg-primary/80 backdrop-blur-md p-4 text-primary-foreground flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-xl">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">DonateConnect Assistant</h3>
                  <div className="flex items-center gap-1.5 text-xs text-primary-foreground/80">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    Online
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={clearChat} className="p-2 hover:bg-white/20 rounded-lg transition-colors" title="Clear Chat">
                  <Trash2 className="h-4 w-4" />
                </button>
                <button onClick={toggleChat} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                  <Minus className="h-4 w-4" />
                </button>
                <button onClick={closeChat} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-3 max-w-[85%] ${
                    m.role === 'user' ? 'ml-auto flex-row-reverse' : ''
                  }`}
                >
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                    m.role === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400'
                  }`}>
                    {m.role === 'user' ? <HeartHandshake className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                  </div>
                  <div
                    className={`group relative p-3.5 rounded-2xl text-sm ${
                      m.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-tr-sm shadow-md'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-tl-sm shadow-sm'
                    }`}
                  >
                    <div className={`prose prose-sm dark:prose-invert max-w-none ${m.role === 'user' ? 'prose-p:text-white' : ''}`}>
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {m.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area with Buttons Always Visible */}
            <div className="p-4 bg-white dark:bg-slate-900 border-t border-border/50">
              <div className="flex flex-wrap gap-2 mb-3">
                {suggestedActions.map((action, i) => (
                  <button
                    key={i}
                    onClick={() => handleActionClick(action)}
                    className="text-xs bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-full border border-emerald-100 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-800/50 transition-colors whitespace-nowrap"
                  >
                    {action}
                  </button>
                ))}
              </div>
              <form onSubmit={handleSubmit} className="flex gap-2 relative">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a navigation command..."
                  className="flex-1 rounded-xl bg-slate-100 dark:bg-slate-800 border-transparent focus:border-primary focus:ring-1 focus:ring-primary px-4 py-3 outline-none text-sm transition-all"
                />
                <button 
                  type="submit" 
                  disabled={!input.trim()} 
                  className="h-11 w-11 rounded-xl bg-primary hover:bg-primary/90 text-white flex items-center justify-center shadow-md shrink-0 transition-transform active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                >
                  <Send className="h-5 w-5 ml-0.5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.button
        onClick={toggleChat}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 h-14 w-14 bg-primary text-primary-foreground rounded-full shadow-xl flex items-center justify-center z-50 hover:shadow-primary/25 transition-all"
      >
        {isOpen && !isMinimized ? (
          <X className="h-6 w-6" />
        ) : (
          <div className="relative">
            <MessageSquare className="h-6 w-6" />
            {hasUnread && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-primary"></span>
              </span>
            )}
          </div>
        )}
      </motion.button>
    </>
  );
}
