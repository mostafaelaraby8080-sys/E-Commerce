import type { Language } from '@/types';

export const translations = {
  // Navigation
  home: { ar: 'الرئيسية', en: 'Home' },
  products: { ar: 'المنتجات', en: 'Products' },
  categories: { ar: 'الفئات', en: 'Categories' },
  cart: { ar: 'السلة', en: 'Cart' },
  orders: { ar: 'طلباتي', en: 'My Orders' },
  admin: { ar: 'لوحة التحكم', en: 'Dashboard' },
  login: { ar: 'تسجيل الدخول', en: 'Login' },
  register: { ar: 'إنشاء حساب', en: 'Sign Up' },
  logout: { ar: 'تسجيل الخروج', en: 'Logout' },
  search: { ar: 'بحث...', en: 'Search...' },
  profile: { ar: 'الملف الشخصي', en: 'Profile' },

  // Home page
  hero_title: { ar: 'حتة الجبن', en: 'Hata El Jibna' },
  hero_subtitle: {
    ar: 'أجود أنواع اللحوم والبقالة الطازجة توصل إلى باب بيتك',
    en: 'Finest meats and fresh groceries delivered to your door',
  },
  shop_now: { ar: 'تسوق الآن', en: 'Shop Now' },
  browse_categories: { ar: 'تصفح الفئات', en: 'Browse Categories' },
  featured_products: { ar: 'منتجات مميزة', en: 'Featured Products' },
  view_all: { ar: 'عرض الكل', en: 'View All' },
  why_us: { ar: 'لماذا تختارنا؟', en: 'Why Choose Us?' },
  fast_delivery: { ar: 'توصيل سريع', en: 'Fast Delivery' },
  fast_delivery_desc: {
    ar: 'توصيل خلال ساعتين داخل المدينة',
    en: 'Delivery within 2 hours inside the city',
  },
  fresh_quality: { ar: 'جودة طازجة', en: 'Fresh Quality' },
  fresh_quality_desc: {
    ar: 'منتجات طازجة يومياً من مزارع موثوقة',
    en: 'Daily fresh products from trusted farms',
  },
  best_prices: { ar: 'أفضل الأسعار', en: 'Best Prices' },
  best_prices_desc: {
    ar: 'أسعار تنافسية مع عروض أسبوعية',
    en: 'Competitive prices with weekly offers',
  },
  easy_payment: { ar: 'دفع سهل', en: 'Easy Payment' },
  easy_payment_desc: {
    ar: 'ادفع نقداً عند الاستلام أو إلكترونياً',
    en: 'Cash on delivery or online payment',
  },

  // Product listing
  all_products: { ar: 'كل المنتجات', en: 'All Products' },
  filter_by_category: { ar: 'تصفية حسب الفئة', en: 'Filter by Category' },
  sort_by: { ar: 'ترتيب حسب', en: 'Sort By' },
  price_low_high: { ar: 'السعر: الأقل أولاً', en: 'Price: Low to High' },
  price_high_low: { ar: 'السعر: الأعلى أولاً', en: 'Price: High to Low' },
  name_az: { ar: 'الاسم: أبجدياً', en: 'Name: A-Z' },
  no_products: { ar: 'لا توجد منتجات', en: 'No products found' },
  results: { ar: 'نتيجة', en: 'results' },
  in_stock: { ar: 'متوفر', en: 'In Stock' },
  out_of_stock: { ar: 'غير متوفر', en: 'Out of Stock' },
  add_to_cart: { ar: 'أضف للسلة', en: 'Add to Cart' },
  added: { ar: 'تمت الإضافة', en: 'Added' },

  // Product detail
  description: { ar: 'الوصف', en: 'Description' },
  quantity: { ar: 'الكمية', en: 'Quantity' },
  category: { ar: 'الفئة', en: 'Category' },
  related_products: { ar: 'منتجات ذات صلة', en: 'Related Products' },

  // Cart
  shopping_cart: { ar: 'سلة التسوق', en: 'Shopping Cart' },
  empty_cart: { ar: 'سلتك فارغة', en: 'Your cart is empty' },
  empty_cart_desc: {
    ar: 'ابدأ التسوق وأضف منتجات إلى سلتك',
    en: 'Start shopping and add products to your cart',
  },
  continue_shopping: { ar: 'متابعة التسوق', en: 'Continue Shopping' },
  subtotal: { ar: 'المجموع الفرعي', en: 'Subtotal' },
  delivery_fee: { ar: 'رسوم التوصيل', en: 'Delivery Fee' },
  total: { ar: 'الإجمالي', en: 'Total' },
  checkout: { ar: 'إتمام الطلب', en: 'Checkout' },
  remove: { ar: 'حذف', en: 'Remove' },
  free: { ar: 'مجاني', en: 'Free' },

  // Checkout
  checkout_title: { ar: 'إتمام الطلب', en: 'Checkout' },
  delivery_info: { ar: 'معلومات التوصيل', en: 'Delivery Information' },
  full_name: { ar: 'الاسم الكامل', en: 'Full Name' },
  phone_number: { ar: 'رقم الهاتف', en: 'Phone Number' },
  address: { ar: 'عنوان التوصيل', en: 'Delivery Address' },
  order_notes: { ar: 'ملاحظات الطلب (اختياري)', en: 'Order Notes (Optional)' },
  place_order: { ar: 'تأكيد الطلب', en: 'Place Order' },
  order_placed: { ar: 'تم تأكيد طلبك!', en: 'Order Placed Successfully!' },
  order_placed_desc: {
    ar: 'سنتواصل معك قريباً لتأكيد التوصيل',
    en: 'We will contact you soon to confirm delivery',
  },
  order_number: { ar: 'رقم الطلب', en: 'Order Number' },
  back_home: { ar: 'العودة للرئيسية', en: 'Back to Home' },
  please_login: {
    ar: 'يرجى تسجيل الدخول لإتمام الطلب',
    en: 'Please login to checkout',
  },

  // Auth
  email: { ar: 'البريد الإلكتروني', en: 'Email' },
  password: { ar: 'كلمة المرور', en: 'Password' },
  confirm_password: { ar: 'تأكيد كلمة المرور', en: 'Confirm Password' },
  login_title: { ar: 'تسجيل الدخول', en: 'Login' },
  register_title: { ar: 'إنشاء حساب جديد', en: 'Create Account' },
  no_account: { ar: 'ليس لديك حساب؟', en: "Don't have an account?" },
  have_account: { ar: 'لديك حساب؟', en: 'Already have an account?' },
  login_button: { ar: 'دخول', en: 'Sign In' },
  register_button: { ar: 'إنشاء', en: 'Sign Up' },
  login_error: { ar: 'البريد أو كلمة المرور غير صحيحة', en: 'Invalid email or password' },
  register_success: {
    ar: 'تم إنشاء الحساب بنجاح',
    en: 'Account created successfully',
  },

  // Orders
  order_history: { ar: 'سجل الطلبات', en: 'Order History' },
  order_date: { ar: 'تاريخ الطلب', en: 'Order Date' },
  order_status: { ar: 'حالة الطلب', en: 'Order Status' },
  order_total: { ar: 'إجمالي الطلب', en: 'Order Total' },
  view_details: { ar: 'عرض التفاصيل', en: 'View Details' },
  no_orders: { ar: 'لا توجد طلبات بعد', en: 'No orders yet' },
  order_items: { ar: 'منتجات الطلب', en: 'Order Items' },

  // Order statuses
  status_pending: { ar: 'قيد الانتظار', en: 'Pending' },
  status_confirmed: { ar: 'مؤكد', en: 'Confirmed' },
  status_preparing: { ar: 'قيد التحضير', en: 'Preparing' },
  status_out_for_delivery: { ar: 'في الطريق', en: 'Out for Delivery' },
  status_delivered: { ar: 'تم التوصيل', en: 'Delivered' },
  status_cancelled: { ar: 'ملغي', en: 'Cancelled' },

  // Admin
  dashboard: { ar: 'لوحة التحكم', en: 'Dashboard' },
  overview: { ar: 'نظرة عامة', en: 'Overview' },
  manage_products: { ar: 'إدارة المنتجات', en: 'Manage Products' },
  manage_orders: { ar: 'إدارة الطلبات', en: 'Manage Orders' },
  manage_categories: { ar: 'إدارة الفئات', en: 'Manage Categories' },
  add_product: { ar: 'إضافة منتج', en: 'Add Product' },
  edit_product: { ar: 'تعديل منتج', en: 'Edit Product' },
  product_name_ar: { ar: 'اسم المنتج (عربي)', en: 'Product Name (Arabic)' },
  product_name_en: { ar: 'اسم المنتج (إنجليزي)', en: 'Product Name (English)' },
  product_desc_ar: { ar: 'الوصف (عربي)', en: 'Description (Arabic)' },
  product_desc_en: { ar: 'الوصف (إنجليزي)', en: 'Description (English)' },
  price: { ar: 'السعر', en: 'Price' },
  stock_qty: { ar: 'الكمية المتوفرة', en: 'Stock Quantity' },
  product_image: { ar: 'رابط الصورة', en: 'Image URL' },
  active: { ar: 'نشط', en: 'Active' },
  save: { ar: 'حفظ', en: 'Save' },
  cancel: { ar: 'إلغاء', en: 'Cancel' },
  edit: { ar: 'تعديل', en: 'Edit' },
  delete: { ar: 'حذف', en: 'Delete' },
  confirm_delete: { ar: 'هل أنت متأكد من الحذف؟', en: 'Are you sure you want to delete?' },
  total_orders: { ar: 'إجمالي الطلبات', en: 'Total Orders' },
  total_revenue: { ar: 'إجمالي المبيعات', en: 'Total Revenue' },
  total_products: { ar: 'عدد المنتجات', en: 'Total Products' },
  pending_orders: { ar: 'طلبات قيد الانتظار', en: 'Pending Orders' },
  recent_orders: { ar: 'أحدث الطلبات', en: 'Recent Orders' },
  customer: { ar: 'العميل', en: 'Customer' },
  update_status: { ar: 'تحديث الحالة', en: 'Update Status' },
  no_access: { ar: 'لا تملك صلاحية الوصول', en: 'Access Denied' },
  add_category: { ar: 'إضافة فئة', en: 'Add Category' },
  edit_category: { ar: 'تعديل فئة', en: 'Edit Category' },
  category_name_ar: { ar: 'اسم الفئة (عربي)', en: 'Category Name (Arabic)' },
  category_name_en: { ar: 'اسم الفئة (إنجليزي)', en: 'Category Name (English)' },
  category_slug: { ar: 'المعرف', en: 'Slug' },
  category_icon: { ar: 'الأيقونة', en: 'Icon' },

  // Units
  unit_kg: { ar: 'كجم', en: 'kg' },
  unit_piece: { ar: 'قطعة', en: 'piece' },
  unit_pack: { ar: 'علبة', en: 'pack' },
  unit_liter: { ar: 'لتر', en: 'liter' },
  unit_box: { ar: 'صندوق', en: 'box' },

  // Misc
  currency: { ar: 'ر.س', en: 'SAR' },
  loading: { ar: 'جاري التحميل...', en: 'Loading...' },
  error_occurred: { ar: 'حدث خطأ', en: 'An error occurred' },
  retry: { ar: 'إعادة المحاولة', en: 'Retry' },
  page_not_found: { ar: 'الصفحة غير موجودة', en: 'Page Not Found' },
  go_home: { ar: 'العودة للرئيسية', en: 'Go Home' },
  items: { ar: 'منتجات', en: 'items' },
  item: { ar: 'منتج', en: 'item' },
} as const;

export type TranslationKey = keyof typeof translations;

export function t(key: TranslationKey, lang: Language): string {
  const entry = translations[key];
  if (!entry) return key;
  return entry[lang];
}

export function getProductName(
  product: { name_ar: string; name_en: string },
  lang: Language
): string {
  return lang === 'ar' ? product.name_ar : product.name_en;
}

export function getProductDescription(
  product: { description_ar: string | null; description_en: string | null },
  lang: Language
): string {
  const desc = lang === 'ar' ? product.description_ar : product.description_en;
  return desc || '';
}

export function getCategoryName(
  category: { name_ar: string; name_en: string },
  lang: Language
): string {
  return lang === 'ar' ? category.name_ar : category.name_en;
}

export function getUnitLabel(unit: string, lang: Language): string {
  const unitMap: Record<string, TranslationKey> = {
    kg: 'unit_kg',
    piece: 'unit_piece',
    pack: 'unit_pack',
    liter: 'unit_liter',
    box: 'unit_box',
  };
  const key = unitMap[unit] || 'unit_piece';
  return t(key, lang);
}

export function getOrderStatusLabel(status: string, lang: Language): string {
  const statusMap: Record<string, TranslationKey> = {
    pending: 'status_pending',
    confirmed: 'status_confirmed',
    preparing: 'status_preparing',
    out_for_delivery: 'status_out_for_delivery',
    delivered: 'status_delivered',
    cancelled: 'status_cancelled',
  };
  const key = statusMap[status] || 'status_pending';
  return t(key, lang);
}

export function formatPrice(price: number, lang: Language): string {
  const formatted = price.toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return `${formatted} ${t('currency', lang)}`;
}
