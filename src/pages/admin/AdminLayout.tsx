import { useEffect, useState } from 'react';
import { Link, NavLink, Navigate, Outlet } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Tags, Beef } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingScreen } from '@/components/States';

export default function AdminLayout() {
  const { t, lang } = useLanguage();
  const { profile, isAdmin, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (!profile || !isAdmin) return <Navigate to="/" replace />;

  const navItems = [
    { to: '/admin', label: t('overview'), icon: LayoutDashboard, end: true },
    { to: '/admin/products', label: t('manage_products'), icon: Package },
    { to: '/admin/orders', label: t('manage_orders'), icon: ShoppingCart },
    { to: '/admin/categories', label: t('manage_categories'), icon: Tags },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg">
          <Beef size={24} className="text-white" />
        </div>
        <div>
          <h1 className="font-display font-bold text-2xl text-gray-900">{t('dashboard')}</h1>
          <p className="text-sm text-gray-400">{t('hero_title')} — {lang === 'ar' ? 'لوحة الإدارة' : 'Admin Panel'}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-[220px_1fr] gap-6">
        {/* Sidebar */}
        <aside>
          <div className="card p-3 sticky top-28">
            <nav className="space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`
                  }
                >
                  <item.icon size={18} />
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </aside>

        {/* Content */}
        <div className="min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
