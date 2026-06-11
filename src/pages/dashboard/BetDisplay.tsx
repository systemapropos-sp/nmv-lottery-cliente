import { motion } from 'framer-motion';
import { Hash, DollarSign } from 'lucide-react';
import type { Lottery } from '@/types';

interface BetDisplayProps {
  jugada: string;
  selectedLottery: Lottery;
  monto: string;
  onMontoClick: () => void;
}

export function BetDisplay({ jugada, selectedLottery, monto, onMontoClick }: BetDisplayProps) {
  // Format jugada with spaces between digits
  const formattedJugada = jugada.split('').join(' ') || '\u00A0';

  return (
    <div className="shrink-0 px-3 py-2 space-y-2">
      {/* Row: JUGADA | DISPONIBLE | LOTERIA */}
      <div className="flex gap-2">
        {/* JUGADA display */}
        <div className="flex-1 min-w-0">
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">
            Jugada
          </label>
          <div className="w-full bg-white border-2 border-gray-300 rounded-lg py-2.5 px-3 text-center text-xl font-bold text-gray-800 tabular-nums tracking-widest shadow-inner min-h-[48px] flex items-center justify-center">
            {formattedJugada}
          </div>
        </div>

        {/* DISPONIBLE */}
        <div className="w-20 shrink-0">
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5 text-center">
            Disponible
          </label>
          <div className="w-full bg-green-50 border border-green-300 rounded-lg py-2.5 px-1 text-center text-sm font-bold text-green-700 min-h-[48px] flex items-center justify-center">
            50/50
          </div>
        </div>

        {/* LOTERIA */}
        <div className="w-24 shrink-0">
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5 text-center">
            Loteria
          </label>
          <motion.div
            className="w-full rounded-lg py-2.5 px-2 text-center text-xs font-bold text-white min-h-[48px] flex items-center justify-center leading-tight"
            style={{ backgroundColor: selectedLottery.color }}
            animate={{ backgroundColor: selectedLottery.color }}
            transition={{ duration: 0.3 }}
          >
            {selectedLottery.name}
          </motion.div>
        </div>
      </div>

      {/* Play Type + Amount Row */}
      <div className="flex gap-2">
        {/* Play type indicator */}
        <div className="flex-1 min-w-0">
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">
            Tipo / Numero
          </label>
          <div className="w-full bg-gray-100 border border-gray-300 rounded-lg py-2.5 px-3 flex items-center gap-2 min-h-[44px]">
            <div className="flex items-center gap-1 text-gray-600">
              <Hash size={14} />
              <span className="text-xs font-medium text-gray-500">
                {jugada.length >= 4 ? 'Pale' : jugada.length >= 2 ? 'Directo' : '---'}
              </span>
            </div>
            <span className="text-base font-bold text-gray-800 tabular-nums ml-auto">
              {jugada || '----'}
            </span>
          </div>
        </div>

        {/* Amount */}
        <div className="w-24 shrink-0">
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5 text-center">
            Monto
          </label>
          <button
            onClick={onMontoClick}
            className="w-full bg-amber-50 border border-amber-300 rounded-lg py-2.5 px-2 flex items-center justify-center gap-1 min-h-[44px] active:bg-amber-100 transition-colors"
          >
            <DollarSign size={16} className="text-amber-600" />
            <span className="text-lg font-bold text-amber-700 tabular-nums">
              {monto || '0'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
