"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Trophy, Calendar, MapPin, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

interface FeatureCardProps {
  title: string;
  date: string;
  location: string;
  prize: string;
  perks: string[];
  icon: React.ElementType;
  gradient: string;
  cardBg: string;
  darkText?: boolean;
  link: string;
  delay: number;
  comingSoon?: boolean;
  featured?: boolean;
  live?: boolean;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, date, location, prize, perks, icon: Icon, gradient, cardBg, darkText = false, link, delay, comingSoon = false, featured = false, live = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: "easeOut", delay }}
      className="relative flex flex-col justify-start items-start w-full group mx-auto max-w-[340px] md:max-w-[380px]"
    >
      {/* Glow Background */}
      <motion.div 
        className="absolute inset-0 w-full opacity-60 rounded-[40px] pointer-events-none h-[380px] md:h-[420px]"
        style={{ background: gradient, filter: "blur(55px)" }}
        animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.7, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Foreground Card with Rotating Border */}
      <div className="w-full relative self-stretch rounded-[40px] z-10 h-[380px] md:h-[420px] p-[5px] overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl">
        {/* Spinning gradient border */}
        <div
          className="absolute inset-[-50%] z-0 animate-[spin_4s_linear_infinite]"
          style={{
            background: `conic-gradient(from 0deg, transparent 0%, ${gradient.includes('#FF3D77') ? '#FF3D77' : gradient.includes('#7DD3FC') ? '#06B6D4' : '#4361EE'} 25%, transparent 50%, ${gradient.includes('#FF9D3C') ? '#FF9D3C' : gradient.includes('#06B6D4') ? '#7DD3FC' : '#F72585'} 75%, transparent 100%)`,
          }}
        />
        {/* Card content */}
        <Link href={link} className="relative z-10 block w-full h-full rounded-[37px] overflow-hidden group/card" style={{ background: cardBg }}>
          <div className="w-full h-full p-7 flex flex-col justify-between relative">
          {/* Coming Soon Overlay */}
          {comingSoon && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-20 flex flex-col items-center justify-center rounded-[36px]">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex flex-col items-center"
              >
                <span className="text-3xl mb-2">🔒</span>
                <span className="text-xl font-black text-white/70 tracking-widest uppercase">Coming Soon</span>
                <span className="text-sm text-white/50 mt-1">Stay tuned for updates!</span>
              </motion.div>
            </div>
          )}

          {/* Top Row */}
          <div className={`flex justify-between items-start ${darkText ? 'text-gray-800' : 'text-white'}`}>
            <div className="flex items-center gap-3">
              <Icon size={32} strokeWidth={2.5} />
              {live && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 border border-red-200 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  <span className="text-xs font-black text-red-600 tracking-widest uppercase">Live</span>
                </div>
              )}
            </div>
            <motion.div 
              className="opacity-0 group-hover/card:opacity-100 transition-all bg-gray-900 p-2.5 rounded-full shadow-lg text-white"
              whileHover={{ x: 3 }}
            >
              <ArrowRight size={18} />
            </motion.div>
          </div>

          {/* Bottom Content */}
          <div>
            <h3 className={`font-extrabold mb-4 tracking-tight drop-shadow-sm transition-colors text-2xl md:text-[28px] leading-tight ${darkText ? 'text-gray-900 group-hover/card:text-blue-600' : 'text-white group-hover/card:text-blue-300'}`}>
              {title}
            </h3>
            <div className="flex flex-col gap-2.5">
              <div className={`flex items-center text-sm ${darkText ? 'text-gray-700' : 'text-white/80'}`}>
                <Calendar size={14} className="mr-2.5 text-blue-400 shrink-0" />
                <span className="font-semibold">{date}</span>
              </div>
              <div className={`flex items-center text-sm ${darkText ? 'text-gray-700' : 'text-white/80'}`}>
                <MapPin size={14} className="mr-2.5 text-emerald-400 shrink-0" />
                <span className="font-medium text-xs leading-tight">{location}</span>
              </div>
              <div className={`flex items-center text-sm font-bold ${darkText ? 'text-gray-700' : 'text-white/90'}`}>
                <Trophy size={14} className="mr-2.5 text-amber-400 shrink-0" />
                <span>{prize}</span>
              </div>
            </div>
            
            {/* Perks Tags */}
            <div className="flex flex-wrap gap-1.5 mt-4">
              {perks.map((perk, i) => (
                <span key={i} className={`px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap shadow-sm transition-colors ${darkText ? 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100' : 'bg-white/15 text-white/90 border border-white/20 hover:bg-white/25'}`}>
                  {perk}
                </span>
              ))}
            </div>
          </div>
        </div>
        </Link>
      </div>
    </motion.div>
  );
};

export default function FeaturesSection() {
  const features = [
    {
      title: "Shuttlers Badminton Tournament",
      date: "23rd August 2026",
      location: "Chandigarh Badminton Academy, Nabha, Zirakpur",
      prize: "Cash Prizes + Trophies",
      perks: ["🏸 Yonex Mavis 350", "🏆 Medals", "📜 Certificates", "9 Courts"],
      icon: Trophy,
      gradient: "linear-gradient(137deg, #FF3D77 0%, #FFB1CE 45%, #FF9D3C 100%)",
      cardBg: "linear-gradient(145deg, #1a0a2e 0%, #2d1b4e 50%, #1a0a2e 100%)",
      darkText: false,
      link: "/tournament/summer-smash-2026",
      delay: 0.1,
      comingSoon: false,
      featured: true,
      live: true
    },
    {
      title: "City Open Championship",
      date: "Coming Soon",
      location: "TBA",
      prize: "TBA",
      perks: ["Stay Tuned"],
      icon: Trophy,
      gradient: "linear-gradient(137deg, #FFFFFF 0%, #7DD3FC 45%, #06B6D4 100%)",
      cardBg: "linear-gradient(145deg, #0a2a3c 0%, #134e5e 50%, #0a2a3c 100%)",
      darkText: false,
      link: "#",
      delay: 0.2,
      comingSoon: true,
      featured: false
    },
    {
      title: "Winter Elite Series",
      date: "Coming Soon",
      location: "TBA",
      prize: "TBA",
      perks: ["Stay Tuned"],
      icon: Trophy,
      gradient: "linear-gradient(137deg, #4361EE 0%, #E0AEFF 45%, #F72585 100%)",
      cardBg: "linear-gradient(145deg, #1a0a0a 0%, #3d1f2e 50%, #1a0a0a 100%)",
      darkText: false,
      link: "#",
      delay: 0.3,
      comingSoon: true,
      featured: false
    }
  ];

  return (
    <section className="min-h-screen bg-[#0a1128] flex flex-col items-center justify-center p-6 md:p-12 font-sans w-full relative overflow-hidden">
      
      {/* Decorative background elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <motion.div 
        className="flex flex-col md:flex-row justify-between items-center w-full max-w-5xl mb-14 relative"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex-1 z-10 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest">
              🔥 Featured
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Tournaments
          </h2>
          <p className="text-slate-400 text-lg">Discover top competitive play near you</p>
        </div>

        <div className="flex-1 max-w-[200px] md:max-w-[280px] w-full flex items-center justify-center pointer-events-none z-0 mt-6 md:mt-0 opacity-80">
          <DotLottieReact src="/tournamennt%20animation.lottie" loop autoplay className="w-full h-full scale-125" />
        </div>

        <div className="flex-1 flex justify-center md:justify-end z-10 mt-8 md:mt-0">
          <button className="flex items-center gap-1 text-blue-400 font-bold hover:text-blue-300 transition-colors bg-blue-400/10 px-6 py-3 md:px-4 md:py-2 rounded-full border border-blue-400/20 hover:border-blue-400/40">
            View All <ChevronRight size={16} />
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-10 lg:gap-14 w-full max-w-5xl items-stretch">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
    </section>
  );
}
