'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

const COLORS: Record<string, string> = {
  '.': '',
  'h': '#3b2d80',
  'l': '#5b4db0',
  's': '#e8b878',
  'd': '#d4a060',
  'g': '#22d3ee',
  'w': '#ffffff',
  'e': '#0e7490',
  'm': '#c06050',
  'n': '#d49868',
  'c': '#1a1a3e',
  'k': '#252550',
  'a': '#7c3aed',
  'p': '#1e293b',
  'b': '#312e81',
};

const CHARACTER: string[] = [
  '....llllll....',
  '...llllllll...',
  '..hllllllllh..',
  '..hhhhhhhhhh..',
  '.hhllllllllhh.',
  '.hhsssssssssh.',
  '.hssegssegssh.',
  '.hsggggggggssh',
  '..ssssnnssss..',
  '..dsssmmsss...',
  '...dssssss....',
  '....dssssd....',
  '.....ssss.....',
  '...kccccccck..',
  '..kcaacccaack.',
  '.kccccccccccck',
  '.kcccccccccck.',
  '..kccccccccck.',
  '...kccccccck..',
];

const PIXEL_SIZE = 6;

export default function PixelAvatar() {
  const containerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const maxCols = Math.max(...CHARACTER.map(row => row.length));

  useGSAP(() => {
    if (!containerRef.current || !glowRef.current) return;

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
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(139,92,246,0.15) 0%, transparent 70%)',
          transform: 'scale(1.3)',
          boxShadow: '0 0 20px rgba(139, 92, 246, 0.2), 0 0 40px rgba(139, 92, 246, 0.1)',
        }}
      />

      <svg
        width={maxCols * PIXEL_SIZE}
        height={CHARACTER.length * PIXEL_SIZE}
        viewBox={`0 0 ${maxCols * PIXEL_SIZE} ${CHARACTER.length * PIXEL_SIZE}`}
        className="pixel-glow relative z-10"
        style={{ imageRendering: 'pixelated' }}
      >
        {CHARACTER.map((row, y) =>
          row.split('').map((char, x) => {
            const color = COLORS[char];
            if (!color) return null;
            return (
              <rect
                key={`${x}-${y}`}
                x={x * PIXEL_SIZE}
                y={y * PIXEL_SIZE}
                width={PIXEL_SIZE}
                height={PIXEL_SIZE}
                fill={color}
              />
            );
          })
        )}

        <rect x={4 * PIXEL_SIZE} y={6 * PIXEL_SIZE} width={PIXEL_SIZE} height={1} fill="rgba(255,255,255,0.6)" />
        <rect x={8 * PIXEL_SIZE} y={6 * PIXEL_SIZE} width={PIXEL_SIZE} height={1} fill="rgba(255,255,255,0.6)" />
      </svg>
    </div>
  );
}
