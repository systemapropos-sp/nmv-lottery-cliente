import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Ticket, Printer } from 'lucide-react';
import { WhatsAppIcon } from '@/components/icons';
import type { Bet, BetType } from '@/types';

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientName: string;
  vendorPhone: string;
  bets: Bet[];
  onSendWhatsApp: () => void;
  onPrint?: () => void;
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

export function TicketModal({ isOpen, onClose, clientName, bets, onSendWhatsApp, onPrint }: TicketModalProps) {
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
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-[480px] max-h-[80vh] overflow-hidden flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4 shrink-0"
              style={{ background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)' }}
            >
              <div className="flex items-center gap-2.5">
                <Ticket size={22} className="text-white" />
                <h2 className="text-base font-bold text-white">Resumen del Ticket</h2>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-auto p-5">
              {/* Client Info */}
              <div className="mb-1">
                <span className="text-sm text-gray-600">
                  <span className="font-medium">Cliente:</span> {clientName}
                </span>
              </div>
              <div className="text-xs text-gray-500 mb-3">
                Fecha: {formattedDate} {formattedTime}
              </div>
              <div className="border-b border-gray-200 mb-4" />

              {/* Bet Groups */}
              {Object.entries(groupedBets).map(([type, typeBets]) => (
                <div key={type} className="mb-4">
                  <h3 className="text-xs font-bold text-teal-700 uppercase tracking-wide mb-2">
                    {getBetTypeLabel(type as BetType)}
                  </h3>
                  <div className="space-y-1.5">
                    {typeBets.map((bet) => (
                      <div
                        key={bet.id}
                        className="flex items-center justify-between text-sm text-gray-700 tabular-nums py-1"
                      >
                        <span>
                          {bet.numbers} - {bet.lotteryName}
                        </span>
                        <span className="font-semibold">RD${bet.amount.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Empty state */}
              {bets.length === 0 && (
                <div className="text-center py-8 text-gray-400 text-sm">
                  No hay jugadas agregadas
                </div>
              )}

              {/* Total Section */}
              {bets.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="bg-teal-50 rounded-xl p-4">
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
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 p-4 px-5 flex gap-3 shrink-0">
              <button
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-xl bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              {onPrint && (
                <button
                  onClick={onPrint}
                  className="py-3 px-4 rounded-xl bg-gray-500 text-white hover:bg-gray-600 transition-colors flex items-center gap-1.5"
                >
                  <Printer size={16} />
                </button>
              )}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onSendWhatsApp}
                disabled={bets.length === 0}
                className="flex-[2] py-3 px-4 rounded-xl text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: bets.length > 0 ? '#25D366' : '#9CA3AF',
                  boxShadow: bets.length > 0 ? '0 4px 12px rgba(37,211,102,0.3)' : 'none',
                }}
              >
                <WhatsAppIcon size={18} className="text-white" />
                ENVIAR POR WHATSAPP
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
