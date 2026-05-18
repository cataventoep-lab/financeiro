'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import type { AppData, AppSettings, RecurringTemplate } from '@/lib/types';
import { fmtBRL } from '@/lib/data';
import { exportEntriesToCsv, exportReceitasToCsv } from '@/lib/csv';
import { IconUsers, IconBank, IconGrid, IconTrend, IconBell, IconTool, IconAlert, IconChevRight, IconByName } from '../Icons';
import Image from 'next/image';

interface Props {
  data: AppData;
  onUpdateSettings: (s: Partial<AppSettings>) => void;
  onToggleRecurring: (id: string) => void;
  onDeleteRecurring: (id: string) => void;
  onClearData: () => void;
}

const menuLinks = [
  { icon: <IconUsers size={22} />, label: 'Alunos e responsáveis' },
  { icon: <IconBank size={22} />, label: 'Contas e formas de pagamento' },
  { icon: <IconGrid size={22} />, label: 'Categorias' },
  { icon: <IconBell size={22} />, label: 'Notificações' },
  { icon: <IconAlert size={22} />, label: 'Ajuda e suporte' },
];

const listItem = { hidden: { opacity: 0, x: -8 }, show: { opacity: 1, x: 0 } };

function RecurringCard({ t, onToggle, onDelete }: { t: RecurringTemplate; onToggle: () => void; onDelete: () => void }) {
  return (
    <div style={{
      background: 'var(--cv-white)', borderRadius: 'var(--r-lg)', boxShadow: 'var(--shadow-sm)',
      padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10,
      opacity: t.active ? 1 : 0.55,
    }}>
      <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--cv-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--cv-blue)', flexShrink: 0 }}>
        <IconByName name={t.icon} size={20} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--cv-blue)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.desc}</div>
        <div style={{ fontSize: 11, color: 'var(--cv-gray-600)', marginTop: 1 }}>
          {fmtBRL(t.value)} · {t.frequency} · dia {t.dueDay}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button className={`toggle ${t.active ? 'on' : ''}`} onClick={onToggle} aria-pressed={t.active} style={{ transform: 'scale(0.85)' }} />
        <button onClick={onDelete} style={{ background: 'none', border: 0, cursor: 'pointer', color: 'var(--cv-gray-400)', fontSize: 16, padding: '2px 4px', borderRadius: 6 }}>×</button>
      </div>
    </div>
  );
}

export function MaisScreen({ data, onUpdateSettings, onToggleRecurring, onDeleteRecurring, onClearData }: Props) {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const activeRecurring = data.recurringTemplates.filter(t => t.active).length;

  const handleExportDespesas = () => {
    exportEntriesToCsv(data.fisicoEntries, data.digitalEntries);
    toast.success('Despesas exportadas em CSV');
  };

  const handleExportReceitas = () => {
    exportReceitasToCsv(data.receitas);
    toast.success('Receitas exportadas em CSV');
  };

  const handleClear = () => {
    onClearData();
    setShowClearConfirm(false);
    toast('Dados redefinidos para os padrões');
  };

  return (
    <div>
      <header className="app-header">
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, color: 'var(--cv-gray-600)', fontWeight: 500 }}>Configurações e acessos</div>
          <h1>Mais</h1>
        </div>
      </header>

      {/* Profile */}
      <div style={{ padding: '0 20px' }}>
        <motion.div className="card" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 16 }}
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}>
          <div style={{ width: 52, height: 52, background: 'var(--cv-bg)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
            <Image src="/logo-catavento.svg" alt="Catavento" width={44} height={44} style={{ objectFit: 'contain' }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--cv-blue)' }}>Catavento Espaço Pedagógico</div>
            <div style={{ fontSize: 12, color: 'var(--cv-gray-600)', marginTop: 2 }}>Fazenda Rio Grande · PR</div>
          </div>
          <IconChevRight size={18} color="var(--cv-gray-400)" />
        </motion.div>
      </div>

      {/* Display settings */}
      <div style={{ padding: '20px 20px 0' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--cv-gray-600)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Exibição</div>
        <div className="card" style={{ padding: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid var(--cv-gray-100)' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--cv-blue)' }}>Mostrar valores monetários</div>
            <button className={`toggle ${data.settings.showValues ? 'on' : ''}`}
              onClick={() => onUpdateSettings({ showValues: !data.settings.showValues })}
              aria-pressed={data.settings.showValues} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--cv-blue)' }}>Mês atual</div>
              <div style={{ fontSize: 12, color: 'var(--cv-gray-600)', marginTop: 2 }}>{data.settings.currentMonth} · 2026</div>
            </div>
            <span className="chip chip-info">{data.settings.currentMonth}</span>
          </div>
        </div>
      </div>

      {/* Recurring templates */}
      <div style={{ padding: '20px 20px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--cv-gray-600)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Lançamentos recorrentes
          </div>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--cv-gray-400)' }}>
            {activeRecurring}/{data.recurringTemplates.length} ativos
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {data.recurringTemplates.length === 0 ? (
            <div className="card muted" style={{ textAlign: 'center', padding: 20, fontSize: 14, color: 'var(--cv-gray-600)' }}>
              Nenhum recorrente cadastrado ainda.
            </div>
          ) : (
            data.recurringTemplates.map(t => (
              <RecurringCard key={t.id} t={t}
                onToggle={() => onToggleRecurring(t.id)}
                onDelete={() => { onDeleteRecurring(t.id); toast('Recorrente removido'); }} />
            ))
          )}
        </div>
      </div>

      {/* CSV Export */}
      <div style={{ padding: '20px 20px 0' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--cv-gray-600)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
          Exportar dados
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button className="more-link" onClick={handleExportDespesas} style={{ textAlign: 'left' }}>
            <div className="ico"><IconTrend size={20} /></div>
            <div style={{ flex: 1 }}>
              <div className="lbl">Exportar despesas (CSV)</div>
              <div style={{ fontSize: 11, color: 'var(--cv-gray-400)', marginTop: 2 }}>
                {data.fisicoEntries.length + data.digitalEntries.length} lançamentos
              </div>
            </div>
            <div style={{ fontSize: 13, color: 'var(--cv-positive)', fontWeight: 700 }}>↓</div>
          </button>
          <button className="more-link" onClick={handleExportReceitas} style={{ textAlign: 'left' }}>
            <div className="ico"><IconTrend size={20} /></div>
            <div style={{ flex: 1 }}>
              <div className="lbl">Exportar receitas (CSV)</div>
              <div style={{ fontSize: 11, color: 'var(--cv-gray-400)', marginTop: 2 }}>
                {data.receitas.length} lançamentos
              </div>
            </div>
            <div style={{ fontSize: 13, color: 'var(--cv-positive)', fontWeight: 700 }}>↓</div>
          </button>
        </div>
      </div>

      {/* Menu links */}
      <div style={{ padding: '20px 20px 0' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--cv-gray-600)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
          Gestão
        </div>
      </div>
      <motion.div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}
        initial="hidden" animate="show"
        variants={{ show: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } } }}>
        {menuLinks.map((l, i) => (
          <motion.div key={i} className="more-link" variants={listItem} whileTap={{ scale: 0.98 }}>
            <div className="ico">{l.icon}</div>
            <div className="lbl">{l.label}</div>
            <div className="chev"><IconChevRight size={20} /></div>
          </motion.div>
        ))}
      </motion.div>

      {/* Preferences */}
      <div style={{ padding: '20px 20px 0' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--cv-gray-600)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
          Preferências do app
        </div>
        <button className="more-link" onClick={() => { setShowClearConfirm(true); }} style={{ textAlign: 'left', color: 'var(--cv-negative)' }}>
          <div className="ico" style={{ background: 'var(--cv-negative-100)', color: 'var(--cv-negative)' }}><IconTool size={20} /></div>
          <div className="lbl" style={{ color: 'var(--cv-negative)' }}>Redefinir dados de demonstração</div>
        </button>
        {showClearConfirm && (
          <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: 10 }}>
            <div className="card" style={{ background: 'var(--cv-negative-100)', padding: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--cv-negative)', marginBottom: 12 }}>
                Confirma a redefinição? Todos os dados serão substituídos pelos exemplos.
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-ghost sm" onClick={() => setShowClearConfirm(false)}>Cancelar</button>
                <button className="btn btn-danger sm" onClick={handleClear}>Sim, redefinir</button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <div style={{ padding: '24px 20px' }}>
        <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--cv-gray-400)', fontWeight: 500 }}>
          Catavento Finance · v2.0 · dados salvos no navegador
        </div>
      </div>
    </div>
  );
}
