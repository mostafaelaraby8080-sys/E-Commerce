import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/Toast';
import { getOrderStatusLabel, formatPrice } from '@/i18n/translations';
import type { Order, OrderStatus, Profile } from '@/types';
import Modal from '@/components/Modal';
import { LoadingScreen, EmptyState } from '@/components/States';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-warning-100 text-warning-700',
  confirmed: 'bg-primary-100 text-primary-700',
  preparing: 'bg-secondary-100 text-secondary-700',
  out_for_delivery: 'bg-accent-100 text-accent-700',
  delivered: 'bg-success-100 text-success-700',
  cancelled: 'bg-error-100 text-error-700',
};

const ORDER_STATUSES: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];

export default function AdminOrders() {
  const { t, lang } = useLanguage();
  const { notify } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updating, setUpdating] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('');

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false });

    if (filterStatus) {
      query = query.eq('status', filterStatus);
    }

    const { data } = await query;
    const ordersData = (data || []) as Order[];

    // Fetch profiles
    const userIds = [...new Set(ordersData.map((o) => o.user_id))];
    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, phone')
        .in('id', userIds);
      const profileMap = new Map<string, Profile>();
      (profiles || []).forEach((p) => profileMap.set((p as Profile).id, p as Profile));
      ordersData.forEach((o) => {
        o.profile = profileMap.get(o.user_id);
      });
    }

    setOrders(ordersData);
    setLoading(false);
  }, [filterStatus]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    setUpdating(true);
    try {
      const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
      if (error) throw error;
      notify(lang === 'ar' ? 'تم تحديث الحالة' : 'Status updated');
      setSelectedOrder(null);
      await fetchOrders();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t('error_occurred');
      notify(msg, 'error');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="space-y-4 animate-fade-in">
      <h2 className="font-display font-bold text-xl text-gray-900">{t('manage_orders')}</h2>

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilterStatus('')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            !filterStatus ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          {t('all_products')}
        </button>
        {ORDER_STATUSES.map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === status ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {getOrderStatusLabel(status, lang)}
          </button>
        ))}
      </div>

      {orders.length === 0 ? (
        <EmptyState title={t('no_orders')} description={lang === 'ar' ? 'لا توجد طلبات' : 'No orders found'} />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50/50">
                <tr className="text-xs text-gray-400">
                  <th className="px-4 py-3 text-start font-medium">{t('order_number')}</th>
                  <th className="px-4 py-3 text-start font-medium">{t('customer')}</th>
                  <th className="px-4 py-3 text-start font-medium">{t('order_date')}</th>
                  <th className="px-4 py-3 text-start font-medium">{t('order_status')}</th>
                  <th className="px-4 py-3 text-end font-medium">{t('order_total')}</th>
                  <th className="px-4 py-3 text-end font-medium">{lang === 'ar' ? 'إجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-t border-gray-50 hover:bg-gray-50/30">
                    <td className="px-4 py-3 font-mono text-xs text-gray-700">
                      {order.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      <div>
                        <p className="font-medium">{order.profile?.full_name || '—'}</p>
                        <p className="text-xs text-gray-400" dir="ltr">{order.phone}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(order.created_at).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge ${STATUS_COLORS[order.status]}`}>
                        {getOrderStatusLabel(order.status, lang)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-end font-semibold text-gray-900">
                      {formatPrice(order.total, lang)}
                    </td>
                    <td className="px-4 py-3 text-end">
                      <button onClick={() => setSelectedOrder(order)} className="btn-ghost text-sm">
                        {t('view_details')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order detail modal */}
      <Modal
        open={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={t('order_items')}
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-4">
            {/* Order info */}
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-gray-400">{t('order_number')}</p>
                <p className="font-mono font-semibold text-gray-900">{selectedOrder.id.slice(0, 8).toUpperCase()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">{t('customer')}</p>
                <p className="font-semibold text-gray-900">{selectedOrder.profile?.full_name || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">{t('phone_number')}</p>
                <p className="text-gray-900" dir="ltr">{selectedOrder.phone}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">{t('order_date')}</p>
                <p className="text-gray-900">{new Date(selectedOrder.created_at).toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US')}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs text-gray-400">{t('address')}</p>
                <p className="text-gray-900">{selectedOrder.delivery_address}</p>
              </div>
              {selectedOrder.notes && (
                <div className="sm:col-span-2">
                  <p className="text-xs text-gray-400">{t('order_notes')}</p>
                  <p className="text-gray-900">{selectedOrder.notes}</p>
                </div>
              )}
            </div>

            {/* Items */}
            <div className="border-t border-gray-100 pt-4">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">{t('order_items')}</h3>
              <div className="space-y-2">
                {selectedOrder.order_items?.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-sm py-2">
                    <div>
                      <p className="font-medium text-gray-900">{lang === 'ar' ? item.product_name_ar : item.product_name_en}</p>
                      <p className="text-xs text-gray-400">{item.quantity} × {formatPrice(item.unit_price, lang)}</p>
                    </div>
                    <p className="font-semibold text-gray-900">{formatPrice(item.unit_price * item.quantity, lang)}</p>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-baseline pt-3 border-t border-gray-50 mt-3">
                <span className="font-bold text-gray-900">{t('total')}</span>
                <span className="font-display font-bold text-xl text-primary-600">{formatPrice(selectedOrder.total, lang)}</span>
              </div>
            </div>

            {/* Status update */}
            <div className="border-t border-gray-100 pt-4">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">{t('update_status')}</h3>
              <div className="flex flex-wrap gap-2">
                {ORDER_STATUSES.map((status) => (
                  <button
                    key={status}
                    onClick={() => updateStatus(selectedOrder.id, status)}
                    disabled={updating || selectedOrder.status === status}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      selectedOrder.status === status
                        ? STATUS_COLORS[status] + ' ring-2 ring-offset-1 ring-current'
                        : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                    } ${updating ? 'opacity-50' : ''}`}
                  >
                    {getOrderStatusLabel(status, lang)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
