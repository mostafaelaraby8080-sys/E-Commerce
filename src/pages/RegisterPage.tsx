import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/Toast';

export default function RegisterPage() {
  const { t, lang, isRTL } = useLanguage();
  const { notify } = useToast();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      notify(lang === 'ar' ? 'كلمات المرور غير متطابقة' : 'Passwords do not match', 'error');
      return;
    }

    if (password.length < 6) {
      notify(lang === 'ar' ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' : 'Password must be at least 6 characters', 'error');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, phone },
        },
      });

      if (error) throw error;

      if (data.user) {
        notify(t('register_success'));
        navigate('/');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t('error_occurred');
      notify(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 animate-fade-in">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white font-display font-black text-2xl">ح</span>
          </div>
          <h1 className="font-display font-bold text-2xl text-gray-900">{t('register_title')}</h1>
          <p className="text-sm text-gray-400 mt-1">{lang === 'ar' ? 'أنشئ حسابك وابدأ التسوق' : 'Create your account and start shopping'}</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">{t('full_name')}</label>
            <div className="relative">
              <User size={18} className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={`input-field ${isRTL ? 'pr-10' : 'pl-10'}`}
                placeholder={lang === 'ar' ? 'الاسم الكامل' : 'Full name'}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">{t('phone_number')}</label>
            <div className="relative">
              <Phone size={18} className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`input-field ${isRTL ? 'pr-10' : 'pl-10'}`}
                placeholder="05xxxxxxxx"
                dir="ltr"
              />
            </div>
          </div>

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

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">{t('confirm_password')}</label>
            <div className="relative">
              <Lock size={18} className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`input-field ${isRTL ? 'pr-10' : 'pl-10'}`}
                placeholder="••••••••"
                dir="ltr"
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? t('loading') : t('register_button')}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          {t('have_account')} <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700">{t('login')}</Link>
        </p>
      </div>
    </div>
  );
}
