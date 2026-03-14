'use client';

import { useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

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
  const svgRef = useRef<SVGSVGElement>(null);
  const progressRef = useRef({ value: animate ? 0 : 1 });
  const [progress, setProgress] = useState(animate ? 0 : 1);

  const padding = 40;
  const totalSize = size + padding * 2;
  const cx = totalSize / 2;
  const cy = totalSize / 2;
  const radius = size * 0.36;
  const labelRadius = size * 0.46;
  const n = attributes.length;

  const getPoint = useCallback((index: number, value: number, max: number, r: number) => {
    const angle = (Math.PI * 2 * index) / n - Math.PI / 2;
    const ratio = value / max;
    const x = cx + r * ratio * Math.cos(angle);
    const y = cy + r * ratio * Math.sin(angle);
    return { x, y };
  }, [cx, cy, n]);

  const ringPoints = useCallback((fraction: number) => {
    return attributes
      .map((_, i) => {
        const p = getPoint(i, fraction, 1, radius);
        return `${p.x},${p.y}`;
      })
      .join(' ');
  }, [attributes, getPoint, radius]);

  useGSAP(() => {
    if (!animate) return;

    gsap.to(progressRef.current, {
      value: 1,
      duration: 1.4,
      delay: 0.2,
      ease: 'power2.out',
      onUpdate: () => {
        setProgress(progressRef.current.value);
      },
    });
  }, { scope: svgRef });

  const dataPoints = attributes
    .map((attr, i) => {
      const val = attr.value * progress;
      const p = getPoint(i, val, attr.max, radius);
      return `${p.x},${p.y}`;
    })
    .join(' ');

  return (
    <svg
      ref={svgRef}
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

      <polygon
        points={dataPoints}
        fill="url(#radarFill)"
        stroke="#8b5cf6"
        strokeWidth="2"
        filter="url(#radarGlow)"
        opacity={progress}
      />

      {attributes.map((attr, i) => {
        const val = attr.value * progress;
        const p = getPoint(i, val, attr.max, radius);
        return (
          <circle
            key={`dot-${i}`}
            cx={p.x}
            cy={p.y}
            r="3"
            fill={attr.color}
            stroke="#0a0b1a"
            strokeWidth="1"
            opacity={progress}
          />
        );
      })}

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
