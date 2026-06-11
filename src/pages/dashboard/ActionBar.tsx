import { ClipboardList, Printer, DollarSign, HelpCircle, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Lottery } from '@/types';

interface ActionBarProps {
  selectedLottery: Lottery;
}

export function ActionBar({ selectedLottery }: ActionBarProps) {
  return (
    <motion.div
      className="shrink-0 flex items-center justify-between px-3 py-2"
      style={{ backgroundColor: selectedLottery.color }}
      animate={{ backgroundColor: selectedLottery.color }}
      transition={{ duration: 0.3 }}
    >
      {/* Left: CREAR TICKET text */}
      <span className="text-white text-sm font-bold uppercase tracking-wider">
        Crear Ticket
      </span>

      {/* Right: Icon buttons */}
      <div className="flex items-center gap-1.5">
        <ActionButton icon={<ClipboardList size={16} />} />
        <ActionButton icon={<Printer size={16} />} />
        <ActionButton icon={<DollarSign size={16} />} />
        <ActionButton icon={<HelpCircle size={16} />} />

        {/* Duplicar dropdown */}
        <button className="flex items-center gap-0.5 bg-white/20 hover:bg-white/30 rounded-full px-2.5 py-1 text-white text-[11px] font-medium transition-colors">
          Duplicar
          <ChevronDown size={12} />
        </button>
      </div>
    </motion.div>
  );
}

function ActionButton({ icon }: { icon: React.ReactNode }) {
  return (
    <button className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors">
      {icon}
    </button>
  );
}
