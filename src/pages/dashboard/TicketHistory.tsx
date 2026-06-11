import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Receipt, Trash2, ChevronDown, ChevronUp, DollarSign, Hash } from 'lucide-react';
import type { Ticket } from '@/types';

interface TicketHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  tickets: Ticket[];
}

export function TicketHistory({ isOpen, onClose, tickets }: TicketHistoryProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleClear = () => {
    localStorage.removeItem('nmv_ticket_history');
    window.location.reload();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[55] flex flex-col" style={{ backgroundColor: '#f3f4f6' }}>
          {/* Header */}
          <div className="shrink-0 flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Receipt size={20} className="text-teal-600" />
              <h2 className="text-lg font-bold text-gray-800">Historial de Tickets</h2>
              <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full font-semibold">{tickets.length}</span>
            </div>
            <div className="flex items-center gap-2">
              {tickets.length > 0 && (
                <button onClick={handleClear}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors">
                  <Trash2 size={14} />Borrar
                </button>
              )}
              <button onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                <X size={18} />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
            {tickets.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <Receipt size={48} className="mb-3 opacity-30" />
                <p className="text-sm font-medium">No hay tickets en el historial</p>
                <p className="text-xs mt-1">Los tickets enviados apareceran aqui</p>
              </div>
            ) : (
              tickets.map((ticket) => {
                const isExpanded = expandedId === ticket.id;
                const date = new Date(ticket.createdAt);
                const dateStr = date.toLocaleDateString('es-DO', { day: '2-digit', month: '2-digit', year: 'numeric' });
                const timeStr = date.toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit', hour12: true });
                return (
                  <motion.div key={ticket.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                    <button onClick={() => setExpandedId(isExpanded ? null : ticket.id)}
                      className="w-full flex items-center justify-between px-4 py-3 text-left">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center">
                          <Hash size={18} className="text-teal-600" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-800">Ticket #{ticket.id}</div>
                          <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-0.5">
                            <span>{dateStr} {timeStr}</span>
                            <span>{ticket.bets.length} jugadas</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-teal-700 tabular-nums">RD${ticket.total.toFixed(0)}</span>
                        {isExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                      </div>
                    </button>
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }} className="overflow-hidden">
                          <div className="px-4 pb-3 border-t border-gray-100 pt-2">
                            {ticket.bets.map((bet, idx) => (
                              <div key={idx} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
                                    {bet.type === 'directo' ? 'DIR' : bet.type === 'pale' ? 'PAL' : bet.type === 'tripleta' ? 'TRIP' : bet.type.toUpperCase()}
                                  </span>
                                  <span className="text-sm font-semibold text-gray-800 tabular-nums">{bet.numbers}</span>
                                  <span className="text-[11px] text-gray-500">{bet.lotteryName}</span>
                                </div>
                                <span className="text-sm font-medium text-gray-700 tabular-nums">RD${bet.amount.toFixed(0)}</span>
                              </div>
                            ))}
                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-teal-100 bg-teal-50 rounded-lg px-3 py-2">
                              <span className="text-xs font-semibold text-teal-700 flex items-center gap-1"><DollarSign size={12} />Total</span>
                              <span className="text-base font-bold text-teal-700 tabular-nums">RD${ticket.total.toFixed(2)}</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
