import type { Entry, Receita } from './types';

function escapeCsv(val: string | number | boolean | undefined): string {
  if (val === undefined || val === null) return '';
  const s = String(val);
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function row(cols: (string | number | boolean | undefined)[]) {
  return cols.map(escapeCsv).join(',');
}

export function exportEntriesToCsv(
  fisico: Entry[],
  digital: Entry[],
  filename = 'catavento_despesas.csv'
) {
  const header = ['Área', 'Descrição', 'Categoria', 'Conta', 'Valor (R$)', 'Vencimento', 'Pagamento', 'Status', 'Tipo', 'Recorrente', 'Responsável', 'Observações'];
  const entries = [...fisico.map(e => ({ ...e, areaLabel: 'Físico' })), ...digital.map(e => ({ ...e, areaLabel: 'Digital' }))];

  const rows = entries.map(e => row([
    e.areaLabel,
    e.desc,
    e.cat,
    e.account,
    e.value.toFixed(2).replace('.', ','),
    e.due,
    e.paid ?? '',
    e.status,
    e.kind,
    e.recurrent ? 'Sim' : 'Não',
    e.responsible ?? '',
    e.notes ?? '',
  ]));

  const csv = [row(header), ...rows].join('\n');
  downloadCsv(csv, filename);
}

export function exportReceitasToCsv(receitas: Receita[], filename = 'catavento_receitas.csv') {
  const header = ['Descrição', 'Valor Previsto (R$)', 'Valor Recebido (R$)', 'Status', 'Data', 'Observações'];
  const rows = receitas.map(r => row([
    r.desc,
    r.prev.toFixed(2).replace('.', ','),
    r.recv.toFixed(2).replace('.', ','),
    r.status,
    r.date,
    r.notes ?? '',
  ]));

  const csv = [row(header), ...rows].join('\n');
  downloadCsv(csv, filename);
}

export function exportAllToCsv(fisico: Entry[], digital: Entry[], receitas: Receita[]) {
  exportEntriesToCsv(fisico, digital, 'catavento_despesas.csv');
  setTimeout(() => exportReceitasToCsv(receitas, 'catavento_receitas.csv'), 300);
}

function downloadCsv(content: string, filename: string) {
  const bom = '﻿'; // UTF-8 BOM for Excel compatibility
  const blob = new Blob([bom + content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
