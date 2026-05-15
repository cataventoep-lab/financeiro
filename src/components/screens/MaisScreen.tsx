'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { AppSettings } from '@/lib/types';
import { IconUsers, IconBank, IconGrid, IconTrend, IconBell, IconTool, IconAlert, IconChevRight } from '../Icons';
import Image from 'next/image';

interface Props {
  settings: AppSettings;
  onUpdateSettings: (s: Partial<AppSettings>) => void;
}

const links = [
  { icon: <IconUsers size={22} />, label: 'Alunos e responsáveis' },
  { icon: <IconBank size={22} />, label: 'Contas e formas de pagamento' },
  { icon: <IconGrid size={22} />, label: 'Categorias' },
  { icon: <IconTrend size={22} />, label: 'Relatórios e exportações' },
  { icon: <IconBell size={22} />, label: 'Notificações' },
  { icon: <IconTool size={22} />, label: 'Preferências do app' },
  { icon: <IconAlert size={22} />, label: 'Ajuda e suporte' },
];

const listItem = {
  hidden: { opacity: 0, x: -8 },
  show: { opacity: 1, x: 0 },
};

export function MaisScreen({ settings, onUpdateSettings }: Props) {
  return (
    <div>
      <header className="app-header">
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, color: 'var(--cv-gray-600)', fontWeight: 500 }}>Configurações e acessos</div>
          <h1>Mais</h1>
        </div>
      </header>

      {/* Profile card */}
      <div style={{ padding: '0 20px' }}>
        <motion.div
          className="card"
          style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 16 }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div style={{ width: 52, height: 52, background: 'var(--cv-bg)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
            <Image
              src="/logo-catavento.svg"
              alt="Catavento Espaço Pedagógico"
              width={44}
              height={44}
              style={{ objectFit: 'contain' }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--cv-blue)' }}>Catavento Espaço Pedagógico</div>
            <div style={{ fontSize: 12, color: 'var(--cv-gray-600)', marginTop: 2 }}>Fazenda Rio Grande · PR</div>
          </div>
          <IconChevRight size={18} color="var(--cv-gray-400)" />
        </motion.div>
      </div>

      {/* Settings toggle */}
      <div style={{ padding: '16px 20px 0' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--cv-gray-600)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>
          Exibição
        </div>
        <div className="card" style={{ padding: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--cv-blue)' }}>Mostrar valores monetários</div>
            <button
              className={`toggle ${settings.showValues ? 'on' : ''}`}
              onClick={() => onUpdateSettings({ showValues: !settings.showValues })}
              aria-pressed={settings.showValues}
            />
          </div>
        </div>
      </div>

      {/* Links */}
      <div style={{ padding: '16px 20px 0' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--cv-gray-600)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>
          Gestão
        </div>
      </div>
      <motion.div
        style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } } }}
      >
        {links.map((l, i) => (
          <motion.div key={i} className="more-link" variants={listItem} whileTap={{ scale: 0.98 }}>
            <div className="ico">{l.icon}</div>
            <div className="lbl">{l.label}</div>
            <div className="chev"><IconChevRight size={20} /></div>
          </motion.div>
        ))}
      </motion.div>

      <div style={{ padding: '24px 20px 0' }}>
        <button className="btn btn-ghost md block">Sair</button>
      </div>

      <div style={{ padding: '20px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: 11, color: 'var(--cv-gray-400)', fontWeight: 500 }}>
          Catavento Finance · v1.0
        </div>
      </div>
    </div>
  );
}
