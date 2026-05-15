'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppData } from '@/hooks/useAppData';
import type { Tab, Entry, Receita } from '@/lib/types';
import { DashboardScreen } from './screens/DashboardScreen';
import { EntryListScreen } from './screens/EntryListScreen';
import { ReceitasScreen } from './screens/ReceitasScreen';
import { MaisScreen } from './screens/MaisScreen';
import { AddEntrySheet } from './sheets/AddEntrySheet';
import { FilterSheet } from './sheets/FilterSheet';
import { EntryDetailSheet } from './sheets/EntryDetailSheet';
import {
  IconHome, IconWallet, IconGlobe, IconInbox, IconMore, IconPlus,
} from './Icons';

function StatusBar() {
  return (
    <div className="status-bar">
      <span>9:41</span>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <svg width="18" height="10" viewBox="0 0 18 10" fill="none">
          <circle cx="2" cy="8" r="1.5" fill="#26325B"/>
          <circle cx="6" cy="6" r="1.5" fill="#26325B"/>
          <circle cx="10" cy="4" r="1.5" fill="#26325B"/>
          <circle cx="14" cy="2" r="1.5" fill="#26325B"/>
        </svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
          <path d="M8 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" fill="#26325B"/>
          <path d="M3.2 6.6a7 7 0 0 1 9.6 0" stroke="#26325B" strokeWidth="1.4" strokeLinecap="round"/>
          <path d="M1 4.2a10 10 0 0 1 14 0" stroke="#26325B" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
        <svg width="26" height="12" viewBox="0 0 26 12" fill="none">
          <rect x="0.5" y="0.5" width="22" height="11" rx="2.5" stroke="#26325B" opacity=".5"/>
          <rect x="2" y="2" width="17" height="8" rx="1.5" fill="#26325B"/>
          <rect x="23" y="3.5" width="2" height="5" rx="1" fill="#26325B" opacity=".5"/>
        </svg>
      </div>
    </div>
  );
}

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <IconHome size={22} /> },
  { id: 'fisico',    label: 'Físico',    icon: <IconWallet size={22} /> },
  { id: 'digital',   label: 'Digital',   icon: <IconGlobe size={22} /> },
  { id: 'receitas',  label: 'Receitas',  icon: <IconInbox size={22} /> },
  { id: 'mais',      label: 'Mais',      icon: <IconMore size={22} /> },
];

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export function AppShell() {
  const appData = useAppData();
  const [tab, setTab] = useState<Tab>('dashboard');
  const [addOpen, setAddOpen] = useState(false);
  const [addArea, setAddArea] = useState<'fisico' | 'digital' | 'receita'>('fisico');
  const [filterOpen, setFilterOpen] = useState(false);
  const [detail, setDetail] = useState<(Entry & { area: 'fisico' | 'digital' }) | (Receita & { area: 'receita' }) | null>(null);

  const openAdd = (area?: 'fisico' | 'digital' | 'receita') => {
    setAddArea(area || (tab === 'receitas' ? 'receita' : tab === 'digital' ? 'digital' : 'fisico'));
    setAddOpen(true);
  };

  if (!appData.loaded) {
    return (
      <div className="app-frame" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--cv-gray-400)', fontSize: 14, fontWeight: 500 }}>Carregando...</div>
      </div>
    );
  }

  const sheetOpen = addOpen || filterOpen || !!detail;

  return (
    <div className="app-frame">
      <StatusBar />

      <div className="app-scroll" key={tab}>
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          >
            {tab === 'dashboard' && (
              <DashboardScreen
                data={appData.data}
                onAdd={openAdd}
                onOpenEntry={setDetail as (e: unknown) => void}
                onNavigate={setTab}
              />
            )}
            {tab === 'fisico' && (
              <EntryListScreen
                kind="fisico"
                entries={appData.data.fisicoEntries}
                showValues={appData.data.settings.showValues}
                onToggleValues={() => appData.updateSettings({ showValues: !appData.data.settings.showValues })}
                onFilter={() => setFilterOpen(true)}
                onOpenEntry={setDetail as (e: unknown) => void}
              />
            )}
            {tab === 'digital' && (
              <EntryListScreen
                kind="digital"
                entries={appData.data.digitalEntries}
                showValues={appData.data.settings.showValues}
                onToggleValues={() => appData.updateSettings({ showValues: !appData.data.settings.showValues })}
                onFilter={() => setFilterOpen(true)}
                onOpenEntry={setDetail as (e: unknown) => void}
              />
            )}
            {tab === 'receitas' && (
              <ReceitasScreen
                receitas={appData.data.receitas}
                onFilter={() => setFilterOpen(true)}
                onOpenEntry={setDetail as (e: unknown) => void}
              />
            )}
            {tab === 'mais' && (
              <MaisScreen settings={appData.data.settings} onUpdateSettings={appData.updateSettings} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {tab !== 'mais' && (
        <motion.button
          className="fab"
          onClick={() => openAdd()}
          aria-label="Adicionar lançamento"
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
        >
          <IconPlus size={26} />
        </motion.button>
      )}

      <nav className="bottom-nav">
        {tabs.map(t => (
          <button
            key={t.id}
            className={`tab ${tab === t.id ? 'active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        ))}
      </nav>

      {/* Scrim */}
      <AnimatePresence>
        {sheetOpen && (
          <motion.div
            className="scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => {
              setAddOpen(false);
              setFilterOpen(false);
              setDetail(null);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {addOpen && (
          <AddEntrySheet
            open={addOpen}
            initialArea={addArea}
            onClose={() => setAddOpen(false)}
            onSave={(entry) => {
              if ('prev' in entry) {
                appData.addReceita(entry);
              } else {
                appData.addEntry(entry);
              }
              setAddOpen(false);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {filterOpen && (
          <FilterSheet
            open={filterOpen}
            prefs={appData.data.filterPrefs}
            onClose={() => setFilterOpen(false)}
            onSave={appData.updateFilterPrefs}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {detail && (
          <EntryDetailSheet
            entry={detail}
            onClose={() => setDetail(null)}
            onMarkPaid={(id, area) => {
              appData.markEntryPaid(id, area);
              setDetail(null);
            }}
            onMarkReceived={(id) => {
              appData.markReceitaReceived(id);
              setDetail(null);
            }}
            onDelete={(id, area) => {
              if (area === 'receita') {
                appData.deleteReceita(id);
              } else {
                appData.deleteEntry(id, area);
              }
              setDetail(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
