'use client';

import React from 'react';

type Status = 'Pago' | 'Pendente' | 'Atrasado' | 'Recebido' | 'Previsto';

const kindMap: Record<Status, string> = {
  Pago: 'paid',
  Pendente: 'pending',
  Atrasado: 'late',
  Recebido: 'paid',
  Previsto: 'info',
};

export function StatusChip({ status }: { status: Status }) {
  const kind = kindMap[status] || 'neutral';
  return <span className={`chip dot chip-${kind}`}>{status}</span>;
}
