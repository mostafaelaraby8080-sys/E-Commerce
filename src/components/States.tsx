import { Link } from 'react-router-dom';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-fade-in">
      <div className="w-16 h-16 bg-error-50 rounded-full flex items-center justify-center mb-4">
        <AlertCircle size={32} className="text-error-500" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{t('error_occurred')}</h3>
      <p className="text-sm text-gray-500 mb-6 max-w-sm">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary flex items-center gap-2">
          <RefreshCw size={18} />
          {t('retry')}
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title, description, actionLabel, actionTo }: {
  title: string;
  description: string;
  actionLabel?: string;
  actionTo?: string;
}) {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-fade-in">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <AlertCircle size={36} className="text-gray-300" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 mb-6 max-w-sm">{description}</p>
      {actionLabel && actionTo && (
        <Link to={actionTo} className="btn-primary">{actionLabel}</Link>
      )}
    </div>
  );
}

export function NotFound() {
  const { t } = useLanguage();
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 animate-fade-in">
      <h1 className="font-display font-black text-8xl text-primary-200">404</h1>
      <p className="text-lg font-semibold text-gray-700 mt-4">{t('page_not_found')}</p>
      <Link to="/" className="btn-primary mt-6 flex items-center gap-2">
        <Home size={18} />
        {t('go_home')}
      </Link>
    </div>
  );
}

export function LoadingScreen() {
  const { t } = useLanguage();
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin" />
      <p className="text-sm text-gray-400 mt-4">{t('loading')}</p>
    </div>
  );
}
