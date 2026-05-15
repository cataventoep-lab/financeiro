'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { Receita } from '@/lib/types';
import { fmtBRL, fmtAbs, sumBy } from '@/lib/data';
import { StatusChip } from '../ui/StatusChip';
import { IconFilter, IconChevRight, IconByName } from '../Icons';

interface Props {
  receitas: Receita[];
  onFilter: () => void;
  onOpenEntry: (e: unknown) => void;
}

const TABS = ['Todos', 'Recebido', 'Previsto'];

const listItem = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0 },
};

export function ReceitasScreen({ receitas, onFilter, onOpenEntry }: Props) {
  const [tab, setTab] = useState('Todos');

  const totalPrev  = sumBy(receitas, 'prev');
  const recebido   = sumBy(receitas, 'recv');
  const aReceber   = totalPrev - recebido;

  const visible = receitas.filter(r => {
    if (tab === 'Recebido') return r.status === 'Recebido';
    if (tab === 'Previsto') return r.status === 'Previsto';
    return true;
  });

  return (
    <div>
      <header className="app-header">
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, color: 'var(--cv-gray-600)', fontWeight: 500 }}>Abril · 2026</div>
          <h1>Receitas</h1>
        </div>
        <button className="icon-btn" onClick={onFilter} aria-label="Filtros">
          <IconFilter size={20} />
        </button>
      </header>

      {/* Summary card */}
      <div style={{ padding: '0 20px' }}>
        <motion.div
          style={{ background: 'linear-gradient(135deg, #338C5C 0%, #2E8B57 100%)', color: 'white', borderRadius: 'var(--r-2xl)', padding: 22 }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div style={{ fontSize: 11, opacity: 0.8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Recebido em abril
          </div>
          <div style={{ fontSize: 38, fontWeight: 800, marginTop: 8, lineHeight: 1, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}>
            <span style={{ fontSize: 22, opacity: 0.75, marginRight: 4 }}>R$</span>
            {fmtAbs(recebido)}
          </div>
          <div style={{ display: 'flex', gap: 22, marginTop: 18 }}>
            <div>
              <div style={{ fontSize: 11, opacity: 0.75 }}>Previsto</div>
              <div style={{ fontSize: 15, fontWeight: 700, marginTop: 2, fontVariantNumeric: 'tabular-nums' }}>
                R$ {fmtAbs(totalPrev)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, opacity: 0.75 }}>A receber</div>
              <div style={{ fontSize: 15, fontWeight: 700, marginTop: 2, fontVariantNumeric: 'tabular-nums' }}>
                R$ {fmtAbs(aReceber)}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div style={{ marginTop: 16 }}>
        <div className="pill-tabs">
          {TABS.map(t => (
            <button key={t} className={`pt ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>
      </div>

      {/* List */}
      <motion.div
        style={{ padding: '14px 20px 0', display: 'flex', flexDirection: 'column', gap: 10 }}
        initial="hidden"
        animate="show"
        key={tab}
        variants={{ show: { transition: { staggerChildren: 0.06 } } }}
      >
        {visible.length === 0 && (
          <div className="card muted" style={{ textAlign: 'center', padding: 32, color: 'var(--cv-gray-600)', fontSize: 14 }}>
            Nenhum lançamento neste filtro.
          </div>
        )}
        {visible.map(r => (
          <motion.div
            key={r.id}
            className="list-row"
            variants={listItem}
            onClick={() => onOpenEntry({ ...r, area: 'receita' })}
            whileTap={{ scale: 0.98 }}
          >
            <div className="row-icon">
              <IconByName name={r.icon} size={22} />
            </div>
            <div className="row-grow">
              <div className="row-top">
                <div className="row-desc">{r.desc}</div>
                <div className={`row-amount ${r.status === 'Recebido' ? 'up' : ''}`}>
                  {fmtBRL(r.recv > 0 ? r.recv : r.prev)}
                </div>
              </div>
              <div className="row-bot">
                <div className="row-meta">
                  {r.status === 'Recebido' ? `Recebido em ${r.date}` : `Previsto para ${r.date}`}
                </div>
                <StatusChip status={r.status} />
              </div>
            </div>
            <IconChevRight size={16} color="var(--cv-gray-400)" />
          </motion.div>
        ))}
      </motion.div>

      {visible.length > 0 && (
        <div style={{ textAlign: 'center', padding: '16px 20px', color: 'var(--cv-gray-400)', fontSize: 12, fontWeight: 500 }}>
          {visible.length} lançamento{visible.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}
