import { Link } from 'react-router-dom';
import { Beef, Truck, ShieldCheck, Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Footer() {
  const { t, lang } = useLanguage();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      {/* Features strip */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Truck, title: t('fast_delivery'), desc: t('fast_delivery_desc') },
              { icon: Beef, title: t('fresh_quality'), desc: t('fresh_quality_desc') },
              { icon: ShieldCheck, title: t('best_prices'), desc: t('best_prices_desc') },
              { icon: Clock, title: t('easy_payment'), desc: t('easy_payment_desc') },
            ].map((f, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary-600/20 rounded-lg flex items-center justify-center shrink-0">
                  <f.icon size={20} className="text-primary-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white text-sm">{f.title}</h4>
                  <p className="text-xs text-gray-400 mt-1">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-display font-black text-lg">ح</span>
              </div>
              <div>
                <h3 className="font-display font-bold text-white text-lg">{t('hero_title')}</h3>
                <p className="text-xs text-gray-400">Grocery & Meat</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              {t('hero_subtitle')}
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">{t('categories')}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/products?category=fresh-meat" className="hover:text-primary-400 transition-colors">{t('home')} - {lang === 'ar' ? 'لحوم' : 'Meat'}</Link></li>
              <li><Link to="/products?category=dairy-cheese" className="hover:text-primary-400 transition-colors">{lang === 'ar' ? 'ألبان' : 'Dairy'}</Link></li>
              <li><Link to="/products?category=frozen" className="hover:text-primary-400 transition-colors">{lang === 'ar' ? 'مجمدات' : 'Frozen'}</Link></li>
              <li><Link to="/products?category=canned" className="hover:text-primary-400 transition-colors">{lang === 'ar' ? 'معلبات' : 'Canned'}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">{lang === 'ar' ? 'تواصل معنا' : 'Contact'}</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>{lang === 'ar' ? 'الهاتف: 0500000000' : 'Phone: 0500000000'}</li>
              <li>{lang === 'ar' ? 'البريد: info@hataeljibna.com' : 'Email: info@hataeljibna.com'}</li>
              <li>{lang === 'ar' ? 'السعودية، الرياض' : 'Riyadh, Saudi Arabia'}</li>
              <li>{lang === 'ar' ? 'يومياً: 7ص - 11م' : 'Daily: 7AM - 11PM'}</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-500">
          © 2026 {t('hero_title')} — {lang === 'ar' ? 'جميع الحقوق محفوظة' : 'All rights reserved'}
        </div>
      </div>
    </footer>
  );
}
