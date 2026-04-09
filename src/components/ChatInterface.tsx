import { motion, AnimatePresence } from "motion/react";
import { 
  Plus, 
  History, 
  Library, 
  Settings, 
  Share2, 
  MoreVertical, 
  Paperclip, 
  Mic, 
  ArrowUp,
  Sparkles,
  Copy,
  ThumbsUp,
  RotateCcw,
  MessageSquare,
  Menu,
  X
} from "lucide-react";
import { useState, useRef, useEffect, FormEvent } from "react";

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  type?: 'text' | 'code';
  codeTitle?: string;
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    role: 'user',
    content: "How do I implement a minimalist UI with the Monkeytype Muted theme? I want it to feel premium and focused."
  },
  {
    id: "2",
    role: 'ai',
    content: "To achieve the Monkeytype Muted aesthetic, focus on three pillars: chromatic restraint, spatial breathing, and typographic hierarchy.\n\n• Use #111111 as your foundation to reduce eye strain and provide deep contrast.\n• Reserve #d1d0c5 for primary text and interactive states only.\n• Utilize #646669 for meta-information, secondary labels, and inactive components.\n\nThe \"premium\" feel comes from generous margins and removing unnecessary borders. Let the negative space define the containers rather than lines."
  },
  {
    id: "3",
    role: 'ai',
    type: 'code',
    codeTitle: 'CSS Boilerplate',
    content: `:root {
  --bg-color: #111111;
  --main-color: #d1d0c5;
  --caret-color: #d1d0c5;
  --sub-color: #646669;
  --text-color: #d1d0c5;
  --error-color: #ca4754;
}

body {
  background-color: var(--bg-color);
  color: var(--text-color);
  font-family: 'Inter', sans-serif;
}`
  }
];

export function ChatInterface() {
  const [chats, setChats] = useState<Chat[]>([
    {
      id: "initial-chat",
      title: "Minimalist UI Design",
      messages: INITIAL_MESSAGES,
      createdAt: Date.now()
    }
  ]);
  const [activeChatId, setActiveChatId] = useState<string>("initial-chat");
  const [inputMessage, setInputMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  // Connection Settings
  const [connection, setConnection] = useState({
    apiUrl: "http://localhost:11434/v1", // Default for Ollama
    apiKey: "",
    model: "llama3",
    useLocal: false
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  const activeChat = chats.find(c => c.id === activeChatId) || chats[0];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeChat.messages, isTyping]);

  const handleNewChat = () => {
    const newChat: Chat = {
      id: Math.random().toString(36).substring(7),
      title: "New Chat",
      messages: [],
      createdAt: Date.now()
    };
    setChats([newChat, ...chats]);
    setActiveChatId(newChat.id);
    setIsSidebarOpen(false);
  };

  const handleSendMessage = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!inputMessage.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage.trim()
    };

    const currentInput = inputMessage.trim();
    setInputMessage("");
    
    // Update UI with user message
    setChats(prev => prev.map(chat => {
      if (chat.id === activeChatId) {
        const newMessages = [...chat.messages, userMessage];
        const newTitle = chat.messages.length === 0 ? currentInput.substring(0, 30) + (currentInput.length > 30 ? "..." : "") : chat.title;
        return { ...chat, messages: newMessages, title: newTitle };
      }
      return chat;
    }));

    setIsTyping(true);

    try {
      if (connection.useLocal) {
        // Real API Call to Local Model (OpenAI Compatible)
        const response = await fetch(`${connection.apiUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(connection.apiKey ? { 'Authorization': `Bearer ${connection.apiKey}` } : {})
          },
          body: JSON.stringify({
            model: connection.model,
            messages: [{ role: "user", content: currentInput }],
            stream: false
          })
        });

        if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
        
        const data = await response.json();
        const aiContent = data.choices[0].message.content;

        const aiResponse: Message = {
          id: Date.now().toString(),
          role: 'ai',
          content: aiContent
        };

        setChats(prev => prev.map(chat => 
          chat.id === activeChatId 
            ? { ...chat, messages: [...chat.messages, aiResponse] }
            : chat
        ));
      } else {
        // Simulated AI response for demo
        setTimeout(() => {
          const aiResponse: Message = {
            id: (Date.now() + 1).toString(),
            role: 'ai',
            content: "I'm currently in demo mode. Connect a local model in Settings to enable real-time responses from your VS Code environment."
          };
          setChats(prev => prev.map(chat => 
            chat.id === activeChatId 
              ? { ...chat, messages: [...chat.messages, aiResponse] }
              : chat
          ));
          setIsTyping(false);
        }, 1000);
        return; // Exit early to avoid setting isTyping to false twice
      }
    } catch (error) {
      console.error("Chat Error:", error);
      const errorResponse: Message = {
        id: Date.now().toString(),
        role: 'ai',
        content: `Error connecting to local model: ${error instanceof Error ? error.message : 'Unknown error'}. Make sure your model is running and CORS is enabled.`
      };
      setChats(prev => prev.map(chat => 
        chat.id === activeChatId 
          ? { ...chat, messages: [...chat.messages, errorResponse] }
          : chat
      ));
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-screen bg-surface text-primary overflow-hidden font-sans relative">
      {/* Settings Modal */}
      <AnimatePresence>
        {isSettingsOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSettingsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-surface-high border border-outline/30 rounded-2xl p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-light text-primary">Connection Settings</h3>
                <button onClick={() => setIsSettingsOpen(false)} className="text-secondary hover:text-primary transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-xl bg-primary/5 border border-outline/20">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-primary">Use Local Model</span>
                    <span className="text-[10px] text-secondary uppercase tracking-wider">Connect to Ollama/LM Studio</span>
                  </div>
                  <button 
                    onClick={() => setConnection(prev => ({ ...prev, useLocal: !prev.useLocal }))}
                    className={`w-10 h-5 rounded-full transition-colors relative ${connection.useLocal ? 'bg-primary' : 'bg-outline/30'}`}
                  >
                    <motion.div 
                      animate={{ x: connection.useLocal ? 22 : 2 }}
                      className="absolute top-1 w-3 h-3 rounded-full bg-surface"
                    />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-secondary font-bold uppercase tracking-widest ml-1">API Endpoint</label>
                    <input 
                      type="text" 
                      value={connection.apiUrl}
                      onChange={(e) => setConnection(prev => ({ ...prev, apiUrl: e.target.value }))}
                      placeholder="http://localhost:11434/v1"
                      className="w-full bg-surface border border-outline/30 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary/40 transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-secondary font-bold uppercase tracking-widest ml-1">Model Name</label>
                    <input 
                      type="text" 
                      value={connection.model}
                      onChange={(e) => setConnection(prev => ({ ...prev, model: e.target.value }))}
                      placeholder="llama3"
                      className="w-full bg-surface border border-outline/30 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary/40 transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-secondary font-bold uppercase tracking-widest ml-1">API Key (Optional)</label>
                    <input 
                      type="password" 
                      value={connection.apiKey}
                      onChange={(e) => setConnection(prev => ({ ...prev, apiKey: e.target.value }))}
                      placeholder="••••••••"
                      className="w-full bg-surface border border-outline/30 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary/40 transition-colors"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-outline/10">
                  <p className="text-[10px] text-secondary leading-relaxed">
                    <span className="text-primary font-bold">Note:</span> If using the cloud preview, your browser may block requests to localhost. You may need to enable CORS in your local model settings or run this app locally.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-surface-high border-r border-outline/20 flex flex-col 
        transition-transform duration-300 ease-in-out md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 flex flex-col h-full">
          {/* Logo Section */}
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Sparkles className="text-primary w-5 h-5 stroke-[1.5px]" />
              </div>
              <div className="flex flex-col">
                <span className="text-primary text-sm font-semibold tracking-tight">Sentient AI</span>
                <span className="text-secondary text-[10px] uppercase tracking-[0.2em] font-bold">Muted Edition</span>
              </div>
            </div>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden text-secondary hover:text-primary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto pr-2 custom-scrollbar">
            <button 
              onClick={handleNewChat}
              className="w-full flex items-center gap-3 px-3 py-2.5 bg-primary/5 rounded-lg text-primary text-sm font-medium transition-colors hover:bg-primary/10 group mb-6"
            >
              <Plus className="w-4 h-4 text-secondary group-hover:text-primary transition-colors" />
              New Chat
            </button>
            
            <div className="space-y-4">
              <p className="text-[10px] text-secondary uppercase tracking-[0.2em] font-bold px-3">Recent History</p>
              <div className="space-y-1">
                {chats.map((chat) => (
                  <button 
                    key={chat.id}
                    onClick={() => {
                      setActiveChatId(chat.id);
                      setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 group ${
                      activeChatId === chat.id 
                        ? "bg-primary/10 text-primary" 
                        : "text-secondary hover:text-primary hover:bg-primary/5"
                    }`}
                  >
                    <MessageSquare className={`w-4 h-4 ${activeChatId === chat.id ? "text-primary" : "text-secondary group-hover:text-primary"}`} />
                    <span className="truncate text-left flex-1">{chat.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </nav>

          {/* Footer Sidebar */}
          <div className="mt-auto pt-6 border-t border-outline/20">
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="w-full flex items-center gap-3 px-3 py-2 text-secondary hover:text-primary transition-colors text-sm group"
            >
              <Settings className="w-4 h-4 text-secondary group-hover:text-primary transition-colors" />
              Settings
            </button>
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col bg-surface relative z-10 w-full min-w-0">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-4 md:px-8 border-b border-outline/10">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 -ml-2 text-secondary hover:text-primary transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center gap-3">
              <span className="text-secondary text-[10px] uppercase tracking-[0.1em] font-bold">Model:</span>
              <span className="text-primary text-[10px] font-bold uppercase tracking-[0.1em] bg-primary/5 px-2 py-1 rounded-md border border-outline/30">
                {connection.useLocal ? `Local: ${connection.model}` : "GPT-4 Turbo (Muted)"}
              </span>
            </div>
            <div className="sm:hidden text-primary text-[10px] font-bold uppercase tracking-[0.1em] bg-primary/5 px-2 py-1 rounded-md border border-outline/30">
              {connection.useLocal ? "Local" : "GPT-4"}
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <button className="text-secondary hover:text-primary transition-colors p-1">
              <Share2 className="w-4 h-4" />
            </button>
            <button className="text-secondary hover:text-primary transition-colors p-1">
              <MoreVertical className="w-4 h-4" />
            </button>
            <div className="h-8 w-8 rounded-full border border-outline/30 bg-primary/5 flex items-center justify-center overflow-hidden">
               <div className="w-full h-full bg-primary/20" />
            </div>
          </div>
        </header>

        {/* Scrollable Conversation */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 space-y-12 scroll-smooth custom-scrollbar">
          <div className="max-w-3xl mx-auto">
            <AnimatePresence mode="popLayout">
              {activeChat.messages.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="h-full flex flex-col items-center justify-center pt-20 md:pt-32 text-center"
                >
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-primary/5 border border-outline/20 flex items-center justify-center mb-6">
                    <Sparkles className="text-primary w-6 h-6 md:w-8 md:h-8 stroke-[1.5px]" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-light text-primary mb-2">How can I help you today?</h2>
                  <p className="text-secondary text-sm max-w-sm px-4">
                    Start a new conversation to explore design systems, code, or creative ideas in the Muted workspace.
                  </p>
                </motion.div>
              ) : (
                <div className="space-y-12">
                  {activeChat.messages.map((msg) => (
                    <motion.div 
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.role === 'user' ? 'flex-col items-end' : 'gap-3 md:gap-6'} group`}
                    >
                      {msg.role === 'ai' && (
                        <div className="h-8 w-8 mt-1 rounded-lg bg-primary/5 border border-outline/20 flex-shrink-0 flex items-center justify-center">
                          <Sparkles className="text-primary w-4 h-4 stroke-[1.5px]" />
                        </div>
                      )}
                      
                      <div className={`flex flex-col gap-4 md:gap-6 ${msg.role === 'user' ? 'max-w-[90%] md:max-w-[85%]' : 'flex-1 min-w-0'}`}>
                        {msg.type === 'code' ? (
                          <div className="bg-surface-high rounded-xl border border-outline/30 overflow-hidden shadow-sm">
                            <div className="bg-primary/5 px-4 py-2.5 border-b border-outline/20 flex justify-between items-center">
                              <span className="text-[10px] text-secondary font-bold uppercase tracking-[0.2em] truncate mr-2">{msg.codeTitle}</span>
                              <Copy className="w-3 h-3 text-secondary cursor-pointer hover:text-primary transition-colors flex-shrink-0" />
                            </div>
                            <pre className="p-4 md:p-6 text-xs text-secondary leading-relaxed overflow-x-auto font-mono">
                              <code>{msg.content}</code>
                            </pre>
                          </div>
                        ) : (
                          <div className={`${msg.role === 'user' ? 'bg-surface-high px-4 md:px-6 py-3 md:py-4 rounded-2xl border border-outline/20 shadow-sm' : 'space-y-4'}`}>
                            <p className={`text-primary leading-relaxed font-light ${msg.role === 'user' ? 'text-sm' : 'text-sm md:text-base whitespace-pre-wrap'}`}>
                              {msg.content}
                            </p>
                          </div>
                        )}

                        {msg.role === 'ai' && (
                          <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button className="text-secondary hover:text-primary transition-colors">
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button className="text-secondary hover:text-primary transition-colors">
                              <ThumbsUp className="w-3.5 h-3.5" />
                            </button>
                            <button className="text-secondary hover:text-primary transition-colors">
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                  
                  {isTyping && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3 md:gap-6"
                    >
                      <div className="h-8 w-8 mt-1 rounded-lg bg-primary/5 border border-outline/20 flex-shrink-0 flex items-center justify-center">
                        <Sparkles className="text-primary w-4 h-4 stroke-[1.5px] animate-pulse" />
                      </div>
                      <div className="flex items-center gap-1.5 px-4 py-3 bg-primary/5 rounded-2xl border border-outline/10">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce [animation-delay:-0.3s]" />
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce [animation-delay:-0.15s]" />
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce" />
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Input Section */}
        <footer className="p-4 md:p-8 pt-0">
          <div className="max-w-3xl mx-auto relative">
            <form onSubmit={handleSendMessage} className="relative group">
              <textarea 
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                className="w-full bg-transparent border border-outline/30 focus:border-primary/40 rounded-2xl px-4 md:px-6 py-3 md:py-4 pr-24 md:pr-32 text-sm text-primary placeholder:text-secondary/40 focus:outline-none focus:ring-0 resize-none transition-all duration-300 min-h-[56px] max-h-48"
                placeholder="Type your message..."
                rows={1}
              />
              <div className="absolute right-2 md:right-3 bottom-2 md:bottom-3 flex items-center gap-1 md:gap-2">
                <button type="button" className="p-1.5 md:p-2 text-secondary hover:text-primary transition-colors">
                  <Paperclip className="w-4 h-4" />
                </button>
                <button type="button" className="p-1.5 md:p-2 text-secondary hover:text-primary transition-colors">
                  <Mic className="w-4 h-4" />
                </button>
                <button 
                  type="submit"
                  disabled={!inputMessage.trim()}
                  className="bg-primary text-surface p-1.5 md:p-2 rounded-lg hover:bg-primary-dim transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:hover:bg-primary"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
              </div>
            </form>
            <div className="mt-3 md:mt-4 flex flex-col sm:flex-row items-center justify-between px-2 gap-2">
              <div className="flex gap-4 md:gap-6">
                <button className="text-[10px] text-secondary font-bold uppercase tracking-[0.2em] hover:text-primary transition-colors">Documentation</button>
                <button className="text-[10px] text-secondary font-bold uppercase tracking-[0.2em] hover:text-primary transition-colors">Community</button>
              </div>
              <span className="text-[10px] text-secondary font-mono tracking-wider opacity-60">2.4k tokens remaining</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
