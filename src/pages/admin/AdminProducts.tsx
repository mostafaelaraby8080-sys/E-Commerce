import { useEffect, useState, useCallback } from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/Toast';
import { getProductName, formatPrice } from '@/i18n/translations';
import type { Product, Category } from '@/types';
import Modal from '@/components/Modal';
import { LoadingScreen, EmptyState } from '@/components/States';

interface FormData {
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  price: string;
  unit: string;
  image_url: string;
  stock: string;
  category_id: string;
  is_active: boolean;
}

const emptyForm: FormData = {
  name_ar: '', name_en: '', description_ar: '', description_en: '',
  price: '', unit: 'kg', image_url: '', stock: '', category_id: '', is_active: true,
};

export default function AdminProducts() {
  const { t, lang, isRTL } = useLanguage();
  const { notify } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('products')
      .select('*, category:categories(*)')
      .order('created_at', { ascending: false });
    setProducts(data as Product[] || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    (async () => {
      await fetchProducts();
      const { data: cats } = await supabase.from('categories').select('*').order('sort_order');
      setCategories(cats as Category[] || []);
    })();
  }, [fetchProducts]);

  const filtered = products.filter((p) =>
    p.name_ar.includes(search) || p.name_en.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setModalOpen(true);
  };

  const openEdit = (product: Product) => {
    setForm({
      name_ar: product.name_ar,
      name_en: product.name_en,
      description_ar: product.description_ar || '',
      description_en: product.description_en || '',
      price: product.price.toString(),
      unit: product.unit,
      image_url: product.image_url || '',
      stock: product.stock.toString(),
      category_id: product.category_id || '',
      is_active: product.is_active,
    });
    setEditingId(product.id);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      name_ar: form.name_ar,
      name_en: form.name_en,
      description_ar: form.description_ar || null,
      description_en: form.description_en || null,
      price: parseFloat(form.price) || 0,
      unit: form.unit,
      image_url: form.image_url || null,
      stock: parseInt(form.stock) || 0,
      category_id: form.category_id || null,
      is_active: form.is_active,
    };

    try {
      if (editingId) {
        const { error } = await supabase.from('products').update(payload).eq('id', editingId);
        if (error) throw error;
        notify(lang === 'ar' ? 'تم تحديث المنتج' : 'Product updated');
      } else {
        const { error } = await supabase.from('products').insert(payload);
        if (error) throw error;
        notify(lang === 'ar' ? 'تم إضافة المنتج' : 'Product added');
      }
      setModalOpen(false);
      await fetchProducts();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t('error_occurred');
      notify(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setSaving(true);
    try {
      const { error } = await supabase.from('products').delete().eq('id', deleteId);
      if (error) throw error;
      notify(lang === 'ar' ? 'تم حذف المنتج' : 'Product deleted');
      setDeleteId(null);
      await fetchProducts();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t('error_occurred');
      notify(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display font-bold text-xl text-gray-900">{t('manage_products')}</h2>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={18} />
          {t('add_product')}
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('search')}
          className={`input-field text-sm ${isRTL ? 'pr-10' : 'pl-10'}`}
        />
      </div>

      {/* Products table */}
      {filtered.length === 0 ? (
        <EmptyState
          title={t('no_products')}
          description={lang === 'ar' ? 'ابدأ بإضافة منتج جديد' : 'Start by adding a new product'}
        />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50/50">
                <tr className="text-xs text-gray-400">
                  <th className="px-4 py-3 text-start font-medium">{lang === 'ar' ? 'المنتج' : 'Product'}</th>
                  <th className="px-4 py-3 text-start font-medium">{t('price')}</th>
                  <th className="px-4 py-3 text-start font-medium">{t('stock_qty')}</th>
                  <th className="px-4 py-3 text-start font-medium">{t('active')}</th>
                  <th className="px-4 py-3 text-end font-medium">{lang === 'ar' ? 'إجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => (
                  <tr key={product.id} className="border-t border-gray-50 hover:bg-gray-50/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                          {product.image_url && (
                            <img src={product.image_url} alt="" className="w-full h-full object-cover" />
                          )}
                        </div>
                        <span className="font-medium text-gray-900 line-clamp-1">{getProductName(product, lang)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-700">{formatPrice(product.price, lang)}</td>
                    <td className="px-4 py-3 text-gray-600">{product.stock}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${product.is_active ? 'bg-success-100 text-success-700' : 'bg-gray-100 text-gray-500'}`}>
                        {product.is_active ? t('active') : lang === 'ar' ? 'مخفي' : 'Hidden'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(product)} className="p-2 rounded-lg hover:bg-primary-50 text-primary-600 transition-colors">
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => setDeleteId(product.id)} className="p-2 rounded-lg hover:bg-error-50 text-error-500 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? t('edit_product') : t('add_product')} size="lg">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">{t('product_name_ar')}</label>
              <input type="text" required value={form.name_ar} onChange={(e) => setForm({ ...form, name_ar: e.target.value })} className="input-field" dir="rtl" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">{t('product_name_en')}</label>
              <input type="text" required value={form.name_en} onChange={(e) => setForm({ ...form, name_en: e.target.value })} className="input-field" dir="ltr" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">{t('product_desc_ar')}</label>
              <textarea value={form.description_ar} onChange={(e) => setForm({ ...form, description_ar: e.target.value })} rows={2} className="input-field resize-none" dir="rtl" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">{t('product_desc_en')}</label>
              <textarea value={form.description_en} onChange={(e) => setForm({ ...form, description_en: e.target.value })} rows={2} className="input-field resize-none" dir="ltr" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">{t('price')}</label>
              <input type="number" step="0.01" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input-field" dir="ltr" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">{t('category')}</label>
              <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="input-field">
                <option value="">—</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{lang === 'ar' ? c.name_ar : c.name_en}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">{lang === 'ar' ? 'الوحدة' : 'Unit'}</label>
              <select value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} className="input-field">
                <option value="kg">{lang === 'ar' ? 'كجم' : 'kg'}</option>
                <option value="piece">{lang === 'ar' ? 'قطعة' : 'piece'}</option>
                <option value="pack">{lang === 'ar' ? 'علبة' : 'pack'}</option>
                <option value="liter">{lang === 'ar' ? 'لتر' : 'liter'}</option>
                <option value="box">{lang === 'ar' ? 'صندوق' : 'box'}</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">{t('stock_qty')}</label>
              <input type="number" required value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="input-field" dir="ltr" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">{t('product_image')}</label>
              <input type="url" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="input-field" dir="ltr" placeholder="https://..." />
            </div>
            <div className="sm:col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="w-5 h-5 rounded accent-primary-600" />
                <span className="text-sm font-semibold text-gray-700">{t('active')}</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-gray-50">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">{t('cancel')}</button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? t('loading') : t('save')}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete confirm */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title={t('confirm_delete')} size="sm">
        <p className="text-sm text-gray-600 mb-6">{t('confirm_delete')}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={() => setDeleteId(null)} className="btn-secondary">{t('cancel')}</button>
          <button onClick={handleDelete} disabled={saving} className="btn-danger">
            {saving ? t('loading') : t('delete')}
          </button>
        </div>
      </Modal>
    </div>
  );
}
