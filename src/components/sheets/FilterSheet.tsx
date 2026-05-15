'use client';

import React, { useState } from 'react';
import type { FilterPrefs } from '@/lib/types';
import { months, accounts, fisicoCategories, digitalCategories } from '@/lib/data';
import { Sheet } from '../ui/Sheet';

interface Props {
  open: boolean;
  prefs: FilterPrefs;
  onClose: () => void;
  onSave: (p: Partial<FilterPrefs>) => void;
}

function FilterGroup({ title, options, value, onChange }: {
  title: string; options: string[]; value: string; onChange: (v: string) => void;
}) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--cv-gray-600)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>
        {title}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {options.map(o => (
          <button key={o} className={`filter-chip ${value === o ? 'active' : ''}`} onClick={() => onChange(o)}>
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

export function FilterSheet({ prefs, onClose, onSave }: Props) {
  const [local, setLocal] = useState<FilterPrefs>({ ...prefs });

  const set = (key: keyof FilterPrefs) => (v: string) => setLocal(p => ({ ...p, [key]: v }));

  const handleApply = () => {
    onSave(local);
    onClose();
  };

  const handleClear = () => {
    const cleared: FilterPrefs = { month: 'Abril', status: 'Todos', category: 'Todas', account: 'Todas', recurrent: 'Todos' };
    setLocal(cleared);
    onSave(cleared);
  };

  const catOptions = ['Todas', ...fisicoCategories.slice(0, 5), ...digitalCategories.slice(0, 3)];

  return (
    <Sheet
      title="Filtros"
      onClose={onClose}
      footer={
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost lg" onClick={handleClear}>Limpar</button>
          <button className="btn btn-secondary lg block" onClick={handleApply}>Aplicar filtros</button>
        </div>
      }
    >
      <FilterGroup
        title="Mês"
        options={months.slice(0, 6)}
        value={local.month}
        onChange={set('month')}
      />
      <FilterGroup
        title="Status"
        options={['Todos', 'Pago', 'Pendente', 'Atrasado']}
        value={local.status}
        onChange={set('status')}
      />
      <FilterGroup
        title="Conta"
        options={['Todas', ...accounts]}
        value={local.account}
        onChange={set('account')}
      />
      <FilterGroup
        title="Categoria"
        options={['Todas', 'Aluguel', 'Luz', 'Salários', 'Ferramentas', 'IA', 'Tráfego pago']}
        value={local.category}
        onChange={set('category')}
      />
      <FilterGroup
        title="Recorrente"
        options={['Todos', 'Sim', 'Não']}
        value={local.recurrent}
        onChange={set('recurrent')}
      />
    </Sheet>
  );
}
