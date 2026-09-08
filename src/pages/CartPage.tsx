import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { getProductName, getUnitLabel, formatPrice } from '@/i18n/translations';
import { EmptyState } from '@/components/States';

const DELIVERY_FEE = 20;
const FREE_DELIVERY_THRESHOLD = 200;

export default function CartPage() {
  const { t, lang, isRTL } = useLanguage();
  const { items, updateQuantity, removeItem, subtotal } = useCart();

  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD || subtotal === 0 ? 0 : DELIVERY_FEE;
  const total = subtotal + deliveryFee;
  const amountToFreeDelivery = FREE_DELIVERY_THRESHOLD - subtotal;

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in">
        <EmptyState
          title={t('empty_cart')}
          description={t('empty_cart_desc')}
          actionLabel={t('continue_shopping')}
          actionTo="/products"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <h1 className="font-display font-bold text-2xl md:text-3xl text-gray-900 mb-6">
        {t('shopping_cart')}
        <span className="text-lg text-gray-400 font-normal ms-2">({items.length} {lang === 'ar' ? 'منتج' : 'items'})</span>
      </h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-3">
          {/* Free delivery progress */}
          {deliveryFee > 0 && (
            <div className="bg-secondary-50 border border-secondary-100 rounded-xl p-4 text-sm text-secondary-700">
              {lang === 'ar'
                ? `أضف ${formatPrice(amountToFreeDelivery, lang)} للحصول على توصيل مجاني!`
                : `Add ${formatPrice(amountToFreeDelivery, lang)} more for free delivery!`}
              <div className="mt-2 w-full bg-secondary-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-secondary-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100)}%` }}
                />
              </div>
            </div>
          )}

          {items.map(({ product, quantity }) => (
            <div key={product.id} className="card p-4 flex gap-4 items-center group">
              {/* Image */}
              <Link to={`/products/${product.id}`} className="shrink-0">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden bg-gray-100">
                  {product.image_url ? (
                    <img src={product.image_url} alt={getProductName(product, lang)} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <ShoppingBag size={24} />
                    </div>
                  )}
                </div>
              </Link>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <Link to={`/products/${product.id}`} className="font-semibold text-gray-900 text-sm line-clamp-1 hover:text-primary-600 transition-colors">
                  {getProductName(product, lang)}
                </Link>
                <p className="text-xs text-gray-400 mt-0.5">{formatPrice(product.price, lang)} / {getUnitLabel(product.unit, lang)}</p>

                {/* Quantity controls */}
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center border border-gray-200 rounded-lg">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-10 text-center text-sm font-semibold">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(product.id)}
                    className="text-gray-300 hover:text-error-500 transition-colors p-1"
                    aria-label={t('remove')}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Price */}
              <div className="text-end shrink-0">
                <p className="font-bold text-primary-600 text-lg">
                  {formatPrice(product.price * quantity, lang)}
                </p>
              </div>
            </div>
          ))}

          <Link to="/products" className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 mt-4">
            <ArrowLeft size={16} className={isRTL ? 'rotate-180' : ''} />
            {t('continue_shopping')}
          </Link>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-28">
            <h2 className="font-display font-bold text-lg text-gray-900 mb-4">
              {lang === 'ar' ? 'ملخص الطلب' : 'Order Summary'}
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">{t('subtotal')}</span>
                <span className="font-semibold text-gray-900">{formatPrice(subtotal, lang)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">{t('delivery_fee')}</span>
                <span className={`font-semibold ${deliveryFee === 0 ? 'text-success-600' : 'text-gray-900'}`}>
                  {deliveryFee === 0 ? t('free') : formatPrice(deliveryFee, lang)}
                </span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between items-baseline">
                <span className="font-bold text-gray-900">{t('total')}</span>
                <span className="font-display font-bold text-2xl text-primary-600">
                  {formatPrice(total, lang)}
                </span>
              </div>
            </div>

            <Link to="/checkout" className="btn-primary w-full text-center mt-6 block">
              {t('checkout')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
