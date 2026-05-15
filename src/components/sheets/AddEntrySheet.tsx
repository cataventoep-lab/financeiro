'use client';

import React, { useState } from 'react';
import type { Entry, Receita, EntryArea } from '@/lib/types';
import { fisicoCategories, digitalCategories, accounts } from '@/lib/data';
import { Sheet } from '../ui/Sheet';

interface Props {
  open: boolean;
  initialArea: EntryArea | 'receita';
  onClose: () => void;
  onSave: (entry: Entry | (Receita & { area: 'receita' })) => void;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="field">
      <label>{label}</label>
      {children}
    </div>
  );
}

function genId() {
  return Math.random().toString(36).slice(2, 10);
}

export function AddEntrySheet({ initialArea, onClose, onSave }: Props) {
  const [area, setArea] = useState<EntryArea | 'receita'>(initialArea);
  const [recurrent, setRecurrent] = useState(false);
  const [kind, setKind] = useState<'Fixo' | 'Variável'>('Fixo');
  const [form, setForm] = useState({
    desc: '',
    value: '',
    due: '',
    paid: '',
    status: 'Pendente',
    paymentMethod: 'PIX',
    account: 'Itaú principal',
    category: '',
    responsible: 'Fernanda',
    frequency: 'Mensal',
    dueDay: '',
    notes: '',
    prevVal: '',
    recvVal: '',
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }));

  const categories = area === 'digital' ? digitalCategories : fisicoCategories;

  const handleSave = () => {
    if (!form.desc.trim()) return;

    if (area === 'receita') {
      const r: Receita & { area: 'receita' } = {
        id: genId(),
        area: 'receita',
        desc: form.desc,
        prev: parseFloat(form.prevVal.replace(',', '.')) || 0,
        recv: parseFloat(form.recvVal.replace(',', '.')) || 0,
        status: (form.status === 'Pago' || form.status === 'Recebido') ? 'Recebido' : 'Previsto',
        date: form.due || form.paid,
        icon: 'users',
        notes: form.notes,
      };
      onSave(r);
    } else {
      const e: Entry = {
        id: genId(),
        area: area as EntryArea,
        desc: form.desc,
        value: parseFloat(form.value.replace(',', '.')) || 0,
        due: form.due,
        status: form.status as Entry['status'],
        paid: form.paid || undefined,
        account: form.account,
        cat: form.category || categories[0],
        icon: 'receipt',
        recurrent,
        kind,
        responsible: form.responsible,
        paymentMethod: form.paymentMethod,
        frequency: recurrent ? form.frequency : undefined,
        dueDay: recurrent ? form.dueDay : undefined,
        notes: form.notes,
      };
      onSave(e);
    }
  };

  return (
    <Sheet
      title="Novo lançamento"
      full
      onClose={onClose}
      footer={
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost lg" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary lg block" onClick={handleSave}>Salvar lançamento</button>
        </div>
      }
    >
      {/* Area selector */}
      <Field label="Área">
        <div className="segmented" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
          {(['fisico', 'digital', 'receita'] as const).map(a => (
            <button key={a} className={area === a ? 'active' : ''} onClick={() => setArea(a)}>
              {a === 'fisico' ? 'Físico' : a === 'digital' ? 'Digital' : 'Receita'}
            </button>
          ))}
        </div>
      </Field>

      <Field label="Descrição">
        <input className="cv-input" placeholder="Ex.: Aluguel do espaço" value={form.desc} onChange={set('desc')} />
      </Field>

      {area === 'receita' ? (
        <>
          <div className="field-row">
            <Field label="Valor previsto">
              <div className="input-wrap">
                <span className="prefix">R$</span>
                <input className="cv-input amount" placeholder="0,00" value={form.prevVal} onChange={set('prevVal')} />
              </div>
            </Field>
            <Field label="Valor recebido">
              <div className="input-wrap">
                <span className="prefix">R$</span>
                <input className="cv-input amount" placeholder="0,00" value={form.recvVal} onChange={set('recvVal')} />
              </div>
            </Field>
          </div>
          <div className="field-row">
            <Field label="Data prevista"><input className="cv-input" type="text" placeholder="dd/mm" value={form.due} onChange={set('due')} /></Field>
            <Field label="Data recebido"><input className="cv-input" type="text" placeholder="dd/mm" value={form.paid} onChange={set('paid')} /></Field>
          </div>
          <Field label="Status">
            <select className="cv-select" value={form.status} onChange={set('status')}>
              <option>Recebido</option>
              <option value="Pendente">Previsto</option>
            </select>
          </Field>
        </>
      ) : (
        <>
          <Field label="Valor">
            <div className="input-wrap">
              <span className="prefix">R$</span>
              <input className="cv-input amount" placeholder="0,00" value={form.value} onChange={set('value')} />
            </div>
          </Field>

          <div className="field-row">
            <Field label="Vencimento"><input className="cv-input" type="text" placeholder="dd/mm/aaaa" value={form.due} onChange={set('due')} /></Field>
            <Field label="Pagamento"><input className="cv-input" type="text" placeholder="dd/mm/aaaa" value={form.paid} onChange={set('paid')} /></Field>
          </div>

          <div className="field-row">
            <Field label="Status">
              <select className="cv-select" value={form.status} onChange={set('status')}>
                <option>Pago</option>
                <option>Pendente</option>
                <option>Atrasado</option>
              </select>
            </Field>
            <Field label="Forma de pagamento">
              <select className="cv-select" value={form.paymentMethod} onChange={set('paymentMethod')}>
                <option>PIX</option>
                <option>Boleto</option>
                <option>Débito</option>
                <option>Crédito</option>
                <option>Dinheiro</option>
              </select>
            </Field>
          </div>

          <Field label="Conta">
            <select className="cv-select" value={form.account} onChange={set('account')}>
              {accounts.map(a => <option key={a}>{a}</option>)}
            </select>
          </Field>

          <Field label="Categoria">
            <select className="cv-select" value={form.category || categories[0]} onChange={set('category')}>
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
          </Field>

          <Field label="Tipo">
            <div className="segmented">
              <button className={kind === 'Fixo' ? 'active' : ''} onClick={() => setKind('Fixo')}>Fixo</button>
              <button className={kind === 'Variável' ? 'active' : ''} onClick={() => setKind('Variável')}>Variável</button>
            </div>
          </Field>

          <Field label="Responsável">
            <select className="cv-select" value={form.responsible} onChange={set('responsible')}>
              <option>Fernanda</option>
              <option>Luiza</option>
              <option>Compartilhado</option>
            </select>
          </Field>

          <div style={{ marginBottom: 14 }}>
            <div className="toggle-row">
              <div className="toggle-label">Lançamento recorrente</div>
              <button className={`toggle ${recurrent ? 'on' : ''}`} onClick={() => setRecurrent(r => !r)} aria-pressed={recurrent} />
            </div>
          </div>

          {recurrent && (
            <div className="field-row">
              <Field label="Frequência">
                <select className="cv-select" value={form.frequency} onChange={set('frequency')}>
                  <option>Semanal</option>
                  <option>Quinzenal</option>
                  <option>Mensal</option>
                  <option>Bimestral</option>
                  <option>Trimestral</option>
                  <option>Anual</option>
                </select>
              </Field>
              <Field label="Dia do vencimento">
                <input className="cv-input" placeholder="ex.: 5" value={form.dueDay} onChange={set('dueDay')} />
              </Field>
            </div>
          )}
        </>
      )}

      <Field label="Observações">
        <textarea className="cv-textarea" placeholder="Notas internas (opcional)" value={form.notes} onChange={set('notes')} />
      </Field>
    </Sheet>
  );
}
