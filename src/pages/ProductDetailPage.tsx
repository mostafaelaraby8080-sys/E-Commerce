import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Check, Minus, Plus, ChevronLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import {
  getProductName,
  getProductDescription,
  getCategoryName,
  getUnitLabel,
  formatPrice,
} from '@/i18n/translations';
import type { Product, Category } from '@/types';
import ProductCard from '@/components/ProductCard';
import { LoadingScreen, ErrorState } from '@/components/States';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, lang, isRTL } = useLanguage();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(false);
      const { data, error: err } = await supabase
        .from('products')
        .select('*, category:categories(*)')
        .eq('id', id!)
        .maybeSingle();

      if (err || !data) {
        setError(true);
        setLoading(false);
        return;
      }

      setProduct(data as Product);

      if (data?.category_id) {
        const { data: rel } = await supabase
          .from('products')
          .select('*, category:categories(*)')
          .eq('is_active', true)
          .eq('category_id', data.category_id)
          .neq('id', id!)
          .limit(4);
        setRelated(rel as Product[] || []);
      }

      setLoading(false);
    })();
  }, [id]);

  const handleAddToCart = () => {
    if (!product || product.stock <= 0) return;
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  if (loading) return <LoadingScreen />;
  if (error || !product) return <ErrorState onRetry={() => navigate('/products')} />;

  const inStock = product.stock > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-gray-400 mb-6">
        <Link to="/" className="hover:text-primary-600">{t('home')}</Link>
        <ChevronLeft size={14} className={isRTL ? 'rotate-180' : ''} />
        <Link to="/products" className="hover:text-primary-600">{t('products')}</Link>
        {product.category && (
          <>
            <ChevronLeft size={14} className={isRTL ? 'rotate-180' : ''} />
            <Link to={`/products?category=${product.category.slug}`} className="hover:text-primary-600">
              {getCategoryName(product.category as Category, lang)}
            </Link>
          </>
        )}
      </nav>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Image */}
        <div className="relative">
          <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 shadow-lg">
            {product.image_url ? (
              <img src={product.image_url} alt={getProductName(product, lang)} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                <ShoppingCart size={64} />
              </div>
            )}
          </div>
          {!inStock && (
            <div className="absolute top-4 left-4 badge bg-error-500 text-white text-sm">
              {t('out_of_stock')}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col">
          {product.category && (
            <Link
              to={`/products?category=${product.category.slug}`}
              className="text-sm font-semibold text-primary-600 hover:text-primary-700 mb-2"
            >
              {getCategoryName(product.category as Category, lang)}
            </Link>
          )}

          <h1 className="font-display font-bold text-2xl md:text-3xl text-gray-900 leading-tight">
            {getProductName(product, lang)}
          </h1>

          <p className="text-gray-500 mt-3 leading-relaxed">
            {getProductDescription(product, lang)}
          </p>

          {/* Price */}
          <div className="mt-6 p-5 bg-primary-50/50 rounded-2xl border border-primary-100">
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-primary-600">
                {formatPrice(product.price, lang)}
              </span>
              <span className="text-sm text-gray-400 mb-1">/ {getUnitLabel(product.unit, lang)}</span>
            </div>
            <p className={`text-sm mt-1 ${inStock ? 'text-success-600' : 'text-error-500'}`}>
              {inStock ? `${t('in_stock')} (${product.stock})` : t('out_of_stock')}
            </p>
          </div>

          {/* Quantity selector */}
          {inStock && (
            <div className="mt-6">
              <label className="text-sm font-semibold text-gray-700 mb-2 block">{t('quantity')}</label>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-600"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="w-16 text-center font-bold text-lg text-gray-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-12 h-12 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-600"
                  >
                    <Plus size={18} />
                  </button>
                </div>
                <span className="text-sm text-gray-400">
                  {formatPrice(product.price * quantity, lang)}
                </span>
              </div>
            </div>
          )}

          {/* Add to cart */}
          <div className="mt-8 flex gap-3">
            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              className={`flex-1 flex items-center justify-center gap-2 font-semibold px-6 py-4 rounded-xl transition-all active:scale-95
                ${added
                  ? 'bg-success-500 text-white'
                  : inStock
                    ? 'btn-primary'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
            >
              {added ? (
                <><Check size={20} /> {t('added')}</>
              ) : (
                <><ShoppingCart size={20} /> {t('add_to_cart')}</>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display font-bold text-xl md:text-2xl text-gray-900 mb-6">
            {t('related_products')}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
