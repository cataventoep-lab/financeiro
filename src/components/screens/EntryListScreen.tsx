'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { Entry } from '@/lib/types';
import { fmtBRL, sumBy } from '@/lib/data';
import { StatusChip } from '../ui/StatusChip';
import { MonthNav } from '../ui/MonthNav';
import { IconFilter, IconEye, IconEyeOff, IconSearch, IconClose, IconChevRight, IconByName } from '../Icons';

interface Props {
  kind: 'fisico' | 'digital';
  entries: Entry[];
  currentMonth: string;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  showValues: boolean;
  onToggleValues: () => void;
  onFilter: () => void;
  onOpenEntry: (e: unknown) => void;
}

const TABS = ['Todos', 'Fixos', 'Variáveis', 'Pagos', 'Pendentes', 'Atrasados'];
const filterFns: Record<string, (e: Entry) => boolean> = {
  Todos:     () => true,
  Fixos:     e => e.kind === 'Fixo',
  Variáveis: e => e.kind === 'Variável',
  Pagos:     e => e.status === 'Pago',
  Pendentes: e => e.status === 'Pendente',
  Atrasados: e => e.status === 'Atrasado',
};
const listItem = { hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0 } };

export function EntryListScreen({ kind, entries, currentMonth, onPrevMonth, onNextMonth, showValues, onToggleValues, onFilter, onOpenEntry }: Props) {
  const [tab, setTab] = useState('Todos');
  const [search, setSearch] = useState('');

  const total     = sumBy(entries, 'value');
  const fixos     = sumBy(entries, 'value', e => e.kind === 'Fixo');
  const variaveis = sumBy(entries, 'value', e => e.kind === 'Variável');
  const pagos     = sumBy(entries, 'value', e => e.status === 'Pago');
  const pendentes = sumBy(entries, 'value', e => e.status === 'Pendente');
  const atrasados = sumBy(entries, 'value', e => e.status === 'Atrasado');

  const q = search.trim().toLowerCase();
  const visible = entries.filter(filterFns[tab]).filter(e =>
    !q || e.desc.toLowerCase().includes(q) || e.cat.toLowerCase().includes(q) || e.account.toLowerCase().includes(q)
  );

  const mask = (v: string) => showValues ? v : 'R$ ●●●●';
  const recurrCount = entries.filter(e => e.recurrent).length;

  const summaryBg = kind === 'fisico' ? 'var(--cv-blue)' : 'linear-gradient(135deg, #F1C846, #E9BE2B)';
  const summaryColor = kind === 'fisico' ? 'var(--cv-bg)' : 'var(--cv-blue)';

  return (
    <div>
      <header className="app-header">
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, color: 'var(--cv-gray-600)', fontWeight: 500 }}>
            {currentMonth} · 2026
            {recurrCount > 0 && (
              <span style={{ marginLeft: 8, background: 'var(--cv-yellow-100)', color: '#8B6F12', padding: '2px 7px', borderRadius: 999, fontSize: 11, fontWeight: 700 }}>
                ↺ {recurrCount}
              </span>
            )}
          </div>
          <h1>{kind === 'fisico' ? 'Financeiro físico' : 'Financeiro digital'}</h1>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="icon-btn" onClick={onToggleValues} aria-label="Ocultar valores">
            {showValues ? <IconEye size={20} /> : <IconEyeOff size={20} />}
          </button>
          <button className="icon-btn" onClick={onFilter} aria-label="Filtros">
            <IconFilter size={20} />
          </button>
        </div>
      </header>

      {/* Month nav */}
      <div style={{ padding: '0 20px 14px' }}>
        <MonthNav currentMonth={currentMonth} onPrev={onPrevMonth} onNext={onNextMonth} />
      </div>

      {/* Summary card */}
      <div style={{ padding: '0 20px' }}>
        <motion.div className="card" style={{ background: summaryBg, color: summaryColor, borderRadius: 'var(--r-2xl)' }}
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}>
          <div style={{ fontSize: 11, opacity: 0.75, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Total do mês</div>
          <div style={{ fontSize: 32, fontWeight: 800, marginTop: 6, lineHeight: 1, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}>
            {mask(fmtBRL(total))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 18 }}>
            <div>
              <div style={{ fontSize: 11, opacity: 0.65, fontWeight: 500 }}>Fixos</div>
              <div style={{ fontSize: 15, fontWeight: 700, marginTop: 2, fontVariantNumeric: 'tabular-nums' }}>{mask(fmtBRL(fixos))}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, opacity: 0.65, fontWeight: 500 }}>Variáveis</div>
              <div style={{ fontSize: 15, fontWeight: 700, marginTop: 2, fontVariantNumeric: 'tabular-nums' }}>{mask(fmtBRL(variaveis))}</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Sub-totals */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, padding: '14px 20px 0' }}>
        {[
          { label: 'Pago',     val: pagos,     color: 'var(--cv-positive)' },
          { label: 'Pendente', val: pendentes, color: '#8B6F12' },
          { label: 'Atrasado', val: atrasados, color: 'var(--cv-negative)' },
        ].map(s => (
          <div key={s.label} className="card muted" style={{ padding: '10px 10px' }}>
            <div style={{ fontSize: 9.5, color: s.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.label}</div>
            <div style={{ fontSize: 13, fontWeight: 800, color: s.color, marginTop: 4, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>
              {showValues ? fmtBRL(s.val) : 'R$ ●●'}
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ padding: '14px 20px 0' }}>
        <div className="search-wrap">
          <IconSearch size={18} color="var(--cv-gray-400)" />
          <input
            className="search-input"
            placeholder={`Buscar em ${kind === 'fisico' ? 'físico' : 'digital'}…`}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className="search-clear" aria-label="Limpar" onClick={() => setSearch('')}>
              <IconClose size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Pill tabs */}
      <div style={{ marginTop: 14 }}>
        <div className="pill-tabs">
          {TABS.map(t => (
            <button key={t} className={`pt ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>
      </div>

      {/* List */}
      <motion.div style={{ padding: '14px 20px 0', display: 'flex', flexDirection: 'column', gap: 10 }}
        key={tab + q} initial="hidden" animate="show"
        variants={{ show: { transition: { staggerChildren: 0.05 } } }}>
        {visible.length === 0 && (
          <div className="card muted" style={{ textAlign: 'center', padding: 32, color: 'var(--cv-gray-600)', fontSize: 14 }}>
            {q ? 'Nenhum resultado para a busca.' : 'Nenhum lançamento neste filtro.'}
          </div>
        )}
        {visible.map(e => (
          <motion.div key={e.id} className="list-row" variants={listItem} onClick={() => onOpenEntry({ ...e })} whileTap={{ scale: 0.98 }}>
            <div className="row-icon" style={{ position: 'relative' }}>
              <IconByName name={e.icon} size={22} />
              {e.recurrent && (
                <span style={{ position: 'absolute', top: -3, right: -3, width: 12, height: 12, background: 'var(--cv-yellow)', borderRadius: '50%', fontSize: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--cv-blue)', fontWeight: 800 }}>↺</span>
              )}
            </div>
            <div className="row-grow">
              <div className="row-top">
                <div className="row-desc">{e.desc}</div>
                <div className="row-amount">{mask(fmtBRL(e.value))}</div>
              </div>
              <div className="row-bot">
                <div className="row-meta">{e.status === 'Pago' ? `Pago ${e.paid}` : `Vence ${e.due}`} · {e.cat}</div>
                <StatusChip status={e.status} />
              </div>
            </div>
            <IconChevRight size={16} color="var(--cv-gray-400)" />
          </motion.div>
        ))}
      </motion.div>

      {visible.length > 0 && (
        <div style={{ textAlign: 'center', padding: '14px 20px', color: 'var(--cv-gray-400)', fontSize: 12, fontWeight: 500 }}>
          {visible.length} lançamento{visible.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}
