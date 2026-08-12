import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock } from 'lucide-react';

export default function OrganizeEventPage() {
  return (
    <div className="min-h-screen bg-[#0a1128] text-white flex flex-col font-sans relative overflow-hidden">
      
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[20%] left-[10%] w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-6 py-12">
        <Link href="/" className="absolute top-8 left-6 sm:left-12 inline-flex items-center text-gray-300 hover:text-white transition-colors font-extrabold text-sm tracking-wide bg-white/5 hover:bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/10">
          <ArrowLeft className="w-5 h-5 mr-2" />
          BACK TO HOME
        </Link>
        
        <div className="text-center max-w-2xl mx-auto mt-12 sm:mt-0">
          <div className="w-24 h-24 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-500/20 rotate-12">
            <Clock className="w-12 h-12 text-white -rotate-12" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-gray-400">
            Coming Soon
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-400 mb-10 leading-relaxed font-medium">
            We're building the ultimate toolkit to help you organize, manage, and scale your badminton tournaments with ease.
          </p>
          
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm max-w-md mx-auto">
            <h3 className="text-lg font-bold mb-4 text-gray-200">Get notified when we launch</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-lg shadow-blue-600/20 whitespace-nowrap">
                Notify Me
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
