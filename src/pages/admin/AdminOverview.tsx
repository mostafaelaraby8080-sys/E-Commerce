import { useEffect, useState } from 'react';
import { Package, ShoppingCart, TrendingUp, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';
import { getOrderStatusLabel, formatPrice } from '@/i18n/translations';
import type { Order } from '@/types';
import { LoadingScreen } from '@/components/States';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-warning-100 text-warning-700',
  confirmed: 'bg-primary-100 text-primary-700',
  preparing: 'bg-secondary-100 text-secondary-700',
  out_for_delivery: 'bg-accent-100 text-accent-700',
  delivered: 'bg-success-100 text-success-700',
  cancelled: 'bg-error-100 text-error-700',
};

export default function AdminOverview() {
  const { t, lang, isRTL } = useLanguage();
  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, totalProducts: 0, pendingOrders: 0 });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [ordersRes, productsRes, pendingRes] = await Promise.all([
        supabase.from('orders').select('total, status, created_at, id, user_id').order('created_at', { ascending: false }).limit(5),
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      ]);

      const orders = (ordersRes.data || []) as Order[];
      const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);

      // Fetch profile names for recent orders
      const userIds = [...new Set(orders.map((o) => o.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', userIds);

      const ordersWithProfiles = orders.map((o) => ({
        ...o,
        profile: profiles?.find((p) => p.id === o.user_id) as Order['profile'],
      }));

      // Get total orders count separately
      const { count: totalOrdersCount } = await supabase
        .from('orders')
        .select('id', { count: 'exact', head: true });

      setStats({
        totalOrders: totalOrdersCount || 0,
        totalRevenue,
        totalProducts: productsRes.count || 0,
        pendingOrders: pendingRes.count || 0,
      });
      setRecentOrders(ordersWithProfiles);
      setLoading(false);
    })();
  }, []);

  if (loading) return <LoadingScreen />;

  const statCards = [
    { label: t('total_orders'), value: stats.totalOrders.toString(), icon: ShoppingCart, color: 'primary' },
    { label: t('total_revenue'), value: formatPrice(stats.totalRevenue, lang), icon: TrendingUp, color: 'success' },
    { label: t('total_products'), value: stats.totalProducts.toString(), icon: Package, color: 'secondary' },
    { label: t('pending_orders'), value: stats.pendingOrders.toString(), icon: Clock, color: 'warning' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <div key={i} className="card p-5">
            <div className={`w-10 h-10 bg-${stat.color}-50 rounded-xl flex items-center justify-center mb-3`}>
              <stat.icon size={20} className={`text-${stat.color}-600`} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-lg text-gray-900">{t('recent_orders')}</h2>
          <Link to="/admin/orders" className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1">
            {t('view_all')}
            <ArrowRight size={14} className={isRTL ? 'rotate-180' : ''} />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">{t('no_orders')}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-start text-xs text-gray-400 border-b border-gray-50">
                  <th className="pb-3 text-start font-medium">{t('order_number')}</th>
                  <th className="pb-3 text-start font-medium">{t('customer')}</th>
                  <th className="pb-3 text-start font-medium">{t('order_status')}</th>
                  <th className="pb-3 text-end font-medium">{t('order_total')}</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-50 last:border-0">
                    <td className="py-3 font-mono text-xs text-gray-700">
                      {order.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="py-3 text-gray-600">
                      {order.profile?.full_name || '—'}
                    </td>
                    <td className="py-3">
                      <span className={`badge ${STATUS_COLORS[order.status]}`}>
                        {getOrderStatusLabel(order.status, lang)}
                      </span>
                    </td>
                    <td className="py-3 text-end font-semibold text-gray-900">
                      {formatPrice(order.total, lang)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
