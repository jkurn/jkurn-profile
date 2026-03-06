'use client';

import { useEffect, useState } from 'react';

interface RadarAttribute {
  label: string;
  abbr: string;
  value: number;
  max: number;
  color: string;
}

interface RadarChartProps {
  attributes: RadarAttribute[];
  size?: number;
  animate?: boolean;
}

export default function RadarChart({ attributes, size = 280, animate = true }: RadarChartProps) {
  const [mounted, setMounted] = useState(!animate);

  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => setMounted(true), 100);
      return () => clearTimeout(timer);
    }
  }, [animate]);

  const padding = 40; // Extra space for labels
  const totalSize = size + padding * 2;
  const cx = totalSize / 2;
  const cy = totalSize / 2;
  const radius = size * 0.36;
  const labelRadius = size * 0.46;
  const n = attributes.length;

  // Calculate point position on the radar
  const getPoint = (index: number, value: number, max: number, r: number) => {
    const angle = (Math.PI * 2 * index) / n - Math.PI / 2;
    const ratio = value / max;
    const x = cx + r * ratio * Math.cos(angle);
    const y = cy + r * ratio * Math.sin(angle);
    return { x, y };
  };

  // Generate polygon points for a given ring
  const ringPoints = (fraction: number) => {
    return attributes
      .map((_, i) => {
        const p = getPoint(i, fraction, 1, radius);
        return `${p.x},${p.y}`;
      })
      .join(' ');
  };

  // Data polygon — animated from center to actual values
  const dataPoints = attributes
    .map((attr, i) => {
      const val = mounted ? attr.value : 0;
      const p = getPoint(i, val, attr.max, radius);
      return `${p.x},${p.y}`;
    })
    .join(' ');

  // Center point for animation start
  const centerPoints = attributes
    .map(() => `${cx},${cy}`)
    .join(' ');

  return (
    <svg
      width={totalSize}
      height={totalSize}
      viewBox={`0 0 ${totalSize} ${totalSize}`}
      className="radar-chart"
      style={{ maxWidth: '100%', height: 'auto' }}
    >
      <defs>
        <filter id="radarGlow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <radialGradient id="radarFill" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.1" />
        </radialGradient>
      </defs>

      {/* Grid rings at 33%, 66%, 100% */}
      {[0.33, 0.66, 1].map((fraction) => (
        <polygon
          key={fraction}
          points={ringPoints(fraction)}
          fill="none"
          stroke="#2a3050"
          strokeWidth="1"
          opacity={fraction === 1 ? 0.6 : 0.3}
        />
      ))}

      {/* Axis lines from center to each vertex */}
      {attributes.map((_, i) => {
        const p = getPoint(i, 1, 1, radius);
        return (
          <line
            key={`axis-${i}`}
            x1={cx}
            y1={cy}
            x2={p.x}
            y2={p.y}
            stroke="#2a3050"
            strokeWidth="1"
            opacity="0.4"
          />
        );
      })}

      {/* Data polygon with glow */}
      <polygon
        points={mounted ? dataPoints : centerPoints}
        fill="url(#radarFill)"
        stroke="#8b5cf6"
        strokeWidth="2"
        filter="url(#radarGlow)"
        style={{
          transition: 'all 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      />

      {/* Data points (dots at each vertex) */}
      {attributes.map((attr, i) => {
        const val = mounted ? attr.value : 0;
        const p = getPoint(i, val, attr.max, radius);
        return (
          <circle
            key={`dot-${i}`}
            cx={mounted ? p.x : cx}
            cy={mounted ? p.y : cy}
            r="3"
            fill={attr.color}
            stroke="#0a0b1a"
            strokeWidth="1"
            style={{
              transition: 'all 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        );
      })}

      {/* Axis labels */}
      {attributes.map((attr, i) => {
        const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
        const lx = cx + labelRadius * Math.cos(angle);
        const ly = cy + labelRadius * Math.sin(angle);

        // Determine text anchor based on position
        let anchor: 'start' | 'middle' | 'end' = 'middle';
        if (Math.cos(angle) < -0.1) anchor = 'end';
        else if (Math.cos(angle) > 0.1) anchor = 'start';

        // Adjust vertical position
        let dy = '0.35em';
        if (Math.sin(angle) < -0.5) dy = '0em';
        else if (Math.sin(angle) > 0.5) dy = '0.8em';

        return (
          <g key={`label-${i}`}>
            <text
              x={lx}
              y={ly}
              textAnchor={anchor}
              dy={dy}
              fill={attr.color}
              fontSize="9"
              fontFamily="var(--font-press-start), monospace"
              fontWeight="bold"
            >
              {attr.abbr}
            </text>
            <text
              x={lx}
              y={ly}
              textAnchor={anchor}
              dy={parseFloat(dy) + 1.2 + 'em'}
              fill="#8892a8"
              fontSize="8"
              fontFamily="var(--font-geist-mono), monospace"
            >
              {attr.value}/{attr.max}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
