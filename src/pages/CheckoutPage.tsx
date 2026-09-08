import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowLeft, Lock } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/Toast';
import { getProductName, getUnitLabel, formatPrice } from '@/i18n/translations';

const DELIVERY_FEE = 20;
const FREE_DELIVERY_THRESHOLD = 200;

export default function CheckoutPage() {
  const { t, lang, isRTL } = useLanguage();
  const { items, subtotal, clearCart } = useCart();
  const { session, profile } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState<string | null>(null);

  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const total = subtotal + deliveryFee;

  if (!session) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center animate-fade-in">
        <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock size={28} className="text-primary-600" />
        </div>
        <h2 className="font-display font-bold text-xl text-gray-900 mb-2">{t('please_login')}</h2>
        <Link to="/login" className="btn-primary inline-block mt-4">{t('login')}</Link>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center animate-fade-in">
        <div className="w-20 h-20 bg-success-50 rounded-full flex items-center justify-center mx-auto mb-4 animate-scale-in">
          <CheckCircle size={40} className="text-success-500" />
        </div>
        <h2 className="font-display font-bold text-2xl text-gray-900 mb-2">{t('order_placed')}</h2>
        <p className="text-gray-500 mb-1">{t('order_placed_desc')}</p>
        <p className="text-sm text-gray-400 mb-6">{t('order_number')}: <span className="font-mono font-semibold text-gray-700">{orderComplete.slice(0, 8).toUpperCase()}</span></p>
        <div className="flex gap-3 justify-center">
          <Link to="/orders" className="btn-primary">{t('orders')}</Link>
          <Link to="/" className="btn-secondary">{t('back_home')}</Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center animate-fade-in">
        <h2 className="font-display font-bold text-xl text-gray-900 mb-4">{t('empty_cart')}</h2>
        <Link to="/products" className="btn-primary">{t('continue_shopping')}</Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) return;

    setSubmitting(true);
    try {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: session.user.id,
          total,
          delivery_address: address,
          phone,
          notes: notes || null,
          status: 'pending',
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product.id,
        product_name_ar: item.product.name_ar,
        product_name_en: item.product.name_en,
        quantity: item.quantity,
        unit_price: item.product.price,
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;

      clearCart();
      setOrderComplete(order.id);
    } catch (err) {
      notify(lang === 'ar' ? 'حدث خطأ، حاول مرة أخرى' : 'An error occurred, please try again', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <Link to="/cart" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-primary-600 mb-4">
        <ArrowLeft size={16} className={isRTL ? 'rotate-180' : ''} />
        {t('shopping_cart')}
      </Link>

      <h1 className="font-display font-bold text-2xl md:text-3xl text-gray-900 mb-6">{t('checkout_title')}</h1>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
        {/* Delivery form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <h2 className="font-display font-bold text-lg text-gray-900 mb-4">{t('delivery_info')}</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">{t('full_name')}</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="input-field"
                  placeholder={lang === 'ar' ? 'الاسم الكامل' : 'Full name'}
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">{t('phone_number')}</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input-field"
                  placeholder="05xxxxxxxx"
                  dir="ltr"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">{t('address')}</label>
                <textarea
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                  className="input-field resize-none"
                  placeholder={lang === 'ar' ? 'الحي، الشارع، رقم المبنى، الشقة' : 'District, street, building number, apartment'}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">{t('order_notes')}</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="input-field resize-none"
                  placeholder={lang === 'ar' ? 'أي ملاحظات إضافية للتوصيل...' : 'Any additional delivery notes...'}
                />
              </div>
            </div>
          </div>

          {/* Order items list */}
          <div className="card p-6">
            <h2 className="font-display font-bold text-lg text-gray-900 mb-4">
              {t('order_items')} ({items.length})
            </h2>
            <div className="space-y-3">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex items-center gap-3 text-sm">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                    {product.image_url ? (
                      <img src={product.image_url} alt="" className="w-full h-full object-cover" />
                    ) : null}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 line-clamp-1">{getProductName(product, lang)}</p>
                    <p className="text-xs text-gray-400">{quantity} × {formatPrice(product.price, lang)}</p>
                  </div>
                  <p className="font-semibold text-gray-900 shrink-0">
                    {formatPrice(product.price * quantity, lang)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-28">
            <h2 className="font-display font-bold text-lg text-gray-900 mb-4">
              {lang === 'ar' ? 'ملخص الطلب' : 'Order Summary'}
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">{t('subtotal')}</span>
                <span className="font-semibold">{formatPrice(subtotal, lang)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">{t('delivery_fee')}</span>
                <span className={`font-semibold ${deliveryFee === 0 ? 'text-success-600' : ''}`}>
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

            <div className="mt-4 p-3 bg-warning-50 rounded-lg text-xs text-warning-700 flex items-start gap-2">
              <span>{lang === 'ar' ? 'الدفع نقداً عند الاستلام' : 'Cash on delivery'}</span>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full mt-6"
            >
              {submitting ? t('loading') : t('place_order')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
