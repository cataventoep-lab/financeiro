'use client';

import React from 'react';
import type { Entry, Receita } from '@/lib/types';
import { fmtBRL } from '@/lib/data';
import { Sheet } from '../ui/Sheet';
import { StatusChip } from '../ui/StatusChip';

type AnyEntry = (Entry & { area: 'fisico' | 'digital' }) | (Receita & { area: 'receita' });

interface Props {
  entry: AnyEntry | null;
  onClose: () => void;
  onMarkPaid: (id: string, area: 'fisico' | 'digital') => void;
  onMarkReceived: (id: string) => void;
  onDelete: (id: string, area: 'fisico' | 'digital' | 'receita') => void;
}

export function EntryDetailSheet({ entry, onClose, onMarkPaid, onMarkReceived, onDelete }: Props) {
  if (!entry) return null;

  const isReceita = entry.area === 'receita';
  const r = isReceita ? (entry as Receita & { area: 'receita' }) : null;
  const e = !isReceita ? (entry as Entry & { area: 'fisico' | 'digital' }) : null;

  const isPago = isReceita ? r!.status === 'Recebido' : e!.status === 'Pago';
  const value = isReceita ? (r!.recv > 0 ? r!.recv : r!.prev) : e!.value;

  const accent = isReceita
    ? (isPago ? 'var(--cv-positive)' : 'var(--cv-blue)')
    : (e!.status === 'Atrasado' ? 'var(--cv-negative)' : isPago ? 'var(--cv-positive)' : 'var(--cv-blue)');

  const areaLabel = isReceita ? 'Receita' : e!.area === 'fisico' ? 'Despesa física' : 'Despesa digital';

  return (
    <Sheet
      title="Detalhes do lançamento"
      onClose={onClose}
      footer={
        <div>
          {!isPago && (
            <div style={{ marginBottom: 10 }}>
              <button
                className="btn btn-primary lg block"
                onClick={() => {
                  if (isReceita) onMarkReceived(entry.id);
                  else onMarkPaid(entry.id, e!.area);
                }}
              >
                {isReceita ? 'Marcar como recebido' : 'Marcar como pago'}
              </button>
            </div>
          )}
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-ghost md block" onClick={onClose}>Editar</button>
            <button
              className="btn btn-danger md block"
              onClick={() => onDelete(entry.id, entry.area)}
            >
              Excluir
            </button>
          </div>
        </div>
      }
    >
      {/* Amount card */}
      <div className="card" style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--cv-gray-600)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {areaLabel}
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--cv-blue)', marginTop: 4, letterSpacing: '-0.01em' }}>
          {entry.desc}
        </div>
        <div style={{ fontSize: 34, fontWeight: 800, color: accent, marginTop: 12, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em', lineHeight: 1 }}>
          {fmtBRL(value)}
        </div>
        <div style={{ marginTop: 12 }}>
          <StatusChip status={isReceita ? r!.status : e!.status} />
        </div>
      </div>

      {/* Detail rows */}
      <div className="detail-grid">
        {!isReceita && e && (
          <>
            <div className="detail-row"><span>Categoria</span><strong>{e.cat}</strong></div>
            <div className="detail-row"><span>Conta</span><strong>{e.account}</strong></div>
            <div className="detail-row"><span>Vencimento</span><strong>{e.due}</strong></div>
            {e.paid && <div className="detail-row"><span>Pago em</span><strong>{e.paid}</strong></div>}
            <div className="detail-row"><span>Tipo</span><strong>{e.kind}</strong></div>
            <div className="detail-row"><span>Recorrente</span><strong>{e.recurrent ? 'Sim · mensal' : 'Não'}</strong></div>
            {e.responsible && <div className="detail-row"><span>Responsável</span><strong>{e.responsible}</strong></div>}
            {e.paymentMethod && <div className="detail-row"><span>Forma de pag.</span><strong>{e.paymentMethod}</strong></div>}
            {e.notes && <div className="detail-row"><span>Observações</span><strong>{e.notes}</strong></div>}
          </>
        )}
        {isReceita && r && (
          <>
            <div className="detail-row"><span>Previsto</span><strong>{fmtBRL(r.prev)}</strong></div>
            <div className="detail-row"><span>Recebido</span><strong>{fmtBRL(r.recv)}</strong></div>
            <div className="detail-row">
              <span>{isPago ? 'Recebido em' : 'Previsto para'}</span>
              <strong>{r.date}</strong>
            </div>
            {r.notes && <div className="detail-row"><span>Observações</span><strong>{r.notes}</strong></div>}
          </>
        )}
      </div>
    </Sheet>
  );
}
