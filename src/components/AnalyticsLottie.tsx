"use client";

import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function AnalyticsLottie() {
  return (
    <div className="w-full h-full relative z-10 scale-90 pointer-events-none flex items-center justify-center">
      <DotLottieReact
        src="/Advanced%20Analytics.lottie"
        loop
        autoplay
        className="w-full h-full"
      />
    </div>
  );
}
