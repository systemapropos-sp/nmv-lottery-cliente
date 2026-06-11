import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign } from 'lucide-react';
import type { Lottery } from '@/types';

interface BetDisplayProps {
  jugada: string;
  selectedLottery: Lottery;
  monto: string;
  isJugadaPhase: boolean;
  onPhaseChange: (phase: 'jugada' | 'monto') => void;
}

export function BetDisplay({ jugada, selectedLottery, monto, isJugadaPhase, onPhaseChange }: BetDisplayProps) {
  const formattedJugada = jugada.split('').join(' ') || '\u00A0';
  const [cursorVisible, setCursorVisible] = useState(true);

  // Blinking cursor
  useEffect(() => {
    const interval = setInterval(() => setCursorVisible(v => !v), 530);
    return () => clearInterval(interval);
  }, []);

  const getTypeLabel = () => {
    if (jugada.length === 0) return '---';
    if (jugada.length === 2) return 'Directo';
    if (jugada.length === 3) return 'Cash 3';
    if (jugada.length === 4) return 'Pale';
    if (jugada.length === 5) return 'Pick 5';
    if (jugada.length === 6) return 'Tripleta';
    return '---';
  };

  return (
    <div className="shrink-0 px-3 py-2 space-y-2">
      {/* Row: JUGADA | DISPONIBLE | LOTERIA */}
      <div className="flex gap-2">
        {/* JUGADA display - with blinking cursor | */}
        <div className="flex-1 min-w-0">
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Jugada</label>
          <button onClick={() => onPhaseChange('jugada')}
            className={`w-full rounded-lg py-2.5 px-3 text-center text-xl font-bold tabular-nums tracking-widest shadow-inner min-h-[48px] flex items-center justify-center border-2 transition-all duration-200 ${
              isJugadaPhase
                ? 'border-teal-500 bg-teal-50 text-teal-800 shadow-[0_0_0_3px_rgba(20,184,166,0.15)]'
                : 'border-gray-300 bg-white text-gray-800'
            }`}>
            <span>{formattedJugada}</span>
            {isJugadaPhase && (
              <span className="inline-block w-[2px] h-6 bg-teal-600 ml-1 transition-opacity duration-75"
                style={{ opacity: cursorVisible ? 1 : 0 }} />
            )}
          </button>
        </div>

        {/* DISPONIBLE */}
        <div className="w-20 shrink-0">
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5 text-center">Disponible</label>
          <div className="w-full bg-green-50 border border-green-300 rounded-lg py-2.5 px-1 text-center text-sm font-bold text-green-700 min-h-[48px] flex items-center justify-center">
            50/50
          </div>
        </div>

        {/* LOTERIA */}
        <div className="w-24 shrink-0">
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5 text-center">Loteria</label>
          <motion.div className="w-full rounded-lg py-2.5 px-2 text-center text-xs font-bold text-white min-h-[48px] flex items-center justify-center leading-tight"
            style={{ backgroundColor: selectedLottery.color }}
            animate={{ backgroundColor: selectedLottery.color }} transition={{ duration: 0.3 }}>
            {selectedLottery.shortName}
          </motion.div>
        </div>
      </div>

      {/* Play Type + Amount Row */}
      <div className="flex gap-2">
        {/* Play type */}
        <div className="flex-1 min-w-0">
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Tipo / Numero</label>
          <div className={`w-full rounded-lg py-2.5 px-3 flex items-center gap-2 min-h-[44px] border-2 transition-all duration-200 ${
            !isJugadaPhase
              ? 'border-amber-500 bg-amber-50 shadow-[0_0_0_3px_rgba(245,158,11,0.15)]'
              : 'border-gray-300 bg-gray-100'
          }`}>
            <span className="text-xs font-medium text-gray-500">{getTypeLabel()}</span>
            <span className="text-base font-bold text-gray-800 tabular-nums ml-auto">{jugada || '----'}</span>
            {!isJugadaPhase && (
              <span className="inline-block w-[2px] h-5 bg-amber-600 ml-1 transition-opacity duration-75"
                style={{ opacity: cursorVisible ? 1 : 0 }} />
            )}
          </div>
        </div>

        {/* Amount */}
        <div className="w-24 shrink-0">
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5 text-center">Monto</label>
          <button onClick={() => onPhaseChange('monto')}
            className={`w-full rounded-lg py-2.5 px-2 flex items-center justify-center gap-1 min-h-[44px] border-2 transition-all duration-200 ${
              !isJugadaPhase
                ? 'border-amber-500 bg-amber-50 shadow-[0_0_0_3px_rgba(245,158,11,0.15)]'
                : 'border-amber-300 bg-amber-50'
            }`}>
            <DollarSign size={16} className="text-amber-600" />
            <span className="text-lg font-bold text-amber-700 tabular-nums">{monto || '0'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
