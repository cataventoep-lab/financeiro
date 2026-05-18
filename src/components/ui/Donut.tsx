'use client';

import React from 'react';

interface Slice { color: string; value: number; }

export function Donut({ slices, size = 110, thickness = 18 }: { slices: Slice[]; size?: number; thickness?: number }) {
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const total = slices.reduce((s, x) => s + x.value, 0);
  let acc = 0;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--cv-gray-100)" strokeWidth={thickness} />
      {slices.map((s, i) => {
        const len = total > 0 ? (s.value / total) * c : 0;
        const dash = `${len} ${c - len}`;
        const offset = c / 4 - acc;
        acc += len;
        return (
          <circle
            key={i}
            cx={size / 2} cy={size / 2} r={r}
            fill="none"
            stroke={s.color}
            strokeWidth={thickness}
            strokeDasharray={dash}
            strokeDashoffset={offset}
            strokeLinecap="butt"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        );
      })}
    </svg>
  );
}
