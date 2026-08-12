"use client";

import { useEffect, useRef, useState } from "react";

export default function FramesPlayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameIndexRef = useRef(0);
  const requestRef = useRef<number>(0);

  const totalFrames = 300;

  useEffect(() => {
    // Preload images
    let loadedCount = 0;
    const loadImages = async () => {
      for (let i = 1; i <= totalFrames; i++) {
        const img = new Image();
        const paddedIndex = i.toString().padStart(6, '0');
        img.src = `/frames/frame_${paddedIndex}.jpg`;
        img.onload = () => {
          loadedCount++;
          if (loadedCount === totalFrames) {
            setImagesLoaded(true);
          }
        };
        imagesRef.current.push(img);
      }
    };
    loadImages();
  }, []);

  useEffect(() => {
    if (!imagesLoaded) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const animate = () => {
      const currentImage = imagesRef.current[frameIndexRef.current];
      if (currentImage) {
        // Draw the image scaled to fit the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Calculate aspect ratio
        const hRatio = canvas.width / currentImage.width;
        const vRatio = canvas.height / currentImage.height;
        const ratio = Math.max(hRatio, vRatio);
        const centerShift_x = (canvas.width - currentImage.width * ratio) / 2;
        const centerShift_y = (canvas.height - currentImage.height * ratio) / 2;

        ctx.drawImage(
          currentImage,
          0, 0, currentImage.width, currentImage.height,
          centerShift_x, centerShift_y, currentImage.width * ratio, currentImage.height * ratio
        );
      }
      
      // Loop frames
      frameIndexRef.current = (frameIndexRef.current + 1) % totalFrames;
      
      // Control frame rate (assuming 30fps)
      setTimeout(() => {
        requestRef.current = requestAnimationFrame(animate);
      }, 1000 / 30);
    };

    // Initialize canvas size
    canvas.width = 1920; // Default resolution for drawing
    canvas.height = 1080;
    
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [imagesLoaded]);

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover"
      />
      {!imagesLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-blue-900/50 backdrop-blur-sm">
          <div className="text-white font-semibold">Loading frames...</div>
        </div>
      )}
    </div>
  );
}
