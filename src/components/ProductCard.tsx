import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Check } from 'lucide-react';
import type { Product } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { getProductName, getProductDescription, getUnitLabel, formatPrice } from '@/i18n/translations';

export default function ProductCard({ product }: { product: Product }) {
  const { lang } = useLanguage();
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock <= 0) return;
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const inStock = product.stock > 0;

  return (
    <Link
      to={`/products/${product.id}`}
      className="card group hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1 overflow-hidden flex flex-col"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={getProductName(product, lang)}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <ShoppingCart size={48} />
          </div>
        )}
        {/* Stock badge */}
        {!inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="badge bg-error-500 text-white">{lang === 'ar' ? 'غير متوفر' : 'Out of Stock'}</span>
          </div>
        )}
        {inStock && product.stock <= 10 && (
          <div className={`absolute top-2 ${lang === 'ar' ? 'right-2' : 'left-2'}`}>
            <span className="badge bg-warning-500 text-white">
              {lang === 'ar' ? `باقي ${product.stock}` : `Only ${product.stock}`}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-primary-600 transition-colors">
          {getProductName(product, lang)}
        </h3>
        <p className="text-xs text-gray-400 mt-1 line-clamp-1 flex-1">
          {getProductDescription(product, lang)}
        </p>

        <div className="flex items-end justify-between mt-3">
          <div>
            <p className="text-lg font-bold text-primary-600">
              {formatPrice(product.price, lang)}
            </p>
            <p className="text-xs text-gray-400">
              / {getUnitLabel(product.unit, lang)}
            </p>
          </div>
          <button
            onClick={handleAdd}
            disabled={!inStock}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-90
              ${added
                ? 'bg-success-500 text-white'
                : inStock
                  ? 'bg-primary-50 text-primary-600 hover:bg-primary-600 hover:text-white'
                  : 'bg-gray-100 text-gray-300 cursor-not-allowed'
              }`}
            aria-label={lang === 'ar' ? 'أضف للسلة' : 'Add to cart'}
          >
            {added ? <Check size={18} /> : <ShoppingCart size={18} />}
          </button>
        </div>
      </div>
    </Link>
  );
}
