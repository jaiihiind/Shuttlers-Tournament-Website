"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Grainient from '@/components/Grainient';

export default function RegisterPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const unwrappedParams = params instanceof Promise ? React.use(params) : params;

  // Google Form embed URL
  const formEmbedUrl = "https://docs.google.com/forms/d/e/1FAIpQLSdHYOTsWzCb7DGMkbDr44PnWs9BP2rNRHi9Q3EDP_y36cRR9A/viewform?embedded=true";

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-sky-200 via-blue-200 to-indigo-200 text-gray-900 font-sans z-0">
      
      {/* Animated Grainient Background */}
      <div className="absolute inset-0 w-full h-full -z-20 opacity-40 pointer-events-none">
        <Grainient
          color1="#7dd3fc"
          color2="#60a5fa"
          color3="#a5b4fc"
          timeSpeed={0.15}
        />
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white py-5 px-6 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href={`/tournament/${unwrappedParams.id}`} 
              className="inline-flex items-center text-white hover:text-gray-200 transition-colors font-bold text-sm tracking-wide drop-shadow-md"
            >
              <ArrowLeft className="w-5 h-5 mr-1.5" />
              BACK
            </Link>
            <div className="h-6 w-px bg-white/30"></div>
            <h1 className="text-lg md:text-xl font-extrabold tracking-tight">
              🏸 Shuttlers Badminton Tournament — Registration
            </h1>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Form Header */}
          <div className="px-6 py-4 bg-blue-600 text-white">
            <h2 className="text-lg font-bold">📝 Registration Form</h2>
            <p className="text-sm text-blue-100 mt-0.5">Fill in all the details below to register for the tournament.</p>
          </div>

          {/* Embedded Google Form */}
          <div className="w-full" style={{ minHeight: '80vh' }}>
            <iframe
              src={formEmbedUrl}
              width="100%"
              height="100%"
              frameBorder={0}
              marginHeight={0}
              marginWidth={0}
              title="Shuttlers Badminton Tournament Registration"
              className="w-full border-0"
              style={{ minHeight: '80vh' }}
              allowFullScreen
            >
              Loading…
            </iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
