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

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  /** CHARACTER SWITCH (auto-close sidebar on mobile) */
  const switchCharacter = (c) => {
    if (c === character) return;
    setCharacter(c);
    setMessages([]);
    setInput('');
    setSidebarOpen(false); // ✅ mobile UX
  };

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

  const sendMessage = async () => {
    if (!input.trim() || isSending) return;

    const userText = input;
    setInput('');
    setIsSending(true);
    setIsTyping(true);

    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);

    try {
      const reply = await getGeminiResponse(character, messages, userText);
      setIsTyping(false);
      await streamAIResponse(reply);
    } catch (err) {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: '⚠️ Something went wrong.' },
      ]);
    } finally {
      setIsSending(false);
    }
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
          className={`fixed md:static z-30 h-full
          w-[85%] sm:w-72
          bg-[#0e0e0e] border-r border-zinc-800
          transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0`}
        >
          <div className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain size={20} />
              <span className="font-semibold">GrimesAi</span>
            </div>
            <button
              className="md:hidden p-2 rounded-lg active:bg-white/10"
              onClick={() => setSidebarOpen(false)}
            >
              <X />
            </button>
          </div>

          {/* IDENTITY */}
          <div className="px-5 text-xs uppercase text-zinc-500 mb-2">
            Identity Name
          </div>
          <div
            className="mx-5 mb-6 flex items-center gap-3 bg-[#1f1f1f] px-4 py-2 rounded-full"
            onClick={() => setEditingIdentity(true)}
          >
            <User size={14} className="text-zinc-400" />
            {editingIdentity ? (
              <input
                autoFocus
                value={identity}
                onChange={(e) => setIdentity(e.target.value)}
                onBlur={() => setEditingIdentity(false)}
                className="bg-transparent outline-none text-sm w-full"
              />
            ) : (
              <span className="text-sm">{identity}</span>
            )}
          </div>

          {/* CHARACTERS */}
          <div className="space-y-2 px-5 mb-6">
            {characters.map((c) => (
              <button
                key={c}
                onClick={() => switchCharacter(c)}
                className={`w-full py-2 rounded-full text-sm
                ${character === c
                  ? 'bg-white text-black'
                  : 'bg-[#1a1a1a]'}`}
              >
                {c}
              </button>
            ))}
          </div>
        </aside>

        {/* MAIN */}
        <main className="flex-1 flex flex-col">

          {/* MOBILE HEADER */}
          <div className="md:hidden flex items-center justify-between p-4 bg-black/80 border-b border-zinc-800">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg active:bg-white/10"
            >
              <Menu size={22} />
            </button>
            <span className="text-sm font-semibold">{character}</span>
            <Brain size={18} />
          </div>

          {/* MESSAGES */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[90%] sm:max-w-[75%] px-5 py-3 rounded-3xl text-sm
                  ${m.sender === 'user'
                    ? 'bg-[#111] rounded-tr-none'
                    : 'bg-[#1b1b1b] rounded-tl-none'}`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* INPUT */}
          <div className="px-4 sm:px-6 pb-4">
            <div className="flex items-center gap-3 bg-[#161616] rounded-full px-4 py-3 border border-zinc-800">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder={`Talk to ${character}…`}
                className="flex-1 bg-transparent outline-none text-sm"
              />
              <button onClick={sendMessage}>
                <SendHorizonal size={18} />
              </button>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
