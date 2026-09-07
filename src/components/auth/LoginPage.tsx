import React, { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sprout, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { AuthModal } from '../AuthModal';
import { LanguageCode } from '../../types';
import { translations } from '../../data/translations';
import { getStoredAuthSession } from '../../services/authApiService';

interface LoginPageProps {
  mode?: 'login' | 'signup';
  currentLanguage: LanguageCode;
  onSelectLanguage: (lang: LanguageCode) => void;
  onLoginSuccess: (role: 'farmer' | 'buyer' | 'admin', userData?: any) => void;
}

/**
 * Canonical Authentication Page for KisanSetu.
 * Handles both /login and /signup cleanly via a single, un-nested canonical UI.
 * Unmounts immediately when navigating back to Home ("/") without stale DOM or modals.
 */
export const LoginPage: React.FC<LoginPageProps> = ({
  mode,
  currentLanguage,
  onLoginSuccess,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const t = translations[currentLanguage] || translations.en;

  // Resolve whether this is login or signup
  const resolvedMode: 'login' | 'signup' = useMemo(() => {
    if (mode) return mode;
    if (location.pathname.startsWith('/signup')) return 'signup';
    const params = new URLSearchParams(location.search);
    if (params.get('mode') === 'signup') return 'signup';
    return 'login';
  }, [mode, location.pathname, location.search]);

  // Read initial role from query params if specified
  const selectedRole: 'farmer' | 'buyer' | 'admin' | undefined = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const roleParam = params.get('role');
    if (roleParam === 'buyer') return 'buyer';
    if (roleParam === 'farmer') return 'farmer';
    if (roleParam === 'admin') return 'admin';
    return undefined;
  }, [location.search]);

  // Check if an existing session is present
  const existingSession = getStoredAuthSession();

  // Return to public home immediately using replace navigation so history stays clean
  const handleGoHome = () => {
    navigate('/', { replace: true });
  };

  // Sync route when user switches between Login and Register tabs inside the form
  const handleModeChange = (newMode: 'login' | 'signup') => {
    const targetPath = newMode === 'signup' ? '/signup' : '/login';
    if (location.pathname !== targetPath) {
      navigate(targetPath + location.search, { replace: true });
    }
  };

  // Sync query params when role is toggled or reset to portal selection
  const handleRoleChange = (role: 'farmer' | 'buyer' | 'admin' | null) => {
    const params = new URLSearchParams(location.search);
    if (role) {
      params.set('role', role);
    } else {
      params.delete('role');
    }
    const newSearch = params.toString() ? `?${params.toString()}` : '';
    const currentBase = location.pathname.startsWith('/signup') ? '/signup' : '/login';
    navigate(`${currentBase}${newSearch}`, { replace: true });
  };

  // Handle successful login and role-based redirect
  const handleAuthSuccess = (role: 'farmer' | 'buyer' | 'admin', userData?: any) => {
    onLoginSuccess(role, userData);
    const stateFrom = (location.state as any)?.from?.pathname;
    if (stateFrom && stateFrom !== '/login' && stateFrom !== '/signup' && stateFrom !== '/') {
      navigate(stateFrom, { replace: true });
    } else if (role === 'farmer') {
      navigate('/farmer/dashboard', { replace: true });
    } else if (role === 'buyer') {
      navigate('/buyer/dashboard', { replace: true });
    } else if (role === 'admin') {
      navigate('/admin', { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  };


  return (
    <div className="min-h-screen bg-[#FBFAF4] flex flex-col justify-between text-[#26332B] relative">
      {/* Top Header: Logo and Home Navigation */}
      <header className="w-full border-b border-[#ECE6D8] bg-white/95 backdrop-blur-xs py-3 px-4 sm:px-8 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            id="auth-brand-logo-btn"
            type="button"
            onClick={handleGoHome}
            className="flex items-center gap-2 group text-[#245C3A] hover:text-[#1C4B2E] transition-colors cursor-pointer text-left focus:outline-none"
            title="KisanSetu - Return to Home"
          >
            <div className="w-9 h-9 rounded-xl bg-[#245C3A] flex items-center justify-center text-white shadow-xs group-hover:bg-[#1C4B2E] transition-colors">
              <Sprout className="w-5 h-5 text-[#EAF3E7]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-[#245C3A]">
                  KisanSetu
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#D6A63A] bg-[#F7EFE0] px-1.5 py-0.2 rounded-sm border border-[#EADBBD]">
                  Agri
                </span>
              </div>
              <span className="text-[10px] font-medium text-[#68736B] tracking-wide">
                {t.nav?.tagline || 'Direct Farm-to-Buyer Marketplace'}
              </span>
            </div>
          </button>

          <button
            id="auth-back-home-btn"
            type="button"
            onClick={handleGoHome}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#68736B] hover:text-[#245C3A] bg-[#EEF3E8] hover:bg-[#E3EBDC] px-3.5 py-2 rounded-lg transition-colors cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{currentLanguage === 'hi' ? 'मुख्य पृष्ठ (Home)' : 'Home'}</span>
          </button>
        </div>
      </header>

      {/* Main Body: Canonical Auth Card */}
      <main className="flex-1 flex flex-col items-center justify-center p-3 sm:p-6 my-2">
        {/* Active Session Notice if already logged in */}
        {existingSession.token && existingSession.role && (
          <div className="w-full max-w-lg mb-3 p-3 rounded-2xl bg-[#EEF3E8] border border-[#D5E4CE] flex items-center justify-between text-xs text-[#245C3A] animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#245C3A] shrink-0" />
              <span>
                <strong>{currentLanguage === 'hi' ? 'सक्रिय सत्र:' : 'Active session:'}</strong>{' '}
                {existingSession.role === 'farmer'
                  ? currentLanguage === 'hi' ? 'किसान खाता सक्रिय है' : 'Farmer account active'
                  : currentLanguage === 'hi' ? 'व्यापारी खाता सक्रिय है' : 'Buyer account active'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                if (existingSession.role === 'farmer') navigate('/farmer/dashboard', { replace: true });
                else if (existingSession.role === 'buyer') navigate('/buyer/dashboard', { replace: true });
              }}
              className="font-bold underline hover:text-[#1C4B2E] cursor-pointer ml-2"
            >
              {currentLanguage === 'hi' ? 'डैशबोर्ड खोलें →' : 'Go to Dashboard →'}
            </button>
          </div>
        )}

        {/* The Single Canonical Authentication Form */}
        <AuthModal
          isOpen={true}
          isPage={true}
          onClose={handleGoHome}
          onLoginSuccess={handleAuthSuccess}
          initialMode={resolvedMode}
          initialRole={selectedRole}
          currentLanguage={currentLanguage}
          translations={t}
          onModeChange={handleModeChange}
          onRoleChange={handleRoleChange}
        />
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[#ECE6D8] bg-white/70 py-4 px-4 text-center text-xs text-[#68736B]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} KisanSetu. {currentLanguage === 'hi' ? 'सर्वाधिकार सुरक्षित।' : 'All rights reserved.'}</span>
          <button
            type="button"
            onClick={handleGoHome}
            className="text-xs text-[#245C3A] hover:underline font-semibold cursor-pointer"
          >
            ← {currentLanguage === 'hi' ? 'वापस मुख्य पृष्ठ पर जाएं' : 'Back to KisanSetu Home'}
          </button>
        </div>
      </footer>
    </div>
  );
};
