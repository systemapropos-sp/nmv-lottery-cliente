import { useState, useCallback } from 'react';
import { User, Lock, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { SlotMachineIcon } from '@/components/icons';

interface LoginProps {
  onLogin: (username: string, password: string) => boolean;
}

export default function Login({ onLogin }: LoginProps) {
  // Mode: 'userpass' or 'pin'
  const [mode, setMode] = useState<'userpass' | 'pin'>('userpass');

  // User/Pass
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // PIN
  const [pin, setPin] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  // Date/time (static snapshot - NO live updates to avoid re-render/blink)
  const [dateTime] = useState(() => new Date());
  const formattedDate = dateTime.toLocaleDateString('es-DO', {
    weekday: 'long', day: 'numeric', month: 'long',
  });
  const formattedTime = dateTime.toLocaleTimeString('es-DO', {
    hour: '2-digit', minute: '2-digit', hour12: true,
  });
  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  const triggerError = useCallback((msg: string) => {
    setShake(true);
    setError(msg);
    setTimeout(() => { setShake(false); setError(''); }, 2500);
  }, []);

  const doLogin = useCallback(async () => {
    setError('');

    if (mode === 'userpass') {
      if (!username.trim() || !password.trim()) {
        triggerError('Complete usuario y contrasena');
        return;
      }
      setIsLoading(true);
      await new Promise(r => setTimeout(r, 500));
      const ok = onLogin(username.trim(), password.trim());
      if (!ok) triggerError('Usuario o contrasena incorrectos');
      setIsLoading(false);
    } else {
      // PIN mode
      if (pin.length !== 4) {
        triggerError('Ingrese su PIN de 4 digitos');
        return;
      }
      setIsLoading(true);
      await new Promise(r => setTimeout(r, 500));
      // Try: pin as username, "1234" as password
      let ok = onLogin(pin, '1234');
      // Fallback: try cliente1 with pin as password
      if (!ok) ok = onLogin('cliente1', pin);
      if (!ok) triggerError('PIN incorrecto');
      setIsLoading(false);
    }
  }, [mode, username, password, pin, onLogin, triggerError]);

  // PIN keypad
  const pinDigit = useCallback((d: string) => {
    setPin(p => p.length >= 4 ? p : p + d);
  }, []);
  const pinDelete = useCallback(() => setPin(p => p.slice(0, -1)), []);

  const isValid = mode === 'userpass'
    ? username.trim().length > 0 && password.trim().length > 0
    : pin.length === 4;

  return (
    <div className={`flex min-h-[100dvh] items-center justify-center bg-emerald-50 px-4 py-8 ${shake ? 'shake-login' : ''}`}>
      {/* Error - NO animation to prevent blink */}
      {error && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 rounded-lg bg-red-500 px-4 py-3 text-sm font-medium text-white shadow-lg">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Card - NO framer-motion entrance animations */}
      <div className="w-full max-w-[420px] overflow-hidden rounded-2xl bg-white shadow-[0_10px_40px_rgba(13,148,136,0.12)]">
        {/* Header */}
        <div className="rounded-t-2xl px-6 py-6 text-center" style={{ background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)' }}>
          <div className="mb-2 flex justify-center"><SlotMachineIcon size={44} className="text-white" /></div>
          <h1 className="mb-1 text-xl font-bold uppercase tracking-[0.08em] text-white">NMV LOTTERY</h1>
          <p className="mb-3 text-xs text-white/70">Sistema de Banca de Loteria</p>
          <div className="text-white/80 text-xs">
            <p className="capitalize">{capitalizedDate}</p>
            <p className="font-semibold tabular-nums">{formattedTime}</p>
          </div>
        </div>

        {/* Form */}
        <div className="px-6 py-5">
          {/* Mode toggle */}
          <div className="mb-4 flex rounded-full bg-gray-100 p-0.5">
            <button onClick={() => { setMode('userpass'); setPin(''); }}
              className={`flex-1 py-2 rounded-full text-xs font-semibold transition-colors ${mode === 'userpass' ? 'bg-teal-600 text-white' : 'text-gray-500 hover:text-gray-700'}`}>
              Usuario / Contrasena
            </button>
            <button onClick={() => { setMode('pin'); setUsername(''); setPassword(''); }}
              className={`flex-1 py-2 rounded-full text-xs font-semibold transition-colors ${mode === 'pin' ? 'bg-teal-600 text-white' : 'text-gray-500 hover:text-gray-700'}`}>
              PIN
            </button>
          </div>

          {mode === 'userpass' ? (
            /* === USER/PASS === */
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Usuario</label>
                <div className="relative">
                  <User size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" value={username} onChange={e => setUsername(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') doLogin(); }}
                    placeholder="Ingrese su usuario" disabled={isLoading}
                    autoComplete="username"
                    className="h-12 w-full rounded-[10px] border border-gray-300 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 disabled:opacity-50"
                    style={{ fontSize: '16px' }} />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Contrasena</label>
                <div className="relative">
                  <Lock size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type={showPassword ? 'text' : 'password'} value={password}
                    onChange={e => setPassword(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') doLogin(); }}
                    placeholder="Ingrese su contrasena" disabled={isLoading}
                    autoComplete="current-password"
                    className="h-12 w-full rounded-[10px] border border-gray-300 bg-white py-3 pl-11 pr-11 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 disabled:opacity-50"
                    style={{ fontSize: '16px' }} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" tabIndex={-1}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button onClick={doLogin} disabled={isLoading || !isValid}
                className="flex h-12 w-full items-center justify-center rounded-xl text-sm font-bold uppercase tracking-[0.1em] text-white shadow-[0_4px_12px_rgba(13,148,136,0.3)] transition-all hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)' }}>
                {isLoading ? <Loader2 size={20} className="animate-spin" /> : 'ENTRAR'}
              </button>
            </div>
          ) : (
            /* === PIN === */
            <div>
              {/* PIN Display Boxes */}
              <div className="mb-4 flex justify-center gap-3">
                {[0, 1, 2, 3].map(i => (
                  <div key={i} className={`w-12 h-14 rounded-xl border-2 flex items-center justify-center text-xl font-bold transition-all ${
                    i < pin.length ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-gray-300 bg-white text-gray-300'
                  }`}>
                    {i < pin.length ? '*' : ''}
                  </div>
                ))}
              </div>

              {/* PIN Keypad */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(d => (
                  <button key={d} type="button" onClick={() => pinDigit(d)}
                    disabled={isLoading || pin.length >= 4}
                    className="h-12 bg-white border border-gray-300 rounded-xl text-lg font-bold text-gray-800 shadow-sm active:bg-gray-100 disabled:opacity-50 transition-colors">
                    {d}
                  </button>
                ))}
                <button type="button" onClick={pinDelete}
                  className="h-12 bg-red-400 border border-red-500 rounded-xl text-white text-xs font-bold shadow-sm active:bg-red-500 transition-colors">
                  Borrar
                </button>
                <button type="button" onClick={() => pinDigit('0')}
                  disabled={isLoading || pin.length >= 4}
                  className="h-12 bg-white border border-gray-300 rounded-xl text-lg font-bold text-gray-800 shadow-sm active:bg-gray-100 disabled:opacity-50 transition-colors">
                  0
                </button>
                <button type="button" onClick={doLogin}
                  disabled={isLoading || pin.length < 4}
                  className="h-12 bg-green-500 border border-green-600 rounded-xl text-white text-xs font-bold shadow-sm active:bg-green-600 disabled:opacity-50 transition-colors">
                  OK
                </button>
              </div>

              <button onClick={doLogin} disabled={isLoading || pin.length < 4}
                className="flex h-12 w-full items-center justify-center rounded-xl text-sm font-bold uppercase tracking-[0.1em] text-white shadow-[0_4px_12px_rgba(13,148,136,0.3)] transition-all hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)' }}>
                {isLoading ? <Loader2 size={20} className="animate-spin" /> : 'ENTRAR'}
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-6 py-3 text-center">
          <p className="text-[11px] text-gray-400">&copy; 2025 NMV Lottery &middot; Sistema SaaS seguro &middot; v2.0</p>
        </div>
      </div>

      <style>{`
        @keyframes shakeLogin {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          50% { transform: translateX(6px); }
          75% { transform: translateX(-6px); }
        }
        .shake-login {
          animation: shakeLogin 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
}
