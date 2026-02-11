import React, { useState, useEffect, useRef } from 'react';
import {
  Brain,
  User,
  MessageSquarePlus,
  FilePlus2,
  ShieldCheck,
  Settings,
  Paperclip,
  Mic,
  Menu,
  X,
  SendHorizonal
} from 'lucide-react';
import { getGeminiResponse } from '../lib/gemini';

const characters = ['Rick Grimes', 'Joel Miller', 'Arthur Morgan'];

export default function GrimesAiApp() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [identity, setIdentity] = useState('Ceejy-Ochoa');
  const [editingIdentity, setEditingIdentity] = useState(false);

  const [character, setCharacter] = useState('Arthur Morgan');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const bottomRef = useRef(null);

  /** AUTO SCROLL */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  /** CLEAR CHAT ON CHARACTER SWITCH */
  const switchCharacter = (c) => {
    if (c === character) return;
    setCharacter(c);
    setMessages([]);
    setInput('');
  };

  /** STREAMING-STYLE RESPONSE (word-by-word reveal) */
  const streamAIResponse = async (fullText) => {
    let current = '';

    setMessages((prev) => [...prev, { sender: 'bot', text: '' }]);

    const words = fullText.split(' ');
    for (let i = 0; i < words.length; i++) {
      await new Promise((res) => setTimeout(res, 40));
      current += (i === 0 ? '' : ' ') + words[i];

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { sender: 'bot', text: current };
        return updated;
      });
    }
  };

  /** SEND MESSAGE TO GEMINI */
  const sendMessage = async () => {
    if (!input.trim() || isSending) return;

    const userText = input;
    setInput('');
    setIsSending(true);
    setIsTyping(true);

    // Add user bubble
    const updatedMessages = [...messages, { sender: 'user', text: userText }];
    setMessages(updatedMessages);

    try {
      const reply = await getGeminiResponse(character, messages, userText);
      setIsTyping(false);
      await streamAIResponse(reply);
    } catch (err) {
      console.error('Gemini API error:', err);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: `⚠️ Something went wrong: ${err.message || 'Could not reach the AI. Check your API key and try again.'}`,
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const newChat = () => {
    setMessages([]);
    setInput('');
  };

  const newProject = () => {
    setMessages([]);
    setInput('');
    setCharacter('Arthur Morgan');
  };

  return (
    <div className="relative h-screen w-full overflow-hidden text-white">

      {/* BACKGROUND */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            'url(https://images.squarespace-cdn.com/content/v1/5a55be47c027d86b5c63674c/1604119659418-KLIHNT4O9B5W931U0H2Q/computer-keyboards-wallpaper-preview.jpg)'
        }}
      />
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-20 md:hidden"
        />
      )}

      <div className="relative z-30 flex h-full">

        {/* SIDEBAR */}
        <aside
          className={`fixed md:static z-30 h-full w-72 bg-[#0e0e0e] border-r border-zinc-800
          transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0`}
        >
          <div className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain size={20} />
              <span className="font-semibold">GrimesAi</span>
            </div>
            <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
              <X />
            </button>
          </div>

          {/* IDENTITY */}
          <div className="px-5 text-xs uppercase text-zinc-500 mb-2">
            Identity Name
          </div>
          <div
            className="mx-5 mb-6 flex items-center gap-3 bg-[#1f1f1f] px-4 py-2 rounded-full cursor-text"
            onClick={() => setEditingIdentity(true)}
          >
            <User size={14} className="text-zinc-400" />
            {editingIdentity ? (
              <input
                autoFocus
                value={identity}
                onChange={(e) => setIdentity(e.target.value)}
                onBlur={() => setEditingIdentity(false)}
                onKeyDown={(e) => e.key === 'Enter' && setEditingIdentity(false)}
                className="bg-transparent outline-none text-sm w-full"
              />
            ) : (
              <span className="text-sm">{identity}</span>
            )}
          </div>

          {/* CHARACTERS */}
          <div className="px-5 text-xs uppercase text-zinc-500 mb-2">
            Characters
          </div>
          <div className="space-y-2 px-5 mb-6">
            {characters.map((c) => (
              <button
                key={c}
                onClick={() => switchCharacter(c)}
                className={`w-full py-2 rounded-full text-sm transition-colors ${character === c
                    ? 'bg-white text-black font-medium'
                    : 'bg-[#1a1a1a] hover:bg-[#2a2a2a]'
                  }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* ACTIONS */}
          <div className="px-5 space-y-3">
            <button onClick={newChat} className="flex gap-3 text-zinc-400 hover:text-white transition-colors">
              <MessageSquarePlus size={16} /> New chat
            </button>
            <button onClick={newProject} className="flex gap-3 text-zinc-400 hover:text-white transition-colors">
              <FilePlus2 size={16} /> New project
            </button>
          </div>

          <div className="flex-1" />

          <div className="p-5 space-y-3 border-t border-zinc-800">
            <button className="flex gap-3 text-zinc-400">
              <ShieldCheck size={16} /> Privacy mode
            </button>
            <button className="flex gap-3 text-zinc-400">
              <Settings size={16} /> System
            </button>
          </div>
        </aside>

        {/* MAIN */}
        <main className="flex-1 flex flex-col">

          <div className="md:hidden flex items-center justify-between p-4 border-b border-zinc-800 bg-black/80">
            <button onClick={() => setSidebarOpen(true)}>
              <Menu />
            </button>
            <span className="text-sm font-semibold">{character}</span>
            <Brain size={18} />
          </div>

          <div className="text-center text-xs text-zinc-400 mt-4">
            Talking to <span className="text-zinc-300 font-medium">{character}</span>
          </div>

          {/* MESSAGES */}
          <div
            className="flex-1 overflow-y-auto px-6 py-6 max-w-5xl w-full mx-auto space-y-4"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            {messages.length === 0 && !isTyping && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center space-y-3 opacity-40">
                  <Brain size={48} className="mx-auto" />
                  <p className="text-sm text-zinc-400">Start a conversation with <strong>{character}</strong></p>
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] px-6 py-4 rounded-3xl text-sm whitespace-pre-line ${m.sender === 'user'
                      ? 'bg-[#111] rounded-tr-none'
                      : 'bg-[#1b1b1b] rounded-tl-none'
                    }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-[#1b1b1b] rounded-3xl rounded-tl-none px-6 py-4">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />

            {/* Hide scrollbar for Chrome, Safari, Edge */}
            <style>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
          </div>

          {/* INPUT */}
          <div className="px-6 pb-6">
            <div className="flex items-center gap-4 bg-[#161616] rounded-full px-6 py-4 max-w-5xl mx-auto border border-zinc-800/50">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder={`Talk to ${character}…`}
                disabled={isSending}
                className="flex-1 bg-transparent outline-none text-zinc-300 placeholder-zinc-500 disabled:opacity-50"
              />
              <Paperclip size={18} className="text-zinc-500" />
              <Mic size={18} className="text-zinc-500" />
              <button
                onClick={sendMessage}
                disabled={isSending || !input.trim()}
                className="text-zinc-400 hover:text-white transition-colors disabled:opacity-30"
              >
                <SendHorizonal size={18} />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
