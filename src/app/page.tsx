"use client";

import { useState, useEffect } from "react";
import { Trophy, Users, ChevronRight, ChevronLeft } from "lucide-react";
import { DynaPuff } from "next/font/google";
import Link from "next/link";
import FeaturesSection from "@/components/FeaturesSection";
import AnalyticsLottie from "@/components/AnalyticsLottie";
import BarGraphLottie from "@/components/BarGraphLottie";
import ContactModalButton from "@/components/ContactModalButton";
import AuthNavButton from "@/components/AuthNavButton";

const bubbleFont = DynaPuff({ subsets: ["latin"], weight: ["700"] });

function HomeSponsorCarousel() {
  const slides = [
    { id: 'chief-guest', src: '/sponsors/chief-guest.jpg', title: 'Chief Guest - Sardar Gurdarshan Singh Saini' },
    { id: 'delux-sports', src: '/sponsors/delux-sports.jpg', title: 'Delux Sports - Premier Badminton Hub' },
    { id: 'sani-dhaba', src: '/sponsors/sani-dhaba.jpg', title: 'Sani Dhaba - Official Food Partner' },
    { id: 'prize-pool', src: '/prize-pool.jpg', title: 'Prize Pool Up To ₹70,000' },
    { id: 'banner', src: '/banner.jpg.jpeg', title: 'Shuttlers Tournament 2026' },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  const goToPrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? slides.length - 1 : prevIndex - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  return (
    <div 
      className="relative w-full max-w-3xl mx-auto rounded-3xl overflow-hidden shadow-2xl border border-blue-500/30 group bg-slate-950/80 backdrop-blur-md"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Sliding Track */}
      <div 
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide) => (
          <div key={slide.id} className="w-full shrink-0 relative flex items-center justify-center bg-black/60 h-[180px] sm:h-[220px]">
            <img 
              src={slide.src} 
              alt={slide.title} 
              className="w-full h-full object-contain p-2" 
            />
          </div>
        ))}
      </div>

      {/* Slide Badge */}
      <div className="absolute top-2.5 left-3 bg-black/70 backdrop-blur-md text-blue-300 text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full border border-blue-400/30 tracking-wider uppercase pointer-events-none z-10">
        {slides[currentIndex].title}
      </div>

      {/* Controls */}
      <button
        onClick={goToPrev}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-blue-600 text-white p-2 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-lg border border-white/20 z-10"
        aria-label="Previous Slide"
      >
        <ChevronLeft size={16} />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-blue-600 text-white p-2 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-lg border border-white/20 z-10"
        aria-label="Next Slide"
      >
        <ChevronRight size={16} />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/60 px-3 py-1 rounded-full backdrop-blur-md border border-white/10 z-10">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === currentIndex ? 'w-5 bg-blue-400 shadow-sm' : 'w-1.5 bg-white/40 hover:bg-white'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

const Shuttlecock = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {/* Base/Cork pointing right */}
    <path d="M22 12a2 2 0 1 0-4 0 2 2 0 0 0 4 0z" />
    {/* Feathers to the left */}
    <path d="M18 12L4 5c-1 0-2 2-2 7s1 7 2 7l14-7z" />
    {/* Criss-cross string details */}
    <path d="M10 8l-4 8" />
    <path d="M10 16l-4-8" />
  </svg>
);

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a1128] font-sans text-white">
      {/* Mobile Top Slogan Banner */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-9 bg-white/10 backdrop-blur-md border-b border-white/10 z-50 flex items-center justify-center gap-2 text-[11px] font-black tracking-[0.15em] uppercase">
        <span className="text-teal-400 drop-shadow-[0_0_8px_rgba(45,212,191,0.5)]">PLAY</span>
        <span className="text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]">LEARN</span>
        <span className="text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]">EARN</span>
        <span className="text-rose-400 drop-shadow-[0_0_8px_rgba(251,113,133,0.5)] flex items-center">
          <Shuttlecock className="w-3.5 h-3.5 mr-1 -rotate-12" />
          REPEAT....
        </span>
      </div>

      {/* Hero Section */}
      <section className="relative h-[100dvh] w-full flex flex-col justify-center overflow-hidden px-6 sm:px-12 lg:px-24 bg-[url('/img2.jpg')] bg-cover bg-center bg-no-repeat">

        
        {/* Floating Pill Navbar */}
        <div className="fixed top-14 md:top-5 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl bg-gradient-to-r from-blue-900/40 via-black/40 to-blue-900/40 backdrop-blur-md rounded-full px-2 py-2 flex justify-between items-center z-40 shadow-2xl border border-white/20">
          
          {/* Left Group: Logo + Navigation Links */}
          <div className="flex items-center gap-6">
            {/* Logo */}
            <div className="h-9 w-9 bg-white rounded-full flex items-center justify-center overflow-hidden shrink-0 ml-1">
              <img src="/logo1.jpg" alt="Shuttlers Logo" className="h-full w-full object-cover" />
            </div>

            {/* Links & Socials */}
            <div className="hidden md:flex items-center gap-6 text-white font-semibold text-sm">
              <Link href="/" className="hover:text-blue-300 transition-colors">Home</Link>
              <a href="#" className="hover:text-blue-300 transition-colors">Sponsors</a>
              <ContactModalButton />
              
              {/* Divider and Tagline */}
              <div className="flex items-center ml-2 border-l border-white/20 pl-6">
                <style>{`
                  @keyframes highlight-1 {
                    0%, 100% { opacity: 1; color: #34d399; transform: scale(1); text-shadow: 0 0 10px rgba(0,0,0,0.9); }
                    10%, 30% { opacity: 1; color: #10b981; text-shadow: 0 0 20px rgba(16, 185, 129, 0.8), 0 0 40px rgba(16, 185, 129, 0.5); transform: scale(1.15); }
                  }
                  @keyframes highlight-2 {
                    0%, 100% { opacity: 1; color: #60a5fa; transform: scale(1); text-shadow: 0 0 10px rgba(0,0,0,0.9); }
                    10%, 30% { opacity: 1; color: #3b82f6; text-shadow: 0 0 20px rgba(59, 130, 246, 0.8), 0 0 40px rgba(59, 130, 246, 0.5); transform: scale(1.15); }
                  }
                  @keyframes highlight-3 {
                    0%, 100% { opacity: 1; color: #fbbf24; transform: scale(1); text-shadow: 0 0 10px rgba(0,0,0,0.9); }
                    10%, 30% { opacity: 1; color: #f59e0b; text-shadow: 0 0 20px rgba(245, 158, 11, 0.8), 0 0 40px rgba(245, 158, 11, 0.5); transform: scale(1.15); }
                  }
                  @keyframes highlight-4 {
                    0%, 100% { opacity: 1; color: #fb7185; transform: scale(1); text-shadow: 0 0 10px rgba(0,0,0,0.9); }
                    10%, 30% { opacity: 1; color: #f43f5e; text-shadow: 0 0 20px rgba(244, 63, 94, 0.8), 0 0 40px rgba(244, 63, 94, 0.5); transform: scale(1.15); }
                  }
                  @keyframes jump-across {
                    0%, 100% { opacity: 0; transform: translate(-10px, 5px) rotate(-30deg); }
                    4% { opacity: 1; transform: translate(-5px, -10px) rotate(0deg); color: #ffffff; filter: drop-shadow(0 0 10px rgba(255,255,255,0.9)); }
                    16% { opacity: 1; transform: translate(5px, -10px) rotate(45deg); color: #ffffff; filter: drop-shadow(0 0 10px rgba(255,255,255,0.9)); }
                    20% { opacity: 0; transform: translate(10px, 5px) rotate(70deg); }
                  }
                  .animate-word { display: inline-block; }
                  .word-1 { animation: highlight-1 4s infinite 0s; color: #34d399; }
                  .word-2 { animation: highlight-2 4s infinite 1s; color: #60a5fa; }
                  .word-3 { animation: highlight-3 4s infinite 2s; color: #fbbf24; }
                  .word-4 { animation: highlight-4 4s infinite 3s; color: #fb7185; }
                  .animate-shuttle-1 { animation: jump-across 4s cubic-bezier(0.4, 0, 0.2, 1) infinite 0.6s; opacity: 0; }
                  .animate-shuttle-2 { animation: jump-across 4s cubic-bezier(0.4, 0, 0.2, 1) infinite 1.6s; opacity: 0; }
                  .animate-shuttle-3 { animation: jump-across 4s cubic-bezier(0.4, 0, 0.2, 1) infinite 2.6s; opacity: 0; }
                `}</style>
                <p 
                  className="text-[10.5px] sm:text-xs font-extrabold uppercase tracking-[0.1em] flex items-center gap-1.5"
                  style={{ 
                    textShadow: '0 0 10px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.9)',
                    WebkitTextStroke: '0.5px rgba(255,255,255,0.2)'
                  }}
                >
                  <span className="animate-word word-1">play</span>
                  <Shuttlecock className="w-3 h-3 text-emerald-400/80 animate-shuttle-1 drop-shadow-md" />
                  <span className="animate-word word-2">learn</span>
                  <Shuttlecock className="w-3 h-3 text-blue-400/80 animate-shuttle-2 drop-shadow-md" />
                  <span className="animate-word word-3">earn</span>
                  <Shuttlecock className="w-3 h-3 text-amber-400/80 animate-shuttle-3 drop-shadow-md" />
                  <span className="animate-word word-4">repeat....</span>
                </p>
              </div>
            </div>
          </div>

          {/* Auth Button (Right) */}
          <AuthNavButton />
        </div>




        <div className="relative z-10 w-full flex flex-col items-center text-center">
          <h1 
            className={`text-6xl md:text-8xl lg:text-[7.5rem] font-extrabold tracking-tight mb-4 leading-tight ${bubbleFont.className}`}
            style={{ 
              textShadow: '0 0 15px rgba(0,0,0,0.9), 0 0 40px rgba(0,0,0,0.7), 0 4px 12px rgba(0,0,0,0.8), 0 0 80px rgba(0,0,0,0.4)',
              WebkitTextStroke: '1px rgba(255,255,255,0.15)',
            }}
          >
            Shuttlers <br /> Tournament
          </h1>

          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4">
            <Link href="/tournament/summer-smash-2026" className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-bold py-4 px-8 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95">
              <Trophy size={20} />
              Find a Tournament
            </Link>
            <Link href="/organize" className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 shadow-lg text-white font-bold py-4 px-8 rounded-full transition-transform hover:scale-105 active:scale-95">
              <Users size={20} />
              Organize an Event
            </Link>
          </div>
        </div>
      </section>

      {/* New Animated Features Section */}
      <FeaturesSection />

      {/* Analytics Section */}
      <section className="py-20 px-6 sm:px-12 lg:px-24 bg-[#0a1128] relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-stretch">
          
          {/* Left Column: Analytics Heading & Animation */}
          <div className="flex flex-col items-start w-full">
            <h2 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 mb-8 tracking-tight">
              Analytics
            </h2>

            <div className="w-full max-w-[400px] bg-indigo-900/10 rounded-[2.5rem] p-4 md:p-6 border border-indigo-500/20 shadow-2xl relative overflow-hidden group aspect-square flex flex-col items-center justify-center">
              <div className="absolute inset-0 bg-indigo-500/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
              
              {/* Animation */}
              <div className="relative z-10 w-full h-full">
                <AnalyticsLottie />
              </div>
            </div>
          </div>

          {/* Right Column: Analytics Insights */}
          <div className="w-full h-full bg-blue-900/20 border border-blue-500/30 rounded-[2.5rem] p-4 md:p-6 backdrop-blur-sm shadow-xl flex flex-col items-center overflow-hidden">
            <h3 className="text-lg md:text-xl font-bold text-white mb-3 text-center tracking-wide shrink-0 animate-pulse">
              The Tournament Advantage:<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-[length:200%_auto] animate-[shimmer_3s_linear_infinite]">Accelerated Growth & Performance</span>
            </h3>
            
            <div className="w-full flex-1 relative flex items-center justify-center min-h-0 rounded-[2rem] overflow-hidden">
              <div className="w-full h-full scale-110">
                <BarGraphLottie />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Sponsors Section with Compact Sideways Carousel */}
      <section className="bg-transparent py-14 px-6 sm:px-12 lg:px-24">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs font-extrabold text-blue-400/80 uppercase tracking-[0.2em] mb-6">Trusted By Our Partners & Sponsors</p>
          <HomeSponsorCarousel />
        </div>
      </section>
    </div>
  );
}
