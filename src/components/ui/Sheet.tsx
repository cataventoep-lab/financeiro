'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { IconClose } from '../Icons';

interface SheetProps {
  title: string;
  full?: boolean;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function Sheet({ title, full, onClose, children, footer }: SheetProps) {
  return (
    <motion.div
      className={`sheet ${full ? 'full' : ''}`}
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', stiffness: 400, damping: 40 }}
    >
      {!full && <div className="handle" />}
      <div className="sheet-head">
        <h2>{title}</h2>
        <button className="close-btn" onClick={onClose} aria-label="Fechar">
          <IconClose size={18} />
        </button>
      </div>
      <div className="sheet-body">{children}</div>
      {footer && <div className="sheet-footer">{footer}</div>}
    </motion.div>
  );
}
