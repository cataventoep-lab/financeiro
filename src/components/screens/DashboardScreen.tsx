'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { AppData, Tab } from '@/lib/types';
import { fmtBRL, fmtAbs, sumBy } from '@/lib/data';
import { StatusChip } from '../ui/StatusChip';
import { Donut } from '../ui/Donut';
import { MonthNav } from '../ui/MonthNav';
import { IconBell, IconArrowDown, IconCheck, IconClock, IconAlert, IconChevRight, IconByName } from '../Icons';

interface Props {
  data: AppData;
  currentMonth: string;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onAdd: (area?: 'fisico' | 'digital' | 'receita') => void;
  onOpenEntry: (e: unknown) => void;
  onNavigate: (tab: Tab) => void;
}

const listItem = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } };
const statBg: Record<string, { bg: string; fg: string }> = {
  up:      { bg: 'var(--cv-positive-100)', fg: 'var(--cv-positive)' },
  down:    { bg: 'var(--cv-negative-100)', fg: 'var(--cv-negative)' },
  warn:    { bg: 'var(--cv-pending-100)', fg: '#8B6F12' },
  default: { bg: 'var(--cv-bg)', fg: 'var(--cv-blue)' },
};

export function DashboardScreen({ data, currentMonth, onPrevMonth, onNextMonth, onOpenEntry, onNavigate }: Props) {
  const { fisicoEntries, digitalEntries, receitas } = data;

  const totalRecebido  = sumBy(receitas, 'recv');
  const totalPrevisto  = sumBy(receitas, 'prev');
  const aReceber       = totalPrevisto - totalRecebido;
  const gastosFisicos  = sumBy(fisicoEntries, 'value');
  const gastosDigitais = sumBy(digitalEntries, 'value');
  const allEntries     = [...fisicoEntries, ...digitalEntries];
  const valorPago      = sumBy(allEntries, 'value', x => x.status === 'Pago');
  const valorPendente  = sumBy(allEntries, 'value', x => x.status === 'Pendente');
  const valorAtrasado  = sumBy(allEntries, 'value', x => x.status === 'Atrasado');
  const saldoPrevisto  = totalPrevisto - (gastosFisicos + gastosDigitais);

  const proximos = allEntries
    .filter(x => x.status === 'Pendente' || x.status === 'Atrasado')
    .sort((a, b) => a.due.localeCompare(b.due))
    .slice(0, 4);

  const recurrCount = allEntries.filter(e => e.recurrent).length;

  return (
    <div>
      <header className="app-header">
        <div className="avatar">F</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, color: 'var(--cv-gray-600)', fontWeight: 500 }}>Olá, Fernanda</div>
          <h1>Catavento Finance</h1>
        </div>
        <button className="icon-btn" aria-label="Notificações"><IconBell size={20} /></button>
      </header>

      {/* Month nav + recurring badge */}
      <div style={{ padding: '0 20px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <MonthNav currentMonth={currentMonth} onPrev={onPrevMonth} onNext={onNextMonth} />
        {recurrCount > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'var(--cv-yellow-100)', padding: '5px 11px', borderRadius: 999, fontSize: 11, fontWeight: 700, color: '#8B6F12' }}>
            <span>↺</span><span>{recurrCount} recorrentes</span>
          </div>
        )}
      </div>

      {/* Hero card */}
      <div style={{ padding: '0 20px' }}>
        <motion.div className="hero-card"
          initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
          <svg style={{ position: 'absolute', right: -40, bottom: -40, opacity: 0.08, pointerEvents: 'none' }}
            width="240" height="240" viewBox="0 0 120 120" fill="none">
            <g transform="translate(60 60)">
              <path d="M0 0 L0 -52 Q14 -52 24 -42 Q34 -32 36 -16 Q22 -10 12 -4 Q4 -2 0 0 Z" fill="#E9BE2B"/>
              <path d="M0 0 L52 0 Q52 14 42 24 Q32 34 16 36 Q10 22 4 12 Q2 4 0 0 Z" fill="#F4F1EA"/>
              <path d="M0 0 L0 52 Q-14 52 -24 42 Q-34 32 -36 16 Q-22 10 -12 4 Q-4 2 0 0 Z" fill="#E9BE2B"/>
              <path d="M0 0 L-52 0 Q-52 -14 -42 -24 Q-32 -34 -16 -36 Q-10 -22 -4 -12 Q-2 -4 0 0 Z" fill="#F4F1EA"/>
            </g>
          </svg>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.7, color: 'var(--cv-bg)' }}>
              Saldo previsto · {currentMonth}
            </div>
            <div className="balance">
              <span className="currency">R$</span>{fmtAbs(saldoPrevisto)}
            </div>
            <div style={{ display: 'flex', gap: 22, marginTop: 18 }}>
              <div>
                <div style={{ fontSize: 11, opacity: 0.7, fontWeight: 500, color: 'var(--cv-bg)' }}>Receitas previstas</div>
                <div style={{ fontSize: 15, fontWeight: 700, marginTop: 2, fontVariantNumeric: 'tabular-nums', color: '#6FD49B' }}>+ {fmtAbs(totalPrevisto)}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, opacity: 0.7, fontWeight: 500, color: 'var(--cv-bg)' }}>Total despesas</div>
                <div style={{ fontSize: 15, fontWeight: 700, marginTop: 2, fontVariantNumeric: 'tabular-nums', color: '#FFA9A6' }}>− {fmtAbs(gastosFisicos + gastosDigitais)}</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Stat grid */}
      <div style={{ padding: '16px 20px 0' }}>
        <motion.div className="stat-grid"
          initial="hidden" animate="show"
          variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } } }}>
          {[
            { label: 'A receber', tone: 'up',      icon: <IconArrowDown size={16}/>, value: fmtBRL(aReceber),     sub: `${receitas.filter(r => r.status === 'Previsto').length} lanç.` },
            { label: 'Pago',      tone: 'default',  icon: <IconCheck size={16}/>,    value: fmtBRL(valorPago),    sub: 'quitado este mês' },
            { label: 'Pendente',  tone: 'warn',     icon: <IconClock size={16}/>,    value: fmtBRL(valorPendente), sub: `${allEntries.filter(x => x.status === 'Pendente').length} lanç.` },
            { label: 'Atrasado',  tone: 'down',     icon: <IconAlert size={16}/>,    value: fmtBRL(valorAtrasado), sub: `${allEntries.filter(x => x.status === 'Atrasado').length} lanç.` },
          ].map(s => (
            <motion.div key={s.label} className="stat" variants={listItem}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div className="stat-label">{s.label}</div>
                <div className="stat-badge" style={{ background: statBg[s.tone].bg, color: statBg[s.tone].fg }}>{s.icon}</div>
              </div>
              <div className={`stat-value ${s.tone !== 'default' ? s.tone : ''}`}>{s.value}</div>
              {s.sub && <div className="stat-sub">{s.sub}</div>}
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Donut */}
      <div className="section-label"><h3>Físico × Digital</h3></div>
      <div style={{ padding: '0 20px' }}>
        <motion.div className="card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
          <div className="donut-wrap">
            <Donut slices={[{ color: '#26325B', value: gastosFisicos }, { color: '#E9BE2B', value: gastosDigitais }]} />
            <div className="donut-legend">
              <div className="lg-item"><div className="lg-swatch" style={{ background: '#26325B' }}/><div className="lg-text">Físico</div><div className="lg-val">{fmtBRL(gastosFisicos)}</div></div>
              <div className="lg-item"><div className="lg-swatch" style={{ background: '#E9BE2B' }}/><div className="lg-text">Digital</div><div className="lg-val">{fmtBRL(gastosDigitais)}</div></div>
              <div style={{ height: 1, background: 'var(--cv-gray-200)', margin: '2px 0' }} />
              <div className="lg-item"><div className="lg-swatch" style={{ background: 'transparent' }}/><div className="lg-text" style={{ color: 'var(--cv-gray-600)' }}>Total</div><div className="lg-val">{fmtBRL(gastosFisicos + gastosDigitais)}</div></div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Upcoming */}
      <div className="section-label">
        <h3>Próximos vencimentos</h3>
        <button className="see-all" onClick={() => onNavigate('fisico')}>Ver tudo →</button>
      </div>
      <motion.div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}
        initial="hidden" animate="show"
        variants={{ show: { transition: { staggerChildren: 0.07, delayChildren: 0.3 } } }}>
        {proximos.length === 0
          ? <div className="card muted" style={{ textAlign: 'center', padding: 24, color: 'var(--cv-gray-600)', fontSize: 14 }}>Nenhum vencimento pendente.</div>
          : proximos.map(e => (
            <motion.div key={e.id} className="list-row" variants={listItem} onClick={() => onOpenEntry({ ...e })} whileTap={{ scale: 0.98 }}>
              <div className="row-icon"><IconByName name={e.icon} size={22} /></div>
              <div className="row-grow">
                <div className="row-top"><div className="row-desc">{e.desc}</div><div className="row-amount">{fmtBRL(e.value)}</div></div>
                <div className="row-bot"><div className="row-meta">Vence {e.due} · {e.cat}</div><StatusChip status={e.status} /></div>
              </div>
              <IconChevRight size={16} color="var(--cv-gray-400)" />
            </motion.div>
          ))}
      </motion.div>

      {/* Receitas preview */}
      <div className="section-label">
        <h3>Receitas · {currentMonth}</h3>
        <button className="see-all" onClick={() => onNavigate('receitas')}>Ver tudo →</button>
      </div>
      <motion.div style={{ padding: '0 20px 0', display: 'flex', flexDirection: 'column', gap: 10 }}
        initial="hidden" animate="show"
        variants={{ show: { transition: { staggerChildren: 0.07, delayChildren: 0.4 } } }}>
        {receitas.slice(0, 3).map(r => (
          <motion.div key={r.id} className="list-row" variants={listItem} onClick={() => onOpenEntry({ ...r, area: 'receita' })} whileTap={{ scale: 0.98 }}>
            <div className="row-icon"><IconByName name={r.icon} size={22} /></div>
            <div className="row-grow">
              <div className="row-top">
                <div className="row-desc">{r.desc}</div>
                <div className={`row-amount ${r.status === 'Recebido' ? 'up' : ''}`}>{fmtBRL(r.recv > 0 ? r.recv : r.prev)}</div>
              </div>
              <div className="row-bot">
                <div className="row-meta">{r.status === 'Recebido' ? `Recebido em ${r.date}` : `Previsto para ${r.date}`}</div>
                <StatusChip status={r.status} />
              </div>
            </div>
            <IconChevRight size={16} color="var(--cv-gray-400)" />
          </motion.div>
        ))}
      </motion.div>
      <div style={{ height: 16 }} />
    </div>
  );
}
