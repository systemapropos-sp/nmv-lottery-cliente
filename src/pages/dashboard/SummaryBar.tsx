import { motion, AnimatePresence } from 'framer-motion';
import { TicketIcon } from '@/components/icons';

interface SummaryBarProps {
  totalBets: number;
  totalAmount: number;
  onCreateTicket: () => void;
}

export function SummaryBar({ totalBets, totalAmount, onCreateTicket }: SummaryBarProps) {
  const hasBets = totalBets > 0;

  return (
    <>
      {/* Sticky Summary Bar */}
      <AnimatePresence>
        {hasBets && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="sticky bottom-16 lg:bottom-0 z-20 bg-white border-t-2 border-teal-600 px-5 py-3 shadow-[0_-2px_10px_rgba(0,0,0,0.06)]"
          >
            <div className="max-w-3xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Total de Jugadas:</span>
                <motion.span
                  key={totalBets}
                  initial={{ scale: 1.05 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-xl font-bold text-teal-700 tabular-nums"
                >
                  {totalBets}
                </motion.span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Monto Total:</span>
                <motion.span
                  key={totalAmount}
                  initial={{ scale: 1.05 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-xl font-bold text-teal-700 tabular-nums"
                >
                  RD$ {totalAmount.toFixed(2)}
                </motion.span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CREAR TICKET Button */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3, ease: 'easeOut' }}
        className="pt-4 pb-6"
      >
        <motion.button
          whileHover={hasBets ? { scale: 1.01 } : {}}
          whileTap={hasBets ? { scale: 0.98 } : {}}
          onClick={hasBets ? onCreateTicket : undefined}
          disabled={!hasBets}
          className={`
            w-full h-[52px] rounded-[14px] flex items-center justify-center gap-2
            text-base font-bold uppercase tracking-[0.06em] text-white
            transition-all duration-200
            ${hasBets
              ? 'shadow-[0_4px_16px_rgba(56,189,248,0.35)] hover:brightness-110 hover:-translate-y-0.5 active:scale-[0.98]'
              : 'opacity-35 cursor-not-allowed shadow-none'
            }
          `}
          style={hasBets ? {
            background: 'linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)',
          } : { background: '#9ca3af' }}
        >
          <TicketIcon size={20} className="text-white" />
          CREAR TICKET
        </motion.button>
      </motion.div>
    </>
  );
}
