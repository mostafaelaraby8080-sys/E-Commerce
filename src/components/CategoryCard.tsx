import { Link } from 'react-router-dom';
import type { Category } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { getCategoryName } from '@/i18n/translations';
import * as Icons from 'lucide-react';

export default function CategoryCard({ category }: { category: Category }) {
  const { lang } = useLanguage();
  const IconComponent = (Icons[category.icon as keyof typeof Icons] || Icons.Package) as React.ComponentType<{ size?: number; className?: string }>;

  return (
    <Link
      to={`/products?category=${category.slug}`}
      className="card group hover:shadow-xl hover:shadow-primary-100/50 hover:-translate-y-1 p-6 flex flex-col items-center text-center"
    >
      <div className="w-16 h-16 bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl flex items-center justify-center mb-3 group-hover:from-primary-400 group-hover:to-primary-600 transition-all duration-300">
        <IconComponent size={28} className="text-primary-600 group-hover:text-white transition-colors" />
      </div>
      <h3 className="font-semibold text-gray-900 text-sm group-hover:text-primary-600 transition-colors">
        {getCategoryName(category, lang)}
      </h3>
      <p className="text-xs text-gray-400 mt-1">
        {lang === 'ar' ? 'تصفح المنتجات' : 'Browse products'}
      </p>
    </Link>
  );
}
