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
  X
} from 'lucide-react';

const characters = ['Rick Grimes', 'Joel Miller', 'Arthur Morgan'];
const tones = ['Calm', 'Protective', 'Observant', 'Introverted'];

export default function GrimesAiApp() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [identity, setIdentity] = useState('Silver-stocks11');
  const [editingIdentity, setEditingIdentity] = useState(false);

  const [character, setCharacter] = useState('Arthur Morgan');
  const [tone, setTone] = useState('Calm');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const bottomRef = useRef(null);

  /** AUTO SCROLL */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const persona = {
    'Arthur Morgan': {
      Calm: 'Yeah… I hear you. Take it slow.',
      Protective: 'You’re safe right now. I got you.',
      Observant: 'There’s more behind those words.',
      Introverted: '…I understand.'
    },
    'Rick Grimes': {
      Calm: 'We’ll figure this out.',
      Protective: 'Stay behind me. I won’t let anything happen.',
      Observant: 'That changes things.',
      Introverted: 'Say what you need to say.'
    },
    'Joel Miller': {
      Calm: 'Alright… I’m listening.',
      Protective: 'You’re not alone in this.',
      Observant: 'I’ve seen this before.',
      Introverted: 'Yeah. I get it.'
    }
  };

  /** STREAMING RESPONSE */
  const streamAIResponse = async (fullText) => {
    setIsTyping(true);
    let current = '';

    setMessages(prev => [...prev, { sender: 'bot', text: '' }]);

    const words = fullText.split(' ');
    for (let i = 0; i < words.length; i++) {
      await new Promise(res => setTimeout(res, 70));
      current += (i === 0 ? '' : ' ') + words[i];

      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { sender: 'bot', text: current };
        return updated;
      });
    }

    setIsTyping(false);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userText = input;
    setInput('');

    setMessages(prev => [...prev, { sender: 'user', text: userText }]);

    const reply = persona[character][tone];
    await streamAIResponse(reply);
  };

  const newChat = () => {
    setMessages([]);
    setInput('');
  };

  const newProject = () => {
    setMessages([]);
    setInput('');
    setCharacter('Arthur Morgan');
    setTone('Calm');
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
                onChange={e => setIdentity(e.target.value)}
                onBlur={() => setEditingIdentity(false)}
                onKeyDown={e => e.key === 'Enter' && setEditingIdentity(false)}
                className="bg-transparent outline-none text-sm w-full"
              />
            ) : (
              <span className="text-sm">{identity}</span>
            )}
          </div>

          {/* TONE */}
          <div className="px-5 text-xs uppercase text-zinc-500 mb-2">
            Communication Tone
          </div>
          <div className="grid grid-cols-2 gap-2 px-5 mb-6">
            {tones.map(t => (
              <button
                key={t}
                onClick={() => setTone(t)}
                className={`py-2 rounded-full text-xs ${
                  tone === t
                    ? 'bg-white text-black'
                    : 'bg-[#1f1f1f] text-zinc-400'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* CHARACTERS */}
          <div className="px-5 text-xs uppercase text-zinc-500 mb-2">
            Characters
          </div>
          <div className="space-y-2 px-5 mb-6">
            {characters.map(c => (
              <button
                key={c}
                onClick={() => setCharacter(c)}
                className={`w-full py-2 rounded-full text-sm ${
                  character === c ? 'bg-[#2a2a2a]' : 'bg-[#1a1a1a]'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* ACTIONS */}
          <div className="px-5 space-y-3">
            <button onClick={newChat} className="flex gap-3 text-zinc-400">
              <MessageSquarePlus size={16} /> New chat
            </button>
            <button onClick={newProject} className="flex gap-3 text-zinc-400">
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
            Talking to <span className="text-zinc-300">{character}</span>
          </div>

          {/* MESSAGES */}
          <div
            className="flex-1 overflow-y-auto px-6 py-6 max-w-5xl w-full mx-auto space-y-4"
            style={{
              scrollbarWidth: 'none', /* Firefox */
              msOverflowStyle: 'none' /* IE 10+ */
            }}
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] px-6 py-4 rounded-3xl text-sm ${
                    m.sender === 'user'
                      ? 'bg-[#111] rounded-tr-none'
                      : 'bg-[#1b1b1b] rounded-tl-none'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="text-xs text-zinc-400 italic">{character} is typing…</div>
            )}

            <div ref={bottomRef} />

            {/* Hide scrollbar for Chrome, Safari, Edge */}
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
          </div>

          {/* INPUT */}
          <div className="px-6 pb-6">
            <div className="flex items-center gap-4 bg-[#161616] rounded-full px-6 py-4 max-w-5xl mx-auto">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Write a conversation..."
                className="flex-1 bg-transparent outline-none text-zinc-300"
              />
              <Paperclip size={18} className="text-zinc-500" />
              <Mic size={18} className="text-zinc-500" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

