import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';
import { getCategoryName } from '@/i18n/translations';
import type { Category, Product } from '@/types';
import ProductCard from '@/components/ProductCard';
import ProductCardSkeleton from '@/components/ProductCardSkeleton';
import { EmptyState } from '@/components/States';

type SortOption = 'default' | 'price_low' | 'price_high' | 'name';

export default function ProductsPage() {
  const { t, lang } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const selectedCategory = searchParams.get('category') || '';
  const searchQuery = searchParams.get('search') || '';
  const sort = (searchParams.get('sort') as SortOption) || 'default';

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data: cats } = await supabase.from('categories').select('*').order('sort_order');
      setCategories(cats as Category[] || []);

      let query = supabase.from('products').select('*, category:categories(*)').eq('is_active', true);

      if (selectedCategory) {
        const cat = cats?.find((c) => c.slug === selectedCategory);
        if (cat) query = query.eq('category_id', cat.id);
      }

      if (searchQuery) {
        query = query.or(`name_ar.ilike.%${searchQuery}%,name_en.ilike.%${searchQuery}%`);
      }

      const { data: prods } = await query;
      setProducts(prods as Product[] || []);
      setLoading(false);
    })();
  }, [selectedCategory, searchQuery]);

  const sortedProducts = useMemo(() => {
    if (!products.length) return [];
    const sorted = [...products];
    switch (sort) {
      case 'price_low':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        sorted.sort((a, b) =>
          lang === 'ar' ? a.name_ar.localeCompare(b.name_ar) : a.name_en.localeCompare(b.name_en)
        );
        break;
    }
    return sorted;
  }, [products, sort, lang]);

  const setFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    setSearchParams(params);
  };

  const activeCategoryName = categories.find((c) => c.slug === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="font-display font-bold text-2xl md:text-3xl text-gray-900">
          {activeCategoryName ? getCategoryName(activeCategoryName, lang) : t('all_products')}
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          {!loading && `${sortedProducts.length} ${t('results')}`}
        </p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar - desktop */}
        <aside className="hidden md:block w-64 shrink-0">
          <div className="card p-5 sticky top-28">
            <h3 className="font-semibold text-gray-900 mb-4 text-sm">{t('filter_by_category')}</h3>
            <div className="space-y-1">
              <button
                onClick={() => setFilter('category', '')}
                className={`w-full text-start px-3 py-2 rounded-lg text-sm transition-colors ${
                  !selectedCategory ? 'bg-primary-50 text-primary-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {t('all_products')}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setFilter('category', cat.slug)}
                  className={`w-full text-start px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedCategory === cat.slug ? 'bg-primary-50 text-primary-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {getCategoryName(cat, lang)}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="mt-6 pt-6 border-t border-gray-50">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">{t('sort_by')}</h3>
              <select
                value={sort}
                onChange={(e) => setFilter('sort', e.target.value)}
                className="input-field text-sm"
              >
                <option value="default">{lang === 'ar' ? 'افتراضي' : 'Default'}</option>
                <option value="price_low">{t('price_low_high')}</option>
                <option value="price_high">{t('price_high_low')}</option>
                <option value="name">{t('name_az')}</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Mobile filter bar */}
          <div className="md:hidden flex items-center gap-2 mb-4">
            <button
              onClick={() => setShowFilters(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700"
            >
              <SlidersHorizontal size={18} />
              {t('filter_by_category')}
            </button>
            <select
              value={sort}
              onChange={(e) => setFilter('sort', e.target.value)}
              className="input-field text-sm flex-1"
            >
              <option value="default">{lang === 'ar' ? 'افتراضي' : 'Default'}</option>
              <option value="price_low">{t('price_low_high')}</option>
              <option value="price_high">{t('price_high_low')}</option>
              <option value="name">{t('name_az')}</option>
            </select>
          </div>

          {/* Products grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : sortedProducts.length === 0 ? (
            <EmptyState
              title={t('no_products')}
              description={lang === 'ar' ? 'لم نجد منتجات مطابقة لبحثك' : 'No products match your search'}
              actionLabel={t('all_products')}
              actionTo="/products"
            />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {sortedProducts.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {showFilters && (
        <div className="fixed inset-0 z-50 md:hidden animate-fade-in">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowFilters(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">{t('filter_by_category')}</h3>
              <button onClick={() => setShowFilters(false)} className="p-2 rounded-lg hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-1">
              <button
                onClick={() => { setFilter('category', ''); setShowFilters(false); }}
                className={`w-full text-start px-3 py-2.5 rounded-lg text-sm ${!selectedCategory ? 'bg-primary-50 text-primary-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                {t('all_products')}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { setFilter('category', cat.slug); setShowFilters(false); }}
                  className={`w-full text-start px-3 py-2.5 rounded-lg text-sm ${selectedCategory === cat.slug ? 'bg-primary-50 text-primary-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  {getCategoryName(cat, lang)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
