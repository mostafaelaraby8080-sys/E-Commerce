import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Beef, ShieldCheck, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';
import { getCategoryName, getProductName } from '@/i18n/translations';
import type { Category, Product } from '@/types';
import CategoryCard from '@/components/CategoryCard';
import ProductCard from '@/components/ProductCard';
import ProductCardSkeleton from '@/components/ProductCardSkeleton';

export default function HomePage() {
  const { t, lang, isRTL } = useLanguage();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [{ data: cats }, { data: prods }] = await Promise.all([
        supabase.from('categories').select('*').order('sort_order'),
        supabase.from('products').select('*, category:categories(*)').eq('is_active', true).limit(8),
      ]);
      setCategories(cats as Category[] || []);
      setProducts(prods as Product[] || []);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="animate-fade-in">
      {/* Hero section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 -left-20 w-72 h-72 bg-primary-300 rounded-full blur-3xl" />
          <div className="absolute bottom-0 -right-20 w-96 h-96 bg-secondary-300 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-center md:text-start">
              <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-4 animate-slide-down">
                <Beef size={16} />
                {lang === 'ar' ? 'جودة طازجة يومياً' : 'Fresh quality daily'}
              </div>
              <h1 className="font-display font-black text-4xl md:text-6xl text-gray-900 leading-tight text-balance animate-slide-up">
                {lang === 'ar' ? (
                  <>أجود أنواع <span className="text-primary-600">اللحوم</span> والبقالة <span className="text-secondary-600">الطازجة</span></>
                ) : (
                  <>Finest <span className="text-primary-600">Meats</span> & Fresh <span className="text-secondary-600">Groceries</span></>
                )}
              </h1>
              <p className="text-lg text-gray-600 mt-4 max-w-md mx-auto md:mx-0 animate-slide-up">
                {t('hero_subtitle')}
              </p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start mt-8 animate-slide-up">
                <Link to="/products" className="btn-primary flex items-center gap-2">
                  {t('shop_now')}
                  <ArrowRight size={18} className={isRTL ? 'rotate-180' : ''} />
                </Link>
                <a href="#categories" className="btn-secondary">{t('browse_categories')}</a>
              </div>
            </div>
            <div className="relative hidden md:block">
              <div className="relative w-full aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-200 to-secondary-200 rounded-[2rem] rotate-6 opacity-50" />
                <img
                  src="https://images.pexels.com/photos/18882519/pexels-photo-18882519.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                  alt={t('hero_title')}
                  className="relative w-full h-full object-cover rounded-[2rem] shadow-2xl"
                />
                <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3 animate-slide-up">
                  <div className="w-12 h-12 bg-success-100 rounded-xl flex items-center justify-center">
                    <Truck size={24} className="text-success-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{t('fast_delivery')}</p>
                    <p className="text-xs text-gray-400">2 {lang === 'ar' ? 'ساعة' : 'hours'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features strip */}
      <section className="bg-white border-y border-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Truck, title: t('fast_delivery'), desc: t('fast_delivery_desc'), color: 'success' },
              { icon: Beef, title: t('fresh_quality'), desc: t('fresh_quality_desc'), color: 'primary' },
              { icon: ShieldCheck, title: t('best_prices'), desc: t('best_prices_desc'), color: 'secondary' },
              { icon: Clock, title: t('easy_payment'), desc: t('easy_payment_desc'), color: 'warning' },
            ].map((f, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`w-12 h-12 bg-${f.color}-50 rounded-xl flex items-center justify-center shrink-0`}>
                  <f.icon size={24} className={`text-${f.color}-600`} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">{f.title}</h3>
                  <p className="text-xs text-gray-400 mt-1">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display font-bold text-2xl md:text-3xl text-gray-900">{t('categories')}</h2>
            <p className="text-sm text-gray-400 mt-1">{t('browse_categories')}</p>
          </div>
          <Link to="/products" className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1">
            {t('view_all')}
            <ArrowRight size={16} className={isRTL ? 'rotate-180' : ''} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display font-bold text-2xl md:text-3xl text-gray-900">{t('featured_products')}</h2>
            <p className="text-sm text-gray-400 mt-1">{lang === 'ar' ? 'منتجات مختارة بعناية' : 'Handpicked products for you'}</p>
          </div>
          <Link to="/products" className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1">
            {t('view_all')}
            <ArrowRight size={16} className={isRTL ? 'rotate-180' : ''} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* CTA banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="relative overflow-hidden bg-gradient-to-r from-primary-600 to-primary-700 rounded-3xl p-8 md:p-12">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
          </div>
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-start">
              <h2 className="font-display font-bold text-2xl md:text-3xl text-white">
                {lang === 'ar' ? 'طلب خاص أو بقالة بالجملة؟' : 'Special order or wholesale?'}
              </h2>
              <p className="text-primary-100 mt-2">
                {lang === 'ar' ? 'تواصل معنا للحصول على عروض خاصة' : 'Contact us for special offers'}
              </p>
            </div>
            <a href="tel:0500000000" className="bg-white text-primary-700 font-bold px-8 py-3 rounded-xl hover:bg-primary-50 transition-colors whitespace-nowrap">
              {lang === 'ar' ? 'اتصل الآن' : 'Call Now'}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
