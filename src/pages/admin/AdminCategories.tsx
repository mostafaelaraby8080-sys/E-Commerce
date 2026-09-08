import { useEffect, useState, useCallback } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/Toast';
import { getCategoryName } from '@/i18n/translations';
import type { Category } from '@/types';
import Modal from '@/components/Modal';
import { LoadingScreen, EmptyState } from '@/components/States';

interface FormData {
  name_ar: string;
  name_en: string;
  slug: string;
  icon: string;
  sort_order: string;
}

const emptyForm: FormData = { name_ar: '', name_en: '', slug: '', icon: 'Package', sort_order: '0' };

const ICON_OPTIONS = ['Package', 'Beef', 'Milk', 'Snowflake', 'Wheat', 'Droplet', 'Apple', 'Fish', 'Coffee', 'Cookie', 'Egg', 'Drumstick'];

export default function AdminCategories() {
  const { t, lang } = useLanguage();
  const { notify } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('categories').select('*').order('sort_order');
    setCategories(data as Category[] || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const openAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setModalOpen(true);
  };

  const openEdit = (cat: Category) => {
    setForm({
      name_ar: cat.name_ar,
      name_en: cat.name_en,
      slug: cat.slug,
      icon: cat.icon || 'Package',
      sort_order: cat.sort_order.toString(),
    });
    setEditingId(cat.id);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name_ar: form.name_ar,
        name_en: form.name_en,
        slug: form.slug,
        icon: form.icon,
        sort_order: parseInt(form.sort_order) || 0,
      };

      if (editingId) {
        const { error } = await supabase.from('categories').update(payload).eq('id', editingId);
        if (error) throw error;
        notify(lang === 'ar' ? 'تم تحديث الفئة' : 'Category updated');
      } else {
        const { error } = await supabase.from('categories').insert(payload);
        if (error) throw error;
        notify(lang === 'ar' ? 'تم إضافة الفئة' : 'Category added');
      }
      setModalOpen(false);
      await fetchCategories();
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
      const { error } = await supabase.from('categories').delete().eq('id', deleteId);
      if (error) throw error;
      notify(lang === 'ar' ? 'تم حذف الفئة' : 'Category deleted');
      setDeleteId(null);
      await fetchCategories();
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
      <div className="flex items-center justify-between">
        <h2 className="font-display font-bold text-xl text-gray-900">{t('manage_categories')}</h2>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={18} />
          {t('add_category')}
        </button>
      </div>

      {categories.length === 0 ? (
        <EmptyState title={t('no_products')} description={lang === 'ar' ? 'ابدأ بإضافة فئة' : 'Start by adding a category'} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div key={cat.id} className="card p-5 flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center">
                  <span className="text-primary-600 font-bold text-lg">{getCategoryName(cat, lang).charAt(0)}</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{getCategoryName(cat, lang)}</p>
                  <p className="text-xs text-gray-400 font-mono">{cat.slug}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(cat)} className="p-2 rounded-lg hover:bg-primary-50 text-primary-600">
                  <Pencil size={16} />
                </button>
                <button onClick={() => setDeleteId(cat.id)} className="p-2 rounded-lg hover:bg-error-50 text-error-500">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? t('edit_category') : t('add_category')}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">{t('category_name_ar')}</label>
            <input type="text" required value={form.name_ar} onChange={(e) => setForm({ ...form, name_ar: e.target.value })} className="input-field" dir="rtl" />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">{t('category_name_en')}</label>
            <input type="text" required value={form.name_en} onChange={(e) => setForm({ ...form, name_en: e.target.value })} className="input-field" dir="ltr" />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">{t('category_slug')}</label>
            <input type="text" required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="input-field font-mono" dir="ltr" placeholder="fresh-meat" />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">{t('category_icon')}</label>
            <select value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="input-field">
              {ICON_OPTIONS.map((icon) => (
                <option key={icon} value={icon}>{icon}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">{lang === 'ar' ? 'ترتيب العرض' : 'Sort Order'}</label>
            <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} className="input-field" dir="ltr" />
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-gray-50">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">{t('cancel')}</button>
            <button type="submit" disabled={saving} className="btn-primary">{saving ? t('loading') : t('save')}</button>
          </div>
        </form>
      </Modal>

      {/* Delete confirm */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title={t('confirm_delete')} size="sm">
        <p className="text-sm text-gray-600 mb-6">{t('confirm_delete')}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={() => setDeleteId(null)} className="btn-secondary">{t('cancel')}</button>
          <button onClick={handleDelete} disabled={saving} className="btn-danger">{saving ? t('loading') : t('delete')}</button>
        </div>
      </Modal>
    </div>
  );
}
