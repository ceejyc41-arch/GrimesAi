import React from 'react';
import { Paperclip, Mic } from 'lucide-react';

const ArthurChat = () => {
  const messages = [
    {
      id: 1,
      sender: "User",
      text: "Arthur, do you ever get tired?",
      type: "user"
    },
    {
      id: 2,
      sender: "Arthur Morgan",
      text: "All the time.\nBut being tired don't mean you stop.\nIt just means you move slower... and smarter.",
      type: "bot"
    }
  ];

  return (
    <div className="relative flex flex-col h-screen w-full bg-[#121212] font-sans text-gray-200 overflow-hidden">
      
      {/* Background Image / Blur Effect */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center opacity-40 blur-sm"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop')" }} 
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 z-10 bg-black/60 backdrop-blur-[2px]" />

      {/* Chat History Area */}
      <div className="relative z-20 flex-1 overflow-y-auto p-6 flex flex-col space-y-8 mt-10 max-w-5xl mx-auto w-full">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex flex-col ${msg.type === 'user' ? 'items-end' : 'items-start'}`}
          >
            {/* Label (User/Arthur Morgan) */}
            <span className="text-[10px] uppercase tracking-widest text-zinc-400 mb-1 px-4">
              {msg.sender}
            </span>

            {/* Bubble */}
            <div 
              className={`max-w-[80%] px-6 py-4 shadow-2xl backdrop-blur-md border border-white/5 
                ${msg.type === 'user' 
                  ? 'bg-zinc-900/90 rounded-[2rem] rounded-tr-none text-right' 
                  : 'bg-[#1a1a1a]/95 rounded-[2rem] rounded-tl-none text-left'
                }`}
            >
              <p className="text-[15px] leading-relaxed whitespace-pre-line font-medium text-gray-100">
                {msg.text}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Input Area */}
      <div className="relative z-20 p-8 w-full max-w-5xl mx-auto">
        <div className="relative bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-6 shadow-2xl">
          
          <input 
            type="text" 
            placeholder="Write a conversation..." 
            className="bg-transparent w-full text-lg outline-none text-zinc-300 placeholder-zinc-500 pb-10 px-2"
          />

          {/* Action Icons */}
          <div className="absolute bottom-6 left-8 flex items-center space-x-4 text-zinc-400">
            <button className="hover:text-white transition-colors">
              <Paperclip size={20} strokeWidth={2.5} />
            </button>
            <button className="hover:text-white transition-colors">
              <Mic size={20} strokeWidth={2.5} />
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ArthurChat;