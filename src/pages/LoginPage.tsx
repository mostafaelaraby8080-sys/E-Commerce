import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/Toast';

export default function LoginPage() {
  const { t, lang, isRTL } = useLanguage();
  const { notify } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      notify(t('login_title'));
      navigate('/');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t('login_error');
      notify(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 animate-fade-in">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white font-display font-black text-2xl">ح</span>
          </div>
          <h1 className="font-display font-bold text-2xl text-gray-900">{t('login_title')}</h1>
          <p className="text-sm text-gray-400 mt-1">{lang === 'ar' ? 'أدخل بياناتك للوصول إلى حسابك' : 'Enter your credentials to access your account'}</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">{t('email')}</label>
            <div className="relative">
              <Mail size={18} className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`input-field ${isRTL ? 'pr-10' : 'pl-10'}`}
                placeholder="email@example.com"
                dir="ltr"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">{t('password')}</label>
            <div className="relative">
              <Lock size={18} className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`input-field ${isRTL ? 'pr-10 pl-10' : 'pl-10 pr-10'}`}
                placeholder="••••••••"
                dir="ltr"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 ${isRTL ? 'left-3' : 'right-3'}`}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? t('loading') : t('login_button')}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          {t('no_account')} <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-700">{t('register')}</Link>
        </p>
      </div>
    </div>
  );
}
