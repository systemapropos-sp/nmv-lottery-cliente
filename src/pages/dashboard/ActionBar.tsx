import { useState } from 'react';
import { ClipboardList, Printer, DollarSign, HelpCircle, ChevronDown, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Lottery } from '@/types';

interface ActionBarProps {
  selectedLottery: Lottery;
  clientBalance: number;
  onDuplicateLast?: () => void;
}

export function ActionBar({ selectedLottery, clientBalance, onDuplicateLast }: ActionBarProps) {
  const [showHelp, setShowHelp] = useState(false);
  const [copied, setCopied] = useState(false);

  // 1. Clipboard: copy info
  const handleCopy = () => {
    const text = `NMV Lottery - ${selectedLottery.name}`;
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // 2. Printer: print page
  const handlePrint = () => { window.print(); };

  // 3. Dollar: shows balance (already visible in header, button is visual)
  const handleBalance = () => {};

  // 4. Help: show instructions
  const handleHelp = () => { setShowHelp(true); };

  return (
    <>
      <motion.div className="shrink-0 flex items-center justify-between px-3 py-2"
        style={{ backgroundColor: selectedLottery.color }}
        animate={{ backgroundColor: selectedLottery.color }} transition={{ duration: 0.3 }}>
        <span className="text-white text-sm font-bold uppercase tracking-wider">Crear Ticket</span>
        <div className="flex items-center gap-1.5">
          {/* Clipboard */}
          <button onClick={handleCopy} title="Copiar jugadas"
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white transition-colors relative">
            <ClipboardList size={16} />
            {copied && <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] bg-black/70 text-white px-1.5 py-0.5 rounded whitespace-nowrap">Copiado!</span>}
          </button>
          {/* Printer */}
          <button onClick={handlePrint} title="Imprimir ticket"
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white transition-colors">
            <Printer size={16} />
          </button>
          {/* Dollar */}
          <button onClick={handleBalance} title={`Balance: RD$${clientBalance.toFixed(2)}`}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white transition-colors">
            <DollarSign size={16} />
          </button>
          {/* Help */}
          <button onClick={handleHelp} title="Ayuda"
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white transition-colors">
            <HelpCircle size={16} />
          </button>
          {/* Duplicate */}
          <button onClick={onDuplicateLast} title="Duplicar ultima jugada"
            className="flex items-center gap-0.5 bg-white/20 hover:bg-white/40 rounded-full px-2.5 py-1 text-white text-[11px] font-medium transition-colors">
            Duplicar<ChevronDown size={12} />
          </button>
        </div>
      </motion.div>

      {/* Help Modal */}
      <AnimatePresence>
        {showHelp && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            onClick={() => setShowHelp(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()} className="bg-white rounded-2xl p-6 w-full max-w-[340px] shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">Como Jugar</h3>
                <button onClick={() => setShowHelp(false)} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"><X size={16} /></button>
              </div>
              <div className="space-y-3 text-sm text-gray-600">
                {[
                  'Seleccione una loteria de la lista',
                  'Ingrese su jugada (2-6 digitos) usando el teclado',
                  'Presione OK para pasar a MONTO',
                  'Ingrese el monto (minimo RD$1) y presione OK',
                  'Presione CREAR TICKET y envie por WhatsApp',
                ].map((step, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</span>
                    <p>{step}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500">
                <p><strong>Directo:</strong> 2 digitos (ej: 12)</p>
                <p><strong>Pale:</strong> 4 digitos (ej: 1234)</p>
                <p><strong>Tripleta:</strong> 6 digitos (ej: 123456)</p>
                <p><strong>Cash 3:</strong> 3 digitos (ej: 123)</p>
                <p><strong>Play 4:</strong> 4 digitos (ej: 1234)</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
