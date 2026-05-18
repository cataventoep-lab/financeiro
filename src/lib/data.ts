import type { Entry, Receita, AppData, RecurringTemplate } from './types';

export const defaultFisicoEntries: Entry[] = [
  { id: 'f1', area: 'fisico', desc: 'Aluguel do espaço', cat: 'Aluguel', icon: 'building', value: 2800.00, due: '05/04', status: 'Pago', paid: '03/04', account: 'Itaú principal', recurrent: true, kind: 'Fixo', responsible: 'Compartilhado' },
  { id: 'f2', area: 'fisico', desc: 'Energia · Copel', cat: 'Luz', icon: 'zap', value: 318.40, due: '18/04', status: 'Pendente', account: 'Itaú principal', recurrent: true, kind: 'Variável', responsible: 'Fernanda' },
  { id: 'f3', area: 'fisico', desc: 'Água · Sanepar', cat: 'Água', icon: 'droplet', value: 112.80, due: '22/04', status: 'Pendente', account: 'Itaú principal', recurrent: true, kind: 'Variável', responsible: 'Luiza' },
  { id: 'f4', area: 'fisico', desc: 'Internet · Vivo Fibra', cat: 'Internet', icon: 'wifi', value: 149.90, due: '10/04', status: 'Pago', paid: '10/04', account: 'PIX Itaú', recurrent: true, kind: 'Fixo', responsible: 'Fernanda' },
  { id: 'f5', area: 'fisico', desc: 'Contabilidade', cat: 'Contabilidade', icon: 'calc', value: 380.00, due: '15/04', status: 'Pendente', account: 'Itaú principal', recurrent: true, kind: 'Fixo', responsible: 'Compartilhado' },
  { id: 'f6', area: 'fisico', desc: 'Salário · Auxiliar', cat: 'Salários', icon: 'users', value: 1450.00, due: '05/04', status: 'Pago', paid: '05/04', account: 'Itaú principal', recurrent: true, kind: 'Fixo', responsible: 'Compartilhado' },
  { id: 'f7', area: 'fisico', desc: 'Material pedagógico', cat: 'Material', icon: 'book', value: 280.50, due: '12/04', status: 'Pago', paid: '12/04', account: 'Cartão Nubank', recurrent: false, kind: 'Variável', responsible: 'Luiza' },
  { id: 'f8', area: 'fisico', desc: 'Simples Nacional · março', cat: 'Impostos', icon: 'receipt', value: 542.00, due: '20/03', status: 'Atrasado', account: 'Itaú principal', recurrent: true, kind: 'Fixo', responsible: 'Fernanda' },
  { id: 'f9', area: 'fisico', desc: 'Presente aluna · Luiza', cat: 'Presentes', icon: 'gift', value: 65.00, due: '20/04', status: 'Pendente', account: 'PIX Itaú', recurrent: false, kind: 'Variável', responsible: 'Luiza' },
];

export const defaultDigitalEntries: Entry[] = [
  { id: 'd1', area: 'digital', desc: 'ChatGPT Plus', cat: 'Inteligência Artificial', icon: 'sparkles', value: 110.00, due: '08/04', status: 'Pago', paid: '08/04', account: 'Cartão Nubank', recurrent: true, kind: 'Fixo', responsible: 'Compartilhado' },
  { id: 'd2', area: 'digital', desc: 'Notion · plano Plus', cat: 'Ferramentas digitais', icon: 'tool', value: 48.00, due: '12/04', status: 'Pago', paid: '12/04', account: 'Cartão Nubank', recurrent: true, kind: 'Fixo', responsible: 'Fernanda' },
  { id: 'd3', area: 'digital', desc: 'Hospedagem Hostinger', cat: 'Hospedagem', icon: 'server', value: 39.90, due: '20/04', status: 'Pendente', account: 'Cartão Nubank', recurrent: true, kind: 'Fixo', responsible: 'Luiza' },
  { id: 'd4', area: 'digital', desc: 'Z-API · WhatsApp', cat: 'WhatsApp / Z-API', icon: 'message', value: 99.00, due: '15/04', status: 'Pendente', account: 'Cartão Nubank', recurrent: true, kind: 'Fixo', responsible: 'Fernanda' },
  { id: 'd5', area: 'digital', desc: 'Mentoria · abril', cat: 'Mentorias', icon: 'cap', value: 297.00, due: '25/04', status: 'Pendente', account: 'PIX Itaú', recurrent: true, kind: 'Fixo', responsible: 'Compartilhado' },
  { id: 'd6', area: 'digital', desc: 'Instagram · anúncios', cat: 'Tráfego pago', icon: 'megaphone', value: 120.00, due: '01/04', status: 'Pago', paid: '01/04', account: 'Cartão Nubank', recurrent: false, kind: 'Variável', responsible: 'Luiza' },
  { id: 'd7', area: 'digital', desc: 'iCloud · 200GB', cat: 'Armazenamento', icon: 'cloud', value: 11.90, due: '03/04', status: 'Pago', paid: '03/04', account: 'Cartão Nubank', recurrent: true, kind: 'Fixo', responsible: 'Fernanda' },
  { id: 'd8', area: 'digital', desc: 'Canva Pro', cat: 'Plataformas digitais', icon: 'grid', value: 34.90, due: '28/03', status: 'Atrasado', account: 'Cartão Nubank', recurrent: true, kind: 'Fixo', responsible: 'Luiza' },
];

export const defaultReceitas: Receita[] = [
  { id: 'r1', desc: 'Aulas Fernanda · Helena', prev: 720.00, recv: 720.00, status: 'Recebido', date: '05/04', icon: 'users' },
  { id: 'r2', desc: 'Aulas Luiza · Helena', prev: 720.00, recv: 720.00, status: 'Recebido', date: '05/04', icon: 'users' },
  { id: 'r3', desc: 'Aulas Fernanda · Davi', prev: 720.00, recv: 0, status: 'Previsto', date: '10/04', icon: 'users' },
  { id: 'r4', desc: 'Aulas Luiza · Sofia', prev: 1080.00, recv: 1080.00, status: 'Recebido', date: '08/04', icon: 'users' },
  { id: 'r5', desc: 'Aulas Fernanda · Pedro', prev: 720.00, recv: 0, status: 'Previsto', date: '15/04', icon: 'users' },
  { id: 'r6', desc: 'Taxa de matrícula · Mateus', prev: 250.00, recv: 250.00, status: 'Recebido', date: '02/04', icon: 'coins' },
  { id: 'r7', desc: 'Aulas Luiza · Heitor', prev: 1080.00, recv: 0, status: 'Previsto', date: '20/04', icon: 'users' },
];

export const defaultRecurringTemplates: RecurringTemplate[] = [
  { id: 'rt1', area: 'fisico', desc: 'Aluguel do espaço', cat: 'Aluguel', icon: 'building', value: 2800.00, account: 'Itaú principal', kind: 'Fixo', responsible: 'Compartilhado', frequency: 'Mensal', dueDay: '5', active: true },
  { id: 'rt2', area: 'fisico', desc: 'Internet · Vivo Fibra', cat: 'Internet', icon: 'wifi', value: 149.90, account: 'PIX Itaú', kind: 'Fixo', responsible: 'Fernanda', frequency: 'Mensal', dueDay: '10', active: true },
  { id: 'rt3', area: 'fisico', desc: 'Contabilidade', cat: 'Contabilidade', icon: 'calc', value: 380.00, account: 'Itaú principal', kind: 'Fixo', responsible: 'Compartilhado', frequency: 'Mensal', dueDay: '15', active: true },
  { id: 'rt4', area: 'fisico', desc: 'Salário · Auxiliar', cat: 'Salários', icon: 'users', value: 1450.00, account: 'Itaú principal', kind: 'Fixo', responsible: 'Compartilhado', frequency: 'Mensal', dueDay: '5', active: true },
  { id: 'rt5', area: 'digital', desc: 'ChatGPT Plus', cat: 'Inteligência Artificial', icon: 'sparkles', value: 110.00, account: 'Cartão Nubank', kind: 'Fixo', responsible: 'Compartilhado', frequency: 'Mensal', dueDay: '8', active: true },
  { id: 'rt6', area: 'digital', desc: 'Notion · plano Plus', cat: 'Ferramentas digitais', icon: 'tool', value: 48.00, account: 'Cartão Nubank', kind: 'Fixo', responsible: 'Fernanda', frequency: 'Mensal', dueDay: '12', active: true },
  { id: 'rt7', area: 'digital', desc: 'iCloud · 200GB', cat: 'Armazenamento', icon: 'cloud', value: 11.90, account: 'Cartão Nubank', kind: 'Fixo', responsible: 'Fernanda', frequency: 'Mensal', dueDay: '3', active: true },
];

export const defaultAppData: AppData = {
  fisicoEntries: defaultFisicoEntries,
  digitalEntries: defaultDigitalEntries,
  receitas: defaultReceitas,
  recurringTemplates: defaultRecurringTemplates,
  settings: {
    userName: 'Fernanda',
    showValues: true,
    currentMonth: 'Abril',
  },
  filterPrefs: {
    month: 'Abril',
    status: 'Todos',
    category: 'Todas',
    account: 'Todas',
    recurrent: 'Todos',
  },
};

export const STORAGE_KEY = 'catavento_finance_v2';

export function fmtBRL(n: number): string {
  return 'R$ ' + Math.abs(n).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function fmtAbs(n: number): string {
  return Math.abs(n).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function sumBy<T>(arr: T[], key: keyof T, predicate: (item: T) => boolean = () => true): number {
  return arr.filter(predicate).reduce((s, x) => s + (x[key] as number), 0);
}

export const fisicoCategories = [
  'Aluguel', 'Água', 'Luz/Energia', 'Internet', 'Contabilidade',
  'Salários', 'Impostos', 'Empréstimos', 'Material pedagógico',
  'Compras para o espaço', 'Presentes e datas comemorativas', 'Comissões', 'Outros',
];

export const digitalCategories = [
  'Mentorias', 'Ferramentas digitais', 'WhatsApp / Z-API', 'Inteligência Artificial',
  'Hospedagem', 'Armazenamento', 'Instagram', 'Plataformas digitais',
  'Automações', 'Tráfego pago', 'Domínio', 'Assinaturas digitais', 'Outros',
];

export const accounts = ['Itaú principal', 'PIX Itaú', 'Cartão Nubank', 'Caixinha'];

export const months = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

export const monthsShort = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export function monthIndex(month: string): number {
  return months.indexOf(month);
}
