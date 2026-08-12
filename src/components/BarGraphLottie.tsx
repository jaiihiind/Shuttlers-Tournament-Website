"use client";

import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function BarGraphLottie() {
  return (
    <div className="w-full h-full relative z-10 flex items-center justify-center">
      <DotLottieReact
        src="/bar_graph.json"
        loop
        autoplay
        className="w-full h-full"
      />
    </div>
  );
}
