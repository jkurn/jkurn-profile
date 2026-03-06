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

interface PixelAvatarProps {
  pixelSize?: number;
}

export default function PixelAvatar({ pixelSize = 4 }: PixelAvatarProps) {
  const maxCols = Math.max(...CHARACTER.map(row => row.length));

  return (
    <div className="relative animate-float">
      <svg
        width={maxCols * pixelSize}
        height={CHARACTER.length * pixelSize}
        viewBox={`0 0 ${maxCols * pixelSize} ${CHARACTER.length * pixelSize}`}
        className="relative z-10"
        style={{ imageRendering: 'pixelated' }}
      >
        {CHARACTER.map((row, y) =>
          row.split('').map((char, x) => {
            const color = COLORS[char];
            if (!color) return null;
            return (
              <rect
                key={`${x}-${y}`}
                x={x * pixelSize}
                y={y * pixelSize}
                width={pixelSize}
                height={pixelSize}
                fill={color}
              />
            );
          })
        )}

        {/* Glasses glint */}
        <rect x={4 * pixelSize} y={6 * pixelSize} width={pixelSize} height={1} fill="rgba(255,255,255,0.6)" />
        <rect x={8 * pixelSize} y={6 * pixelSize} width={pixelSize} height={1} fill="rgba(255,255,255,0.6)" />
      </svg>
    </div>
  );
}
