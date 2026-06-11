import { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Trash2, Receipt } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { lotteries } from '@/data/lotteries';
import { SimpleHeader } from './dashboard/SimpleHeader';
import { LotteryList } from './dashboard/LotteryList';
import { ActionBar } from './dashboard/ActionBar';
import { BetDisplay } from './dashboard/BetDisplay';
import { NumericKeypad } from './dashboard/NumericKeypad';
import { BottomButtons } from './dashboard/BottomButtons';
import { TicketModal } from './dashboard/TicketModal';
import type { Bet, BetType, Lottery } from '@/types';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error';
}

let toastIdCounter = 0;

function detectBetType(digits: string): { type: BetType; label: string } | null {
  if (digits.length === 2) {
    return { type: 'directo', label: 'DIRECTO' };
  }
  if (digits.length === 3) {
    return { type: 'cash3', label: 'CASH 3' };
  }
  if (digits.length === 4) {
    return { type: 'pale', label: 'PALE' };
  }
  if (digits.length === 5) {
    return { type: 'play4', label: 'PLAY 4' };
  }
  if (digits.length === 6) {
    return { type: 'tripleta', label: 'TRIPLETA' };
  }
  return null;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { client, logout } = useAuth();

  // Redirect if not authenticated
  useEffect(() => {
    if (!client) {
      navigate('/login');
    }
  }, [client, navigate]);

  // Core state
  const [jugada, setJugada] = useState('');
  const [monto, setMonto] = useState('');
  const [showMontoInput, setShowMontoInput] = useState(false);
  const [montoInputTemp, setMontoInputTemp] = useState('');
  const [selectedLottery, setSelectedLottery] = useState<Lottery>(lotteries[0]);
  const [bets, setBets] = useState<Bet[]>([]);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Pick first open lottery based on current time
  useEffect(() => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;

    const openLottery = lotteries.find((l) => {
      const [h, m] = l.closingTime.split(':').map(Number);
      return h * 60 + m > currentTime;
    });

    if (openLottery) {
      setSelectedLottery(openLottery);
    }
  }, []);

  const addToast = useCallback((message: string, type: 'success' | 'error') => {
    const id = `toast-${++toastIdCounter}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const totalBets = bets.length;
  const totalAmount = useMemo(() => bets.reduce((sum, b) => sum + b.amount, 0), [bets]);

  // Keypad handlers
  const handleNumber = useCallback((num: string) => {
    setJugada((prev) => {
      if (prev.length >= 6) return prev; // max 6 digits
      return prev + num;
    });
  }, []);

  const handleDelete = useCallback(() => {
    setJugada((prev) => prev.slice(0, -1));
  }, []);

  const handleOK = useCallback(() => {
    if (jugada.length < 2) {
      addToast('Minimo 2 digitos', 'error');
      return;
    }

    const detection = detectBetType(jugada);
    if (!detection) {
      addToast('Formato invalido', 'error');
      return;
    }

    // Use monto if set, otherwise default to 10
    const amount = parseFloat(monto) || 10;

    const newBet: Bet = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      numbers: jugada,
      type: detection.type,
      lotteryId: selectedLottery.id,
      lotteryName: selectedLottery.name,
      amount,
      createdAt: new Date(),
    };

    setBets((prev) => [...prev, newBet]);
    addToast(`${detection.label}: ${jugada} - RD$${amount.toFixed(0)}`, 'success');

    // Clear jugada, keep monto
    setJugada('');
  }, [jugada, monto, selectedLottery, addToast]);

  const handleDeleteBet = useCallback((id: string) => {
    setBets((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const handleCreateTicket = useCallback(() => {
    if (bets.length === 0) {
      addToast('Agregue jugadas primero', 'error');
      return;
    }
    setShowTicketModal(true);
  }, [bets.length, addToast]);

  const handleSendWhatsApp = useCallback(() => {
    if (!client || bets.length === 0) return;

    const ticketId = Math.floor(1000 + Math.random() * 9000);
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

    // Group bets by type
    const grouped: Record<string, Bet[]> = {};
    for (const bet of bets) {
      if (!grouped[bet.type]) grouped[bet.type] = [];
      grouped[bet.type].push(bet);
    }

    const typeLabels: Record<string, string> = {
      directo: 'DIRECTO',
      pale: 'PALE',
      tripleta: 'TRIPLETA',
      cash3: 'CASH 3',
      play4: 'PLAY 4',
      pick5: 'PICK 5',
    };

    let message = `*NMV LOTTERY - Ticket #${ticketId}*\n`;
    message += `Cliente: ${client.name}\n`;
    message += `Fecha: ${formattedDate} ${formattedTime}\n\n`;

    for (const [type, typeBets] of Object.entries(grouped)) {
      message += `*${typeLabels[type] || type}:*\n`;
      for (const bet of typeBets) {
        message += `${bet.numbers} - ${bet.lotteryName} - RD$${bet.amount.toFixed(2)}\n`;
      }
      message += '\n';
    }

    message += `*Total: RD$${totalAmount.toFixed(2)}*\n\n`;
    message += `Juegue con responsabilidad. NMV Lottery!`;

    const encodedMessage = encodeURIComponent(message);
    const phone = client.vendorPhone.replace(/\D/g, '');
    const waUrl = `https://wa.me/${phone}?text=${encodedMessage}`;

    window.open(waUrl, '_blank');

    setShowTicketModal(false);
    setBets([]);
    addToast('Abriendo WhatsApp...', 'success');
  }, [client, bets, totalAmount, addToast]);

  const handleMontoClick = useCallback(() => {
    setShowMontoInput(true);
    setMontoInputTemp(monto);
  }, [monto]);

  const handleMontoSubmit = useCallback(() => {
    setMonto(montoInputTemp);
    setShowMontoInput(false);
  }, [montoInputTemp]);

  if (!client) {
    return null;
  }

  return (
    <div
      className="h-[100dvh] flex flex-col overflow-hidden"
      style={{ backgroundColor: '#f3f4f6' }}
    >
      {/* Header */}
      <SimpleHeader client={client} onLogout={logout} />

      {/* Dynamic theme accent line */}
      <motion.div
        className="h-1 shrink-0"
        style={{ backgroundColor: selectedLottery.color }}
        animate={{ backgroundColor: selectedLottery.color }}
        transition={{ duration: 0.3 }}
      />

      {/* Lottery List */}
      <LotteryList
        lotteries={lotteries}
        selectedLottery={selectedLottery}
        onSelect={setSelectedLottery}
      />

      {/* Action Bar */}
      <ActionBar selectedLottery={selectedLottery} />

      {/* Bet Display */}
      <BetDisplay
        jugada={jugada}
        selectedLottery={selectedLottery}
        monto={monto}
        onMontoClick={handleMontoClick}
      />

      {/* Bets List - compact scrollable */}
      {bets.length > 0 && (
        <div className="shrink-0 mx-3 mb-1 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden" style={{ maxHeight: '100px' }}>
          <div className="overflow-y-auto h-full">
            {bets.map((bet, idx) => (
              <motion.div
                key={bet.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className="flex items-center justify-between px-3 py-1.5 border-b border-gray-50 last:border-0"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-100 text-teal-700 shrink-0">
                    {bet.type === 'directo' ? 'DIR' : bet.type === 'pale' ? 'PAL' : bet.type === 'tripleta' ? 'TRIP' : bet.type.toUpperCase()}
                  </span>
                  <span className="text-sm font-semibold text-gray-800 tabular-nums truncate">
                    {bet.numbers.split('').join(' ')}
                  </span>
                  <span className="text-[11px] text-gray-500 truncate">
                    {bet.lotteryName}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-sm font-bold text-gray-700 tabular-nums">
                    RD${bet.amount.toFixed(0)}
                  </span>
                  <button
                    onClick={() => handleDeleteBet(bet.id)}
                    className="w-6 h-6 flex items-center justify-center rounded-md text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </motion.div>
            ))}
            <div className="flex items-center justify-between px-3 py-1.5 bg-teal-50 border-t border-teal-100">
              <span className="text-[11px] font-semibold text-gray-600 flex items-center gap-1">
                <Receipt size={12} />
                {totalBets} jugadas
              </span>
              <span className="text-sm font-bold text-teal-700 tabular-nums">
                Total: RD${totalAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Numeric Keypad */}
      <NumericKeypad
        onNumber={handleNumber}
        onDelete={handleDelete}
        onOK={handleOK}
      />

      {/* Bottom Buttons */}
      <BottomButtons
        selectedLottery={selectedLottery}
        betCount={totalBets}
        onCreateTicket={handleCreateTicket}
      />

      {/* Ticket Modal */}
      <TicketModal
        isOpen={showTicketModal}
        onClose={() => setShowTicketModal(false)}
        clientName={client.name}
        vendorPhone={client.vendorPhone}
        bets={bets}
        onSendWhatsApp={handleSendWhatsApp}
      />

      {/* Monto Input Modal */}
      <AnimatePresence>
        {showMontoInput && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            onClick={() => setShowMontoInput(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 w-full max-w-[320px] shadow-2xl"
            >
              <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">Ingresar Monto</h3>
              <div className="relative mb-4">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-gray-400 font-bold">$</span>
                <input
                  type="number"
                  inputMode="decimal"
                  autoFocus
                  value={montoInputTemp}
                  onChange={(e) => setMontoInputTemp(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleMontoSubmit(); }}
                  placeholder="0"
                  className="w-full bg-gray-50 border-2 border-gray-300 rounded-xl py-3 pl-10 pr-4 text-2xl font-bold text-gray-800 text-center tabular-nums focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowMontoInput(false)}
                  className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleMontoSubmit}
                  className="flex-1 py-2.5 rounded-xl text-white text-sm font-bold transition-colors"
                  style={{ backgroundColor: selectedLottery.color }}
                >
                  Aceptar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notifications */}
      <div className="fixed top-14 right-3 z-[60] flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-lg text-white text-sm font-medium
                ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}
              `}
            >
              {toast.type === 'success' ? (
                <CheckCircle size={16} />
              ) : (
                <XCircle size={16} />
              )}
              {toast.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
