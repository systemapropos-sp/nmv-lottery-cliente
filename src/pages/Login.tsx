import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { SlotMachineIcon } from '@/components/icons';

interface LoginProps {
  isAuthenticated: boolean;
  onLogin: (username: string, password: string) => boolean;
}

const easeOut: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function Login({ isAuthenticated, onLogin }: LoginProps) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const [activeTab, setActiveTab] = useState<'cliente' | 'admin'>('cliente');
  const [dateTime, setDateTime] = useState(new Date());

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Format date in Spanish: "Jueves, 11 de Junio"
  const formattedDate = dateTime.toLocaleDateString('es-DO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  // Format time: "07:03 a.m."
  const formattedTime = dateTime.toLocaleTimeString('es-DO', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  // Capitalize first letter only
  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');

      if (!username.trim() || !password.trim()) {
        setShake(true);
        setError('Por favor complete todos los campos');
        setTimeout(() => setShake(false), 400);
        return;
      }

      setIsLoading(true);

      // Simulate 800ms delay for auth check
      await new Promise((resolve) => setTimeout(resolve, 800));

      const success = onLogin(username.trim(), password.trim());

      if (success) {
        navigate('/');
      } else {
        setShake(true);
        setError('Usuario o contrasena incorrectos');
        setTimeout(() => setShake(false), 400);
      }

      setIsLoading(false);
    },
    [username, password, onLogin, navigate]
  );

  // Keyboard: Enter submits
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSubmit(e);
      }
    },
    [handleSubmit]
  );

  const isFormValid = username.trim().length > 0 && password.trim().length > 0;

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-emerald-50 px-4 py-8">
      {/* Error Toast */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: easeOut }}
            className="fixed top-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-lg bg-red-500 px-4 py-3 text-sm font-medium text-white shadow-lg sm:left-auto sm:right-4 sm:top-4 sm:translate-x-0"
          >
            <AlertCircle size={16} />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Card */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: easeOut }}
        className="w-full max-w-[420px] overflow-hidden rounded-2xl bg-white shadow-[0_10px_40px_rgba(13,148,136,0.12)]"
      >
        {/* Brand Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="rounded-t-2xl px-6 py-7 text-center sm:px-7"
          style={{
            background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
          }}
        >
          <div className="mb-3 flex justify-center">
            <SlotMachineIcon size={48} className="text-white" />
          </div>
          <h1 className="mb-1 text-[22px] font-bold uppercase tracking-[0.08em] text-white">
            NMV LOTTERY
          </h1>
          <p className="mb-4 text-[13px] font-normal text-white/80">
            Sistema de Banca de Loteria
          </p>
          <div className="text-white/90">
            <p className="text-sm font-normal capitalize">{capitalizedDate}</p>
            <motion.p
              key={formattedTime}
              initial={{ opacity: 0.7 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-sm font-semibold tabular-nums"
            >
              {formattedTime}
            </motion.p>
          </div>
        </motion.div>

        {/* Login Form */}
        <motion.div
          animate={shake ? { x: [0, -5, 5, -5, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="px-6 py-7 sm:px-7"
        >
          {/* Tab Toggle */}
          <motion.div
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="mb-5 flex justify-center"
          >
            <div className="flex rounded-full bg-gray-100 p-1">
              <button
                type="button"
                onClick={() => setActiveTab('cliente')}
                className="relative z-10 px-6 py-2 text-[13px] font-semibold transition-colors duration-200"
                style={{
                  color: activeTab === 'cliente' ? '#ffffff' : '#6b7280',
                }}
              >
                {activeTab === 'cliente' && (
                  <motion.div
                    layoutId="loginTabPill"
                    className="absolute inset-0 rounded-full bg-teal-600"
                    style={{ zIndex: -1 }}
                    transition={{ type: 'spring', duration: 0.25, bounce: 0.15 }}
                  />
                )}
                Cliente
              </button>
              <button
                type="button"
                onClick={() => {
                  // Admin tab is disabled - show tooltip behavior
                }}
                title="Acceso exclusivo para vendedores"
                className="relative z-10 cursor-not-allowed px-6 py-2 text-[13px] font-medium text-gray-400 transition-colors duration-200"
              >
                Administrador
              </button>
            </div>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>
            {/* Username */}
            <motion.div
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <label className="mb-1.5 block text-xs font-medium text-gray-600">
                Usuario
              </label>
              <div className="relative">
                <User
                  size={16}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ingrese su usuario"
                  disabled={isLoading}
                  autoComplete="username"
                  className="h-12 w-full rounded-[10px] border border-gray-300 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 disabled:opacity-50"
                  style={{ fontSize: '16px' }}
                />
              </div>
            </motion.div>

            {/* Spacer */}
            <div className="h-3" />

            {/* Password */}
            <motion.div
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.18 }}
            >
              <label className="mb-1.5 block text-xs font-medium text-gray-600">
                Contrasena
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ingrese su contrasena"
                  disabled={isLoading}
                  autoComplete="current-password"
                  className="h-12 w-full rounded-[10px] border border-gray-300 bg-white py-3 pl-11 pr-11 text-sm text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 disabled:opacity-50"
                  style={{ fontSize: '16px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-opacity duration-150 hover:text-gray-600"
                  tabIndex={-1}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {showPassword ? (
                      <motion.div
                        key="eyeoff"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        <EyeOff size={16} />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="eye"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        <Eye size={16} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </div>
            </motion.div>

            {/* Spacer */}
            <div className="h-5" />

            {/* ENTRAR Button */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <button
                type="submit"
                disabled={isLoading || !isFormValid}
                className="flex h-12 w-full items-center justify-center rounded-xl text-sm font-bold uppercase tracking-[0.1em] text-white shadow-[0_4px_12px_rgba(13,148,136,0.3)] transition-all duration-150 hover:brightness-110 hover:-translate-y-px active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
                style={{
                  background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
                }}
              >
                {isLoading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  'ENTRAR'
                )}
              </button>
            </motion.div>
          </form>
        </motion.div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-6 py-4 text-center">
          <p className="text-[11px] font-normal text-gray-400">
            &copy; 2025 NMV Lottery &middot; Sistema SaaS seguro &middot; v2.0
          </p>
        </div>
      </motion.div>
    </div>
  );
}
