import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronLeft, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { getOrderStatusLabel, formatPrice, t as translate, type TranslationKey } from '@/i18n/translations';
import type { Order } from '@/types';
import Modal from '@/components/Modal';
import { EmptyState, LoadingScreen } from '@/components/States';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-warning-100 text-warning-700',
  confirmed: 'bg-primary-100 text-primary-700',
  preparing: 'bg-secondary-100 text-secondary-700',
  out_for_delivery: 'bg-accent-100 text-accent-700',
  delivered: 'bg-success-100 text-success-700',
  cancelled: 'bg-error-100 text-error-700',
};

export default function OrdersPage() {
  const { t, lang, isRTL } = useLanguage();
  const { session } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!session?.user?.id) return;
    (async () => {
      const { data } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
      setOrders(data as Order[] || []);
      setLoading(false);
    })();
  }, [session]);

  if (!session) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center animate-fade-in">
        <h2 className="font-display font-bold text-xl text-gray-900 mb-2">{t('please_login')}</h2>
        <Link to="/login" className="btn-primary inline-block mt-4">{t('login')}</Link>
      </div>
    );
  }

  if (loading) return <LoadingScreen />;

  if (orders.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in">
        <EmptyState
          title={t('no_orders')}
          description={lang === 'ar' ? 'لم تقم بأي طلبات بعد' : 'You have not placed any orders yet'}
          actionLabel={t('shop_now')}
          actionTo="/products"
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <h1 className="font-display font-bold text-2xl md:text-3xl text-gray-900 mb-6">{t('order_history')}</h1>

      <div className="space-y-3">
        {orders.map((order) => (
          <div key={order.id} className="card p-5 hover:shadow-md transition-shadow">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center">
                  <Package size={24} className="text-primary-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    {t('order_number')}: <span className="font-mono">{order.id.slice(0, 8).toUpperCase()}</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(order.created_at).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', {
                      year: 'numeric', month: 'long', day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`badge ${STATUS_COLORS[order.status] || STATUS_COLORS.pending}`}>
                  {getOrderStatusLabel(order.status, lang)}
                </span>
                <span className="font-bold text-primary-600">{formatPrice(order.total, lang)}</span>
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="btn-ghost text-sm"
                >
                  {t('view_details')}
                </button>
              </div>
            </div>

            {/* Items preview */}
            <div className="mt-3 pt-3 border-t border-gray-50 flex flex-wrap gap-2">
              {order.order_items?.slice(0, 3).map((item) => (
                <span key={item.id} className="text-xs bg-gray-50 text-gray-500 px-2.5 py-1 rounded-md">
                  {item.quantity}× {lang === 'ar' ? item.product_name_ar : item.product_name_en}
                </span>
              ))}
              {(order.order_items?.length || 0) > 3 && (
                <span className="text-xs text-gray-400 px-2 py-1">
                  +{(order.order_items?.length || 0) - 3} {t('items')}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Order detail modal */}
      <Modal
        open={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={t('order_items')}
      >
        {selectedOrder && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400">{t('order_number')}</p>
                <p className="font-mono font-semibold text-gray-900">{selectedOrder.id.slice(0, 8).toUpperCase()}</p>
              </div>
              <span className={`badge ${STATUS_COLORS[selectedOrder.status]}`}>
                {getOrderStatusLabel(selectedOrder.status, lang)}
              </span>
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-3">
              {selectedOrder.order_items?.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <div>
                    <p className="font-medium text-gray-900">
                      {lang === 'ar' ? item.product_name_ar : item.product_name_en}
                    </p>
                    <p className="text-xs text-gray-400">{item.quantity} × {formatPrice(item.unit_price, lang)}</p>
                  </div>
                  <p className="font-semibold text-gray-900">
                    {formatPrice(item.unit_price * item.quantity, lang)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">{t('address')}</span>
                <span className="text-gray-900 text-end max-w-[60%]">{selectedOrder.delivery_address}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">{t('phone_number')}</span>
                <span className="text-gray-900" dir="ltr">{selectedOrder.phone}</span>
              </div>
              {selectedOrder.notes && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{t('order_notes')}</span>
                  <span className="text-gray-900 text-end">{selectedOrder.notes}</span>
                </div>
              )}
              <div className="flex justify-between items-baseline pt-2 border-t border-gray-50">
                <span className="font-bold text-gray-900">{t('total')}</span>
                <span className="font-display font-bold text-xl text-primary-600">
                  {formatPrice(selectedOrder.total, lang)}
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
