import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Check } from 'lucide-react';
import type { Lottery, BetType } from '@/types';

interface BetEntryFormProps {
  selectedLottery: Lottery;
  onAddBet: (numbers: string, type: BetType, amount: number) => void;
}

function detectBetType(input: string): { type: BetType | null; valid: boolean; label: string } {
  const trimmed = input.trim();
  if (!trimmed) return { type: null, valid: false, label: '' };

  // Check dash-separated format (Pale, Tripleta)
  if (trimmed.includes('-')) {
    const parts = trimmed.split('-').filter(p => p.length > 0);
    if (parts.length === 2) {
      const valid = parts.every(p => /^\d{2}$/.test(p));
      return { type: 'pale', valid, label: 'Pale' };
    }
    if (parts.length === 3) {
      const valid = parts.every(p => /^\d{2}$/.test(p));
      return { type: 'tripleta', valid, label: 'Tripleta' };
    }
    return { type: null, valid: false, label: '' };
  }

  // Check single number formats
  if (/^\d{2}$/.test(trimmed)) {
    return { type: 'directo', valid: true, label: 'Directo' };
  }
  if (/^\d{3}$/.test(trimmed)) {
    return { type: 'cash3', valid: true, label: 'Cash 3' };
  }
  if (/^\d{4}$/.test(trimmed)) {
    return { type: 'play4', valid: true, label: 'Play 4' };
  }
  if (/^\d{5}$/.test(trimmed)) {
    return { type: 'pick5', valid: true, label: 'Pick 5' };
  }

  return { type: null, valid: false, label: '' };
}

export function BetEntryForm({ selectedLottery, onAddBet }: BetEntryFormProps) {
  const [jugadaInput, setJugadaInput] = useState('');
  const [montoInput, setMontoInput] = useState('');
  const [flashInput, setFlashInput] = useState(false);
  const [error, setError] = useState('');

  const detection = useMemo(() => detectBetType(jugadaInput), [jugadaInput]);

  const montoNum = parseFloat(montoInput);
  const isValid = detection.valid && !isNaN(montoNum) && montoNum >= 5;

  const handleAdd = () => {
    setError('');

    if (!detection.valid || !detection.type) {
      setError('Formato de jugada inválido');
      return;
    }

    if (isNaN(montoNum) || montoNum < 5) {
      setError('El monto mínimo es RD$ 5.00');
      return;
    }

    onAddBet(jugadaInput.trim(), detection.type, montoNum);

    // Flash inputs briefly
    setFlashInput(true);
    setTimeout(() => setFlashInput(false), 200);

    // Clear jugada, keep monto for convenience
    setJugadaInput('');
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.15, ease: 'easeOut' }}
      className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-5 mb-4"
    >
      <div className="mb-4">
        <h2 className="text-base font-semibold text-gray-800">Nueva Jugada</h2>
        <p className="text-[13px] font-medium text-teal-600">{selectedLottery.name}</p>
      </div>

      {/* JUGADA field */}
      <div className="mb-3">
        <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-[0.05em] mb-1.5">
          Jugada
        </label>
        <div className="relative">
          <input
            type="text"
            inputMode="numeric"
            placeholder="Ej: 12, 12-34, 12-34-56"
            value={jugadaInput}
            onChange={(e) => { setJugadaInput(e.target.value); setError(''); }}
            className={`
              w-full bg-[#f9fafb] border rounded-[10px] py-3 px-4 text-lg font-semibold tabular-nums text-gray-800
              placeholder:text-gray-400 placeholder:text-base placeholder:font-normal
              focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20
              transition-all duration-200
              ${error && !detection.valid ? 'border-red-300' : 'border-gray-200'}
              ${flashInput ? 'bg-teal-50' : ''}
            `}
          />
          {detection.valid && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Check size={18} className="text-green-500" />
            </div>
          )}
        </div>
        <p className="text-[11px] text-gray-400 mt-1">
          Formato: Directo=12 | Pale=12-34 | Tripleta=12-34-56
        </p>
        {detection.type && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1.5"
          >
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-teal-100 text-teal-700 text-[10px] font-semibold">
              {detection.label}
            </span>
          </motion.div>
        )}
      </div>

      {/* LOTERIA + MONTO row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {/* LOTERIA display */}
        <div>
          <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-[0.05em] mb-1.5">
            Loteria
          </label>
          <div className="flex items-center gap-2 bg-teal-50 border border-teal-200 rounded-[10px] py-3 px-4">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-teal-600 shrink-0">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              <text x="12" y="16" textAnchor="middle" fill="currentColor" fontSize="10" fontWeight="700">L</text>
            </svg>
            <span className="text-sm font-semibold text-teal-700 truncate">
              {selectedLottery.name}
            </span>
          </div>
        </div>

        {/* MONTO field */}
        <div>
          <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-[0.05em] mb-1.5">
            Monto
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none">
              $
            </span>
            <input
              type="number"
              inputMode="decimal"
              placeholder="0.00"
              min={5}
              step={5}
              value={montoInput}
              onChange={(e) => { setMontoInput(e.target.value); setError(''); }}
              className={`
                w-full bg-[#f9fafb] border rounded-[10px] py-3 pl-8 pr-4 text-lg font-semibold tabular-nums text-gray-800
                placeholder:text-gray-400
                focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20
                transition-all duration-200
                ${error && (isNaN(montoNum) || montoNum < 5) ? 'border-red-300' : 'border-gray-200'}
              `}
            />
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-red-500 mb-3"
        >
          {error}
        </motion.p>
      )}

      {/* AGREGAR button */}
      <div className="flex justify-end">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleAdd}
          disabled={!isValid}
          className={`
            flex items-center gap-2 px-6 py-3 rounded-[10px] text-sm font-semibold
            transition-all duration-200
            sm:w-auto w-full justify-center
            ${isValid
              ? 'bg-teal-600 text-white hover:bg-teal-700 hover:-translate-y-0.5 shadow-sm'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-40'
            }
          `}
        >
          <Plus size={16} />
          AGREGAR
        </motion.button>
      </div>
    </motion.div>
  );
}
