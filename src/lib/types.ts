export type EntryStatus = 'Pago' | 'Pendente' | 'Atrasado';
export type EntryKind = 'Fixo' | 'Variável';
export type EntryArea = 'fisico' | 'digital';

export interface Entry {
  id: string;
  area: EntryArea;
  desc: string;
  cat: string;
  icon: string;
  value: number;
  due: string;
  status: EntryStatus;
  paid?: string;
  account: string;
  recurrent: boolean;
  kind: EntryKind;
  responsible?: string;
  paymentMethod?: string;
  frequency?: string;
  dueDay?: string;
  notes?: string;
}

export type ReceitaStatus = 'Recebido' | 'Previsto';

export interface Receita {
  id: string;
  desc: string;
  prev: number;
  recv: number;
  status: ReceitaStatus;
  date: string;
  icon: string;
  notes?: string;
}

export type Tab = 'dashboard' | 'fisico' | 'digital' | 'receitas' | 'mais';

export interface RecurringTemplate {
  id: string;
  area: EntryArea;
  desc: string;
  cat: string;
  icon: string;
  value: number;
  account: string;
  kind: EntryKind;
  responsible?: string;
  paymentMethod?: string;
  frequency: string;
  dueDay: string;
  notes?: string;
  active: boolean;
}

export interface FilterPrefs {
  month: string;
  status: string;
  category: string;
  account: string;
  recurrent: string;
}

export interface AppSettings {
  userName: string;
  showValues: boolean;
  currentMonth: string;
}

export interface AppData {
  fisicoEntries: Entry[];
  digitalEntries: Entry[];
  receitas: Receita[];
  settings: AppSettings;
  filterPrefs: FilterPrefs;
  recurringTemplates: RecurringTemplate[];
}
