'use client';

import { useState, useEffect, useCallback } from 'react';
import type { AppData, Entry, Receita, FilterPrefs, AppSettings, RecurringTemplate } from '@/lib/types';
import { defaultAppData, STORAGE_KEY } from '@/lib/data';

export function useAppData() {
  const [data, setData] = useState<AppData>(defaultAppData);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as AppData;
        setData({
          ...defaultAppData,
          ...parsed,
          settings: { ...defaultAppData.settings, ...parsed.settings },
          filterPrefs: { ...defaultAppData.filterPrefs, ...parsed.filterPrefs },
          recurringTemplates: parsed.recurringTemplates ?? defaultAppData.recurringTemplates,
        });
      }
    } catch {
      // ignore corrupt data
    }
    setLoaded(true);
  }, []);

  const save = useCallback((next: AppData) => {
    setData(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore storage errors
    }
  }, []);

  const addEntry = useCallback((entry: Entry) => {
    setData(prev => {
      const next: AppData = {
        ...prev,
        fisicoEntries: entry.area === 'fisico' ? [...prev.fisicoEntries, entry] : prev.fisicoEntries,
        digitalEntries: entry.area === 'digital' ? [...prev.digitalEntries, entry] : prev.digitalEntries,
      };
      save(next);
      return next;
    });
  }, [save]);

  const updateEntry = useCallback((entry: Entry) => {
    setData(prev => {
      const update = (arr: Entry[]) => arr.map(e => e.id === entry.id ? entry : e);
      const next: AppData = {
        ...prev,
        fisicoEntries: entry.area === 'fisico' ? update(prev.fisicoEntries) : prev.fisicoEntries.filter(e => e.id !== entry.id),
        digitalEntries: entry.area === 'digital' ? update(prev.digitalEntries) : prev.digitalEntries.filter(e => e.id !== entry.id),
      };
      save(next);
      return next;
    });
  }, [save]);

  const deleteEntry = useCallback((id: string, area: 'fisico' | 'digital') => {
    setData(prev => {
      const next: AppData = {
        ...prev,
        fisicoEntries: area === 'fisico' ? prev.fisicoEntries.filter(e => e.id !== id) : prev.fisicoEntries,
        digitalEntries: area === 'digital' ? prev.digitalEntries.filter(e => e.id !== id) : prev.digitalEntries,
      };
      save(next);
      return next;
    });
  }, [save]);

  const markEntryPaid = useCallback((id: string, area: 'fisico' | 'digital') => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const paidDate = `${dd}/${mm}`;
    setData(prev => {
      const update = (arr: Entry[]) => arr.map(e =>
        e.id === id ? { ...e, status: 'Pago' as const, paid: paidDate } : e
      );
      const next: AppData = {
        ...prev,
        fisicoEntries: area === 'fisico' ? update(prev.fisicoEntries) : prev.fisicoEntries,
        digitalEntries: area === 'digital' ? update(prev.digitalEntries) : prev.digitalEntries,
      };
      save(next);
      return next;
    });
  }, [save]);

  const addReceita = useCallback((receita: Receita) => {
    setData(prev => {
      const next: AppData = { ...prev, receitas: [...prev.receitas, receita] };
      save(next);
      return next;
    });
  }, [save]);

  const updateReceita = useCallback((receita: Receita) => {
    setData(prev => {
      const next: AppData = { ...prev, receitas: prev.receitas.map(r => r.id === receita.id ? receita : r) };
      save(next);
      return next;
    });
  }, [save]);

  const deleteReceita = useCallback((id: string) => {
    setData(prev => {
      const next: AppData = { ...prev, receitas: prev.receitas.filter(r => r.id !== id) };
      save(next);
      return next;
    });
  }, [save]);

  const markReceitaReceived = useCallback((id: string) => {
    setData(prev => {
      const next: AppData = {
        ...prev,
        receitas: prev.receitas.map(r =>
          r.id === id ? { ...r, status: 'Recebido' as const, recv: r.prev } : r
        ),
      };
      save(next);
      return next;
    });
  }, [save]);

  const updateSettings = useCallback((settings: Partial<AppSettings>) => {
    setData(prev => {
      const next: AppData = { ...prev, settings: { ...prev.settings, ...settings } };
      save(next);
      return next;
    });
  }, [save]);

  const updateFilterPrefs = useCallback((prefs: Partial<FilterPrefs>) => {
    setData(prev => {
      const next: AppData = { ...prev, filterPrefs: { ...prev.filterPrefs, ...prefs } };
      save(next);
      return next;
    });
  }, [save]);

  const addRecurringTemplate = useCallback((template: RecurringTemplate) => {
    setData(prev => {
      const next: AppData = { ...prev, recurringTemplates: [...prev.recurringTemplates, template] };
      save(next);
      return next;
    });
  }, [save]);

  const toggleRecurringTemplate = useCallback((id: string) => {
    setData(prev => {
      const next: AppData = {
        ...prev,
        recurringTemplates: prev.recurringTemplates.map(t => t.id === id ? { ...t, active: !t.active } : t),
      };
      save(next);
      return next;
    });
  }, [save]);

  const deleteRecurringTemplate = useCallback((id: string) => {
    setData(prev => {
      const next: AppData = { ...prev, recurringTemplates: prev.recurringTemplates.filter(t => t.id !== id) };
      save(next);
      return next;
    });
  }, [save]);

  const clearAllData = useCallback(() => {
    save(defaultAppData);
  }, [save]);

  return {
    data,
    loaded,
    addEntry,
    updateEntry,
    deleteEntry,
    markEntryPaid,
    addReceita,
    updateReceita,
    deleteReceita,
    markReceitaReceived,
    updateSettings,
    updateFilterPrefs,
    addRecurringTemplate,
    toggleRecurringTemplate,
    deleteRecurringTemplate,
    clearAllData,
  };
}
