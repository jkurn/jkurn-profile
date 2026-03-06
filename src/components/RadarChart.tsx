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

  const padding = 40;
  const totalSize = size + padding * 2;
  const cx = totalSize / 2;
  const cy = totalSize / 2;
  const radius = size * 0.36;
  const labelRadius = size * 0.46;
  const n = attributes.length;

  const getPoint = (index: number, value: number, max: number, r: number) => {
    const angle = (Math.PI * 2 * index) / n - Math.PI / 2;
    const ratio = value / max;
    const x = cx + r * ratio * Math.cos(angle);
    const y = cy + r * ratio * Math.sin(angle);
    return { x, y };
  };

  const ringPoints = (fraction: number) => {
    return attributes
      .map((_, i) => {
        const p = getPoint(i, fraction, 1, radius);
        return `${p.x},${p.y}`;
      })
      .join(' ');
  };

  const dataPoints = attributes
    .map((attr, i) => {
      const val = mounted ? attr.value : 0;
      const p = getPoint(i, val, attr.max, radius);
      return `${p.x},${p.y}`;
    })
    .join(' ');

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
          <stop offset="0%" stopColor="#00a0a0" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#008080" stopOpacity="0.1" />
        </radialGradient>
      </defs>

      {/* Grid rings at 33%, 66%, 100% */}
      {[0.33, 0.66, 1].map((fraction) => (
        <polygon
          key={fraction}
          points={ringPoints(fraction)}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1"
          opacity={fraction === 1 ? 0.8 : 0.4}
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
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1"
          />
        );
      })}

      {/* Data polygon with glow */}
      <polygon
        points={mounted ? dataPoints : centerPoints}
        fill="url(#radarFill)"
        stroke="#00a0a0"
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
            stroke="#09090b"
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

        let anchor: 'start' | 'middle' | 'end' = 'middle';
        if (Math.cos(angle) < -0.1) anchor = 'end';
        else if (Math.cos(angle) > 0.1) anchor = 'start';

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
              fontSize="11"
              fontFamily="var(--font-inter), system-ui, sans-serif"
              fontWeight="600"
            >
              {attr.abbr}
            </text>
            <text
              x={lx}
              y={ly}
              textAnchor={anchor}
              dy={parseFloat(dy) + 1.2 + 'em'}
              fill="#a1a1aa"
              fontSize="10"
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
