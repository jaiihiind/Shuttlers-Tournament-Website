"use client";

import React from 'react';

export default function ClientHomeButton() {
  return (
    <button 
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
      className="hover:text-blue-300 transition-colors"
    >
      Home
    </button>
  );
}
