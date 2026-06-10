import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { TicketIcon, WhatsAppIcon } from '@/components/icons';
import type { Bet, BetType } from '@/types';

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientName: string;
  vendorPhone: string;
  bets: Bet[];
  onSendWhatsApp: () => void;
}

function getBetTypeLabel(type: BetType): string {
  switch (type) {
    case 'directo': return 'DIRECTO';
    case 'pale': return 'PALE';
    case 'tripleta': return 'TRIPLETA';
    case 'cash3': return 'CASH 3';
    case 'play4': return 'PLAY 4';
    case 'pick5': return 'PICK 5';
    default: return type;
  }
}

function groupBetsByType(bets: Bet[]) {
  const groups: Record<string, Bet[]> = {};
  for (const bet of bets) {
    const key = bet.type;
    if (!groups[key]) groups[key] = [];
    groups[key].push(bet);
  }
  return groups;
}

export function TicketModal({ isOpen, onClose, clientName, bets, onSendWhatsApp }: TicketModalProps) {
  const totalAmount = useMemo(() => bets.reduce((sum, b) => sum + b.amount, 0), [bets]);
  const groupedBets = useMemo(() => groupBetsByType(bets), [bets]);

  const now = new Date();
  const formattedDate = now.toLocaleDateString('es-DO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const formattedTime = now.toLocaleTimeString('es-DO', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-[20px] w-full max-w-[480px] max-h-[85vh] overflow-hidden flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-5 rounded-t-[20px]"
              style={{ background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)' }}
            >
              <div className="flex items-center gap-3">
                <TicketIcon size={24} className="text-white" />
                <h2 className="text-lg font-bold text-white">Resumen del Ticket</h2>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-auto p-6">
              {/* Client Info */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">
                    <span className="font-medium">Cliente:</span> {clientName}
                  </span>
                </div>
                <div className="text-[13px] text-gray-500 mb-3">
                  Fecha: {formattedDate} {formattedTime}
                </div>
                <div className="border-b border-gray-200 mb-4" />
              </motion.div>

              {/* Bet Groups */}
              {Object.entries(groupedBets).map(([type, typeBets], groupIndex) => (
                <motion.div
                  key={type}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + groupIndex * 0.05 }}
                  className="mb-4"
                >
                  <h3 className="text-xs font-bold text-teal-700 uppercase tracking-wide mb-2">
                    {getBetTypeLabel(type as BetType)}
                  </h3>
                  <div className="space-y-1.5">
                    {typeBets.map((bet) => (
                      <div
                        key={bet.id}
                        className="flex items-center justify-between text-[13px] text-gray-700 tabular-nums py-1"
                      >
                        <span>
                          {bet.numbers} - {bet.lotteryName}
                        </span>
                        <span className="font-medium">RD${bet.amount.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}

              {/* Total Section */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-4 pt-4 border-t border-gray-200"
              >
                <div className="bg-teal-50 rounded-[10px] p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Total de Jugadas:</span>
                    <span className="text-sm font-semibold text-gray-800">{bets.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Monto Total:</span>
                    <span className="text-lg font-bold text-teal-700 tabular-nums">
                      RD$ {totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="border-t border-gray-100 p-4 px-6 flex gap-3"
            >
              <button
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-[10px] bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onSendWhatsApp}
                className="flex-1 py-3 px-4 rounded-[10px] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(37,211,102,0.3)] hover:shadow-[0_4px_16px_rgba(37,211,102,0.4)] transition-all"
                style={{ backgroundColor: '#25D366' }}
                onMouseEnter={(e) => { (e.target as HTMLElement).style.backgroundColor = '#128C7E'; }}
                onMouseLeave={(e) => { (e.target as HTMLElement).style.backgroundColor = '#25D366'; }}
              >
                <WhatsAppIcon size={18} className="text-white" />
                ENVIAR POR WHATSAPP
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
