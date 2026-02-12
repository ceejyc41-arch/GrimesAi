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
  SendHorizonal,
  ChevronDown,
  Plus,
  Link2
} from 'lucide-react';
import { getGeminiResponse } from '../lib/gemini';

const characters = ['Rick Grimes', 'Joel Miller', 'Arthur Morgan'];

export default function GrimesAiApp() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Identity and Tone State
  const [identity, setIdentity] = useState('Silver-stocks11');
  const [editingIdentity, setEditingIdentity] = useState(false);
  const [tone, setTone] = useState('Calm');

  const [character, setCharacter] = useState('Arthur Morgan');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  /** CHARACTER SWITCH */
  const switchCharacter = (c) => {
    if (c === character) return;
    setCharacter(c);
    setMessages([]);
    setInput('');
    setSidebarOpen(false);
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
    <div className="relative h-screen w-full overflow-hidden text-neutral-200 font-sans bg-black">

      {/* BACKGROUND with blur */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-60"
        style={{
          backgroundImage:
            'url(https://images.squarespace-cdn.com/content/v1/5a55be47c027d86b5c63674c/1604119659418-KLIHNT4O9B5W931U0H2Q/computer-keyboards-wallpaper-preview.jpg)'
        }}
      />
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-30 md:hidden animate-fade-in"
        />
      )}

      <div className="relative z-30 flex h-full">

        {/* ━━ SIDEBAR ━━ */}
        {/* Mobile: Fixed, 85% width. Desktop: Static, w-96 (Maximized). */}
        <aside
          className={`fixed md:static z-40 h-full
          w-[85%] sm:w-80 md:w-96
          bg-[#0d0d0d] border-r border-[#222]
          flex flex-col
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0`}
        >
          {/* Header */}
          <div className="p-6 md:p-8 border-b border-[#222]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <Brain size={32} className="text-zinc-400 md:w-12 md:h-12" />
                <div className="flex items-center gap-3">
                  <span className="text-2xl md:text-4xl font-semibold text-white tracking-wide">GrimesAi</span>
                  <ChevronDown size={20} className="text-zinc-500 md:w-8 md:h-8" />
                </div>
              </div>
              {/* Close Button on Mobile */}
              <button onClick={() => setSidebarOpen(false)} className="md:hidden text-zinc-400">
                <X size={28} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 space-y-8 md:space-y-16">

            {/* IDENTITY NAME */}
            <div>
              <div className="text-xs md:text-sm font-bold tracking-widest text-zinc-500 uppercase mb-3 md:mb-6">
                Identity Name
              </div>
              <div
                className="flex items-center gap-4 bg-[#1c1c1c] border border-[#2a2a2a] px-4 py-4 md:px-6 md:py-8 rounded-2xl cursor-pointer hover:border-zinc-600 transition shadow-md"
                onClick={() => setEditingIdentity(true)}
              >
                <div className="bg-zinc-800 p-2 md:p-3 rounded-full">
                  <User size={18} className="text-zinc-300 md:w-[28px] md:h-[28px]" />
                </div>
                {editingIdentity ? (
                  <input
                    autoFocus
                    value={identity}
                    onChange={(e) => setIdentity(e.target.value)}
                    onBlur={() => setEditingIdentity(false)}
                    className="bg-transparent outline-none text-lg md:text-2xl w-full text-zinc-200"
                  />
                ) : (
                  <span className="text-lg md:text-2xl text-zinc-200 font-medium truncate">{identity}</span>
                )}
              </div>
            </div>

            {/* COMMUNICATION TONE */}
            <div>
              <div className="text-xs md:text-sm font-bold tracking-widest text-zinc-500 uppercase mb-3 md:mb-6">
                Communication Tone
              </div>
              <div className="grid grid-cols-2 gap-3 md:gap-5">
                {['Calm', 'Protective', 'Observant', 'Introverted'].map(t => (
                  <button
                    key={t}
                    onClick={() => setTone(t)}
                    className={`px-3 py-3 md:px-6 md:py-6 rounded-xl text-sm md:text-xl font-medium transition-all shadow-sm
                      ${tone === t
                        ? 'bg-[#2a2a2a] text-white border border-zinc-600'
                        : 'bg-[#161616] text-zinc-400 border border-[#222] hover:bg-[#202020]'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <hr className="border-[#222]" />

            {/* ACTIONS */}
            <div className="space-y-4 md:space-y-8">
              <button className="flex items-center gap-4 md:gap-6 text-base md:text-2xl text-zinc-300 hover:text-white transition group w-full p-2 md:p-4 hover:bg-white/5 rounded-xl">
                <MessageSquarePlus size={22} className="md:w-[32px] md:h-[32px] group-hover:scale-110 transition-transform" />
                <span>New chat</span>
              </button>
              <button className="flex items-center gap-4 md:gap-6 text-base md:text-2xl text-zinc-300 hover:text-white transition group w-full p-2 md:p-4 hover:bg-white/5 rounded-xl">
                <FilePlus2 size={22} className="md:w-[32px] md:h-[32px] group-hover:scale-110 transition-transform" />
                <span>New project</span>
              </button>
            </div>

            {/* CHARACTERS */}
            <div>
              <div className="text-xs md:text-sm font-bold tracking-widest text-zinc-500 uppercase mb-3 md:mb-6 mt-4">
                Characters
              </div>
              <div className="space-y-2 md:space-y-4">
                {characters.map((c) => (
                  <button
                    key={c}
                    onClick={() => switchCharacter(c)}
                    className={`w-full text-left px-4 py-3 md:px-6 md:py-6 rounded-xl text-base md:text-2xl transition-all
                    ${character === c
                        ? 'bg-[#2a2a2a] text-white shadow-md'
                        : 'text-zinc-400 hover:bg-[#1a1a1a] hover:text-zinc-200'}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* FOOTER */}
          <div className="p-6 md:p-8 border-t border-[#222] space-y-4 md:space-y-6">
            <button className="flex items-center gap-4 md:gap-5 text-base md:text-xl text-zinc-400 hover:text-white transition">
              <ShieldCheck size={20} className="md:w-8 md:h-8" />
              <span>Privacy mode</span>
            </button>
            <button className="flex items-center gap-4 md:gap-5 text-base md:text-xl text-zinc-400 hover:text-white transition">
              <Settings size={20} className="md:w-8 md:h-8" />
              <span>System</span>
            </button>
          </div>
        </aside>


        {/* ━━ MAIN CHAT ━━ */}
        <main className="flex-1 flex flex-col relative h-full">

          {/* Mobile Header Toggle */}
          <div className="md:hidden flex items-center justify-between p-4 bg-black/80 border-b border-zinc-800 z-10 sticky top-0">
            <button onClick={() => setSidebarOpen(true)}>
              <Menu size={28} className="text-white" />
            </button>
            <span className="font-semibold text-lg text-white">{character}</span>
            <div className="w-7" />
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-10 py-6 md:py-12 space-y-6 md:space-y-10 custom-scrollbar">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full opacity-30 select-none pointer-events-none">
                <Brain size={60} className="mb-4 md:mb-6 text-white md:w-24 md:h-24" />
                <p className="text-xl md:text-3xl font-light tracking-widest text-center px-4">START A CONVERSATION</p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
                {/* Name Label */}
                <span className="text-xs md:text-base text-zinc-400 mb-2 md:mb-3 px-2 font-medium">
                  {m.sender === 'user' ? 'User' : character}
                </span>

                {/* Bubble */}
                <div
                  className={`max-w-[90%] md:max-w-[75%] px-5 py-4 md:px-10 md:py-6 rounded-2xl md:rounded-3xl text-base md:text-2xl leading-relaxed shadow-lg break-words
                  ${m.sender === 'user'
                      ? 'bg-[#1a1a1a]/90 text-zinc-200 border border-white/5 rounded-br-sm'
                      : 'bg-[#0f0f0f]/95 text-zinc-100 border border-white/10 rounded-bl-sm shadow-black/50'}`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Floating Input Area */}
          <div className="px-4 sm:px-6 md:px-10 pb-6 md:pb-12 pt-4 md:pt-6">
            <div className="max-w-5xl mx-auto bg-[#0a0a0a]/90 backdrop-blur-md rounded-[24px] md:rounded-[40px] border border-[#222] shadow-2xl p-4 md:p-6 flex flex-col gap-3 md:gap-5">

              {/* Input Field */}
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Write a conversation..."
                className="w-full bg-transparent outline-none text-zinc-200 placeholder:text-zinc-500 resize-none h-14 md:h-20 py-2 px-2 md:px-4 text-lg md:text-2xl"
              />

              {/* Toolbar */}
              <div className="flex items-center justify-between px-1 md:px-3">
                <div className="flex items-center gap-5 md:gap-8 text-zinc-500">
                  <button className="hover:text-white transition transform hover:scale-110"><Link2 size={24} className="md:w-8 md:h-8 rotate-45" /></button>
                  <button className="hover:text-white transition transform hover:scale-110"><Mic size={24} className="md:w-8 md:h-8" /></button>
                </div>

                {/* Send Button */}
                {input.trim() && (
                  <button
                    onClick={sendMessage}
                    className="bg-white text-black p-2 md:p-3 rounded-full hover:scale-110 transition shadow-xl animate-fade-in"
                  >
                    <SendHorizonal size={20} className="md:w-7 md:h-7" />
                  </button>
                )}
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
