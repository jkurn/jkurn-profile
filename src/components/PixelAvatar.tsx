'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Image from 'next/image';

gsap.registerPlugin(useGSAP);

export default function PixelAvatar() {
  const containerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current || !glowRef.current || document.hidden) return;

    // Float animation
    gsap.to(containerRef.current, {
      y: -4,
      duration: 1.5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });

    // Glow pulse
    gsap.to(glowRef.current, {
      boxShadow: '0 0 30px rgba(139, 92, 246, 0.4), 0 0 60px rgba(139, 92, 246, 0.2)',
      duration: 1.5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative">
      <div
        ref={glowRef}
        className="absolute inset-0 rounded-lg"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(139,92,246,0.15) 0%, transparent 70%)',
          transform: 'scale(1.3)',
          boxShadow: '0 0 20px rgba(139, 92, 246, 0.2), 0 0 40px rgba(139, 92, 246, 0.1)',
        }}
      />
      <Image
        src="/avatar.jpg"
        alt="Jonathan Kurniawan"
        width={100}
        height={100}
        className="relative z-10 rounded-lg border-2 border-[#8b5cf6]/30"
        style={{ imageRendering: 'auto' }}
        priority
      />
    </div>
  );
}
