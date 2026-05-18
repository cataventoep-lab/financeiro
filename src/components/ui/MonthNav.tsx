'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { months } from '@/lib/data';

interface Props {
  currentMonth: string;
  onPrev: () => void;
  onNext: () => void;
}

export function MonthNav({ currentMonth, onPrev, onNext }: Props) {
  const idx = months.indexOf(currentMonth);
  const canPrev = idx > 0;
  const canNext = idx < 11;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      background: 'var(--cv-white)', borderRadius: 12,
      padding: '6px 14px', boxShadow: 'var(--shadow-sm)',
      alignSelf: 'flex-start',
    }}>
      <button
        onClick={onPrev}
        disabled={!canPrev}
        style={{
          background: 'none', border: 0, cursor: canPrev ? 'pointer' : 'default',
          color: canPrev ? 'var(--cv-blue)' : 'var(--cv-gray-200)',
          padding: '2px 4px', borderRadius: 8, fontSize: 16, lineHeight: 1,
          transition: 'color 140ms',
        }}
        aria-label="Mês anterior"
      >
        ‹
      </button>
      <motion.span
        key={currentMonth}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.12 }}
        style={{ fontSize: 13, fontWeight: 700, color: 'var(--cv-blue)', minWidth: 56, textAlign: 'center' }}
      >
        {currentMonth}
      </motion.span>
      <button
        onClick={onNext}
        disabled={!canNext}
        style={{
          background: 'none', border: 0, cursor: canNext ? 'pointer' : 'default',
          color: canNext ? 'var(--cv-blue)' : 'var(--cv-gray-200)',
          padding: '2px 4px', borderRadius: 8, fontSize: 16, lineHeight: 1,
          transition: 'color 140ms',
        }}
        aria-label="Próximo mês"
      >
        ›
      </button>
    </div>
  );
}
