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
import { TicketHistory } from './dashboard/TicketHistory';
import type { Bet, BetType, Lottery, Ticket } from '@/types';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error';
}

let toastIdCounter = 0;

function detectBetType(digits: string): { type: BetType; label: string } | null {
  if (digits.length === 2) return { type: 'directo', label: 'DIRECTO' };
  if (digits.length === 3) return { type: 'cash3', label: 'CASH 3' };
  if (digits.length === 4) return { type: 'pale', label: 'PALE' };
  if (digits.length === 5) return { type: 'pick5', label: 'PICK 5' };
  if (digits.length === 6) return { type: 'tripleta', label: 'TRIPLETA' };
  return null;
}

const STORAGE_KEY = 'nmv_ticket_history';

function loadTickets(): Ticket[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return parsed.map((t: Ticket) => ({ ...t, createdAt: new Date(t.createdAt) }));
  } catch { return []; }
}

function saveTickets(tickets: Ticket[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { client, logout, deductBalance } = useAuth();

  useEffect(() => { if (!client) navigate('/login'); }, [client, navigate]);

  // Phase: 'jugada' = entering numbers, 'monto' = entering amount
  const [phase, setPhase] = useState<'jugada' | 'monto'>('jugada');

  const [jugada, setJugada] = useState('');
  const [monto, setMonto] = useState('');
  const [lastMonto, setLastMonto] = useState('10');
  const [selectedLottery, setSelectedLottery] = useState<Lottery>(lotteries[0]);
  const [bets, setBets] = useState<Bet[]>([]);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [ticketHistory, setTicketHistory] = useState<Ticket[]>(loadTickets);

  // Pick first open lottery
  useEffect(() => {
    const now = new Date();
    const ct = now.getHours() * 60 + now.getMinutes();
    const open = lotteries.find(l => {
      const [h, m] = l.closingTime.split(':').map(Number);
      return h * 60 + m > ct;
    });
    if (open) setSelectedLottery(open);
  }, []);

  const addToast = useCallback((message: string, type: 'success' | 'error') => {
    const id = `toast-${++toastIdCounter}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);

  const totalBets = bets.length;
  const totalAmount = useMemo(() => bets.reduce((s, b) => s + b.amount, 0), [bets]);

  // Physical keyboard support
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault();
        if (phase === 'jugada') {
          setJugada(prev => prev.length >= 6 ? prev : prev + e.key);
        } else {
          setMonto(prev => prev === '0' ? e.key : prev.replace('.', '').length >= 6 ? prev : prev + e.key);
        }
        return;
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        if (phase === 'jugada') {
          // Validate jugada and jump to monto
          if (jugada.length < 2) { addToast('Minimo 2 digitos', 'error'); return; }
          if (!detectBetType(jugada)) { addToast('Formato invalido', 'error'); return; }
          setPhase('monto');
          setMonto(lastMonto); // repeat last amount
          addToast('Ingrese el monto', 'success');
        } else {
          // Add bet
          handleConfirmMonto();
        }
        return;
      }

      if (e.key === 'Escape' || e.key === 'Backspace') {
        e.preventDefault();
        if (phase === 'jugada') {
          setJugada(prev => prev.slice(0, -1));
        } else {
          if (monto.length <= 1) { setPhase('jugada'); setMonto(lastMonto); }
          else { setMonto(prev => prev.slice(0, -1)); }
        }
        return;
      }

      if (e.key === 'Tab') {
        e.preventDefault();
        if (phase === 'jugada' && jugada.length >= 2) {
          setPhase('monto');
          setMonto(lastMonto);
        } else if (phase === 'monto') {
          setPhase('jugada');
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, jugada, monto, lastMonto, addToast]);

  // Confirm monto phase and add bet
  const handleConfirmMonto = useCallback(() => {
    if (jugada.length < 2) { setPhase('jugada'); return; }
    const detection = detectBetType(jugada);
    if (!detection) { setPhase('jugada'); return; }

    const effectiveMonto = monto || lastMonto;
    const amount = parseFloat(effectiveMonto) || 1;
    if (amount < 1) { addToast('Monto minimo RD$1.00', 'error'); return; }

    if (client && client.balance < amount) {
      addToast(`Saldo insuficiente: RD$${client.balance.toFixed(2)}`, 'error');
      return;
    }

    const newBet: Bet = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      numbers: jugada,
      type: detection.type,
      lotteryId: selectedLottery.id,
      lotteryName: selectedLottery.name,
      amount,
      createdAt: new Date(),
    };

    setBets(prev => [...prev, newBet]);
    addToast(`${detection.label}: ${jugada} - RD$${amount.toFixed(0)}`, 'success');
    setLastMonto(String(amount));
    setJugada('');
    setMonto('');
    setPhase('jugada');
  }, [jugada, monto, lastMonto, selectedLottery, client, addToast]);

  // Keypad handlers
  const handleNumber = useCallback((num: string) => {
    if (phase === 'jugada') {
      setJugada(prev => prev.length >= 6 ? prev : prev + num);
    } else {
      setMonto(prev => prev === '0' ? num : prev.replace('.', '').length >= 6 ? prev : prev + num);
    }
  }, [phase]);

  const handleDelete = useCallback(() => {
    if (phase === 'jugada') {
      setJugada(prev => prev.slice(0, -1));
    } else {
      setMonto(prev => {
        if (prev.length <= 1) { setPhase('jugada'); return lastMonto; }
        return prev.slice(0, -1);
      });
    }
  }, [phase, lastMonto]);

  const handleOK = useCallback(() => {
    if (phase === 'jugada') {
      if (jugada.length < 2) { addToast('Minimo 2 digitos', 'error'); return; }
      if (!detectBetType(jugada)) { addToast('Formato invalido', 'error'); return; }
      setPhase('monto');
      setMonto(lastMonto);
      addToast('Ingrese el monto', 'success');
    } else {
      handleConfirmMonto();
    }
  }, [phase, jugada, lastMonto, handleConfirmMonto, addToast]);

  const handleDeleteBet = useCallback((id: string) => {
    setBets(prev => prev.filter(b => b.id !== id));
  }, []);

  const handleCreateTicket = useCallback(() => {
    if (bets.length === 0) { addToast('Agregue jugadas primero', 'error'); return; }
    setShowTicketModal(true);
  }, [bets.length, addToast]);

  const handleSendWhatsApp = useCallback(() => {
    if (!client || bets.length === 0) return;
    if (client.balance < totalAmount) {
      addToast(`Saldo insuficiente. Necesita RD$${totalAmount.toFixed(2)}`, 'error');
      return;
    }
    const deducted = deductBalance(totalAmount);
    if (!deducted) { addToast('No se pudo procesar el descuento', 'error'); return; }

    const ticketId = Math.floor(1000 + Math.random() * 9000);
    const now = new Date();
    const dateStr = now.toLocaleDateString('es-DO', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit', hour12: true });

    const ticket: Ticket = {
      id: `${ticketId}`, clientId: client.id, clientName: client.name,
      bets: [...bets], total: totalAmount, createdAt: new Date(), status: 'sent',
    };

    const updated = [ticket, ...ticketHistory].slice(0, 50);
    setTicketHistory(updated);
    saveTickets(updated);

    const grouped: Record<string, Bet[]> = {};
    for (const b of bets) { if (!grouped[b.type]) grouped[b.type] = []; grouped[b.type].push(b); }
    const labels: Record<string, string> = {
      directo: 'DIRECTO', pale: 'PALE', tripleta: 'TRIPLETA', cash3: 'CASH 3', play4: 'PLAY 4', pick5: 'PICK 5',
    };

    let msg = `*NMV LOTTERY - Ticket #${ticketId}*\nCliente: ${client.name}\nFecha: ${dateStr} ${timeStr}\n\n`;
    for (const [t, list] of Object.entries(grouped)) {
      msg += `*${labels[t] || t}:*\n`;
      for (const b of list) msg += `${b.numbers} - ${b.lotteryName} - RD$${b.amount.toFixed(2)}\n`;
      msg += '\n';
    }
    msg += `*Total: RD$${totalAmount.toFixed(2)}*\n\nJuegue con responsabilidad. NMV Lottery!`;

    window.open(`https://wa.me/${client.vendorPhone.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
    setShowTicketModal(false);
    setBets([]);
    setPhase('jugada');
    setJugada('');
    setMonto('');
    setLastMonto('10');
    addToast(`Ticket enviado! RD$${totalAmount.toFixed(2)} descontados`, 'success');
  }, [client, bets, totalAmount, ticketHistory, deductBalance, addToast]);

  const handleDuplicateLast = useCallback(() => {
    if (bets.length === 0) { addToast('No hay jugadas para duplicar', 'error'); return; }
    const lastBet = bets[bets.length - 1];
    const newBet: Bet = { ...lastBet, id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`, createdAt: new Date() };
    setBets(prev => [...prev, newBet]);
    addToast('Jugada duplicada!', 'success');
  }, [bets, addToast]);

  if (!client) return null;

  return (
    <div className="h-[100dvh] flex flex-col overflow-y-auto" style={{ backgroundColor: '#f3f4f6' }}>
      <SimpleHeader client={client} onLogout={logout} ticketCount={ticketHistory.length} onShowHistory={() => setShowHistory(true)} />

      <motion.div className="h-1 shrink-0" style={{ backgroundColor: selectedLottery.color }}
        animate={{ backgroundColor: selectedLottery.color }} transition={{ duration: 0.3 }} />

      <LotteryList lotteries={lotteries} selectedLottery={selectedLottery} onSelect={setSelectedLottery} />

      <ActionBar selectedLottery={selectedLottery} clientBalance={client.balance} onDuplicateLast={handleDuplicateLast} />

      <BetDisplay jugada={jugada} selectedLottery={selectedLottery} monto={monto}
        isJugadaPhase={phase === 'jugada'} onPhaseChange={setPhase} />

      {/* Bets list */}
      {bets.length > 0 && (
        <div className="shrink-0 mx-3 mb-1 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden" style={{ maxHeight: '100px' }}>
          <div className="overflow-y-auto h-full">
            {bets.map((bet) => (
              <motion.div key={bet.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between px-3 py-1.5 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-100 text-teal-700 shrink-0">
                    {bet.type === 'directo' ? 'DIR' : bet.type === 'pale' ? 'PAL' : bet.type === 'tripleta' ? 'TRIP' : bet.type.toUpperCase()}
                  </span>
                  <span className="text-sm font-semibold text-gray-800 tabular-nums truncate">{bet.numbers.split('').join(' ')}</span>
                  <span className="text-[11px] text-gray-500 truncate">{bet.lotteryName}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-sm font-bold text-gray-700 tabular-nums">RD${bet.amount.toFixed(0)}</span>
                  <button onClick={() => handleDeleteBet(bet.id)} className="w-6 h-6 flex items-center justify-center rounded-md text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                    <Trash2 size={12} />
                  </button>
                </div>
              </motion.div>
            ))}
            <div className="flex items-center justify-between px-3 py-1.5 bg-teal-50 border-t border-teal-100">
              <span className="text-[11px] font-semibold text-gray-600 flex items-center gap-1"><Receipt size={12} />{totalBets} jugadas</span>
              <span className="text-sm font-bold text-teal-700 tabular-nums">Total: RD${totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      <NumericKeypad onNumber={handleNumber} onDelete={handleDelete} onOK={handleOK} />

      <BottomButtons selectedLottery={selectedLottery} betCount={totalBets} onCreateTicket={handleCreateTicket} />

      <TicketModal isOpen={showTicketModal} onClose={() => setShowTicketModal(false)} clientName={client.name}
        vendorPhone={client.vendorPhone} bets={bets} onSendWhatsApp={handleSendWhatsApp} />

      <TicketHistory isOpen={showHistory} onClose={() => setShowHistory(false)} tickets={ticketHistory} />

      {/* Toasts */}
      <div className="fixed top-14 right-3 z-[60] flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div key={toast.id} initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 100, opacity: 0 }} transition={{ duration: 0.3 }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-lg text-white text-sm font-medium ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
              {toast.type === 'success' ? <CheckCircle size={16} /> : <XCircle size={16} />}
              {toast.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
