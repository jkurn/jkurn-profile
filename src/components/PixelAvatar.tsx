'use client';

const COLORS: Record<string, string> = {
  '.': '',
  'h': '#3b2d80', // hair dark purple
  'l': '#5b4db0', // hair highlights
  's': '#e8b878', // skin
  'd': '#d4a060', // skin shadow
  'g': '#22d3ee', // glasses cyan
  'w': '#ffffff', // glasses glint
  'e': '#0e7490', // eyes behind glasses
  'm': '#c06050', // mouth
  'n': '#d49868', // nose shadow
  'c': '#1a1a3e', // coat dark
  'k': '#252550', // coat lighter
  'a': '#7c3aed', // accent purple
  'p': '#1e293b', // pants
  'b': '#312e81', // boots
};

// 16 cols x 22 rows bust portrait
const CHARACTER: string[] = [
  '....llllll....',  // 0  hair top
  '...llllllll...',  // 1  hair
  '..hllllllllh..',  // 2  hair
  '..hhhhhhhhhh..',  // 3  hair bottom
  '.hhllllllllhh.',  // 4  hair sides
  '.hhsssssssssh.',  // 5  forehead
  '.hssegssegssh.',  // 6  glasses + eyes
  '.hsggggggggssh',  // 7  glasses bridge
  '..ssssnnssss..',  // 8  nose
  '..dsssmmsss...',  // 9  mouth
  '...dssssss....',  // 10 chin
  '....dssssd....',  // 11 jaw
  '.....ssss.....',  // 12 neck
  '...kccccccck..',  // 13 collar
  '..kcaacccaack.',  // 14 coat upper
  '.kccccccccccck',  // 15 coat
  '.kcccccccccck.',  // 16 coat
  '..kccccccccck.',  // 17 coat lower
  '...kccccccck..',  // 18 coat bottom
];

const PIXEL_SIZE = 6;

export default function PixelAvatar() {
  const maxCols = Math.max(...CHARACTER.map(row => row.length));

  return (
    <div className="relative animate-float">
      {/* Glow behind character */}
      <div
        className="absolute inset-0 animate-pulse-glow rounded-full"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(139,92,246,0.15) 0%, transparent 70%)',
          transform: 'scale(1.3)',
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

        {/* Glasses glint */}
        <rect x={4 * PIXEL_SIZE} y={6 * PIXEL_SIZE} width={PIXEL_SIZE} height={1} fill="rgba(255,255,255,0.6)" />
        <rect x={8 * PIXEL_SIZE} y={6 * PIXEL_SIZE} width={PIXEL_SIZE} height={1} fill="rgba(255,255,255,0.6)" />
      </svg>
    </div>
  );
}
