import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
    const navigate = useNavigate();
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setLoaded(true), 100);
        return () => clearTimeout(t);
    }, []);

    const goToChat = () => navigate('/chat');

    return (
        <div className="relative h-screen w-full overflow-hidden text-neutral-200 font-sans selection:bg-white/20">

            {/* ── BACKGROUND ── */}
            <div
                className="absolute inset-0 bg-cover bg-center scale-105"
                style={{
                    backgroundImage:
                        'url(https://images.squarespace-cdn.com/content/v1/5a55be47c027d86b5c63674c/1604119659418-KLIHNT4O9B5W931U0H2Q/computer-keyboards-wallpaper-preview.jpg)',
                }}
            />
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/60" />

            {/* ── CONTENT ── */}
            <div className="relative z-10 flex flex-col h-full">

                {/* ━━ NAVBAR ━━ */}
                {/* Mobile: Top-left absolute position. Desktop: Centered. */}
                <div className="absolute top-0 left-0 right-0 p-6 md:p-8 flex justify-center items-center">

                    {/* Desktop Nav Links (Hidden on Mobile) */}
                    <div className="hidden md:flex items-center gap-16 text-2xl font-medium tracking-wide text-zinc-300 bg-black/40 px-12 py-5 rounded-full backdrop-blur-md border border-white/5 shadow-2xl">
                        <a href="#" className="hover:text-white hover:scale-105 transition-all duration-200">Home</a>
                        <a href="#" className="hover:text-white hover:scale-105 transition-all duration-200">About</a>
                        <a href="#" className="hover:text-white hover:scale-105 transition-all duration-200">System</a>
                    </div>
                </div>

                {/* ━━ HERO ━━ */}
                <div className="flex-1 flex flex-col items-center justify-center pt-10 md:pt-20 px-6">

                    {/* Main Heading - Responsive Layout */}
                    <div
                        className={`text-center mb-16 md:mb-28 transition-all duration-1000 ease-out transform
              ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                    >
                        <h1 className="text-5xl sm:text-6xl md:text-8xl font-thin tracking-tighter text-white drop-shadow-2xl leading-tight">
                            Welcome to <span className="font-normal block md:inline">GrimesAi</span>
                        </h1>
                    </div>

                    {/* Buttons - Responsive Sizing */}
                    <div
                        className={`flex flex-col gap-6 md:gap-8 w-full max-w-xs md:max-w-md transition-all duration-1000 delay-300 ease-out transform
              ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                    >
                        <button
                            onClick={goToChat}
                            className="group relative w-full py-4 md:py-6 px-6 md:px-10 rounded-xl md:rounded-2xl
                bg-gradient-to-b from-zinc-500 to-zinc-700
                border border-white/10
                text-black font-extrabold text-xl md:text-3xl tracking-wide
                shadow-[0_8px_30px_rgba(0,0,0,0.6)]
                hover:scale-105 active:scale-95 active:translate-y-1
                transition-all duration-300 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent opacity-100 rounded-xl md:rounded-2xl pointer-events-none" />
                            <span className="relative z-10 drop-shadow-sm">Login</span>
                        </button>

                        <button
                            onClick={goToChat}
                            className="group relative w-full py-4 md:py-6 px-6 md:px-10 rounded-xl md:rounded-2xl
                bg-gradient-to-b from-zinc-600 to-zinc-800
                border border-white/10
                text-black font-extrabold text-xl md:text-3xl tracking-wide
                shadow-[0_8px_30px_rgba(0,0,0,0.6)]
                hover:scale-105 active:scale-95 active:translate-y-1
                transition-all duration-300 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-100 rounded-xl md:rounded-2xl pointer-events-none" />
                            <span className="relative z-10 drop-shadow-sm">Sign In</span>
                        </button>
                    </div>
                </div>

                {/* ━━ FOOTER ━━ */}
                <div className="absolute bottom-6 md:bottom-10 right-6 md:right-12">
                    <span className="text-sm md:text-xl font-medium text-zinc-400 tracking-wide drop-shadow-lg">
                        GrimesAi.com
                    </span>
                </div>
            </div>
        </div>
    );
}
