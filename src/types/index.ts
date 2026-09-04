export type Role = 'user' | 'admin';

export type Language = 'ar' | 'en';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export type ProductUnit = 'kg' | 'piece' | 'pack' | 'liter' | 'box';

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  role: Role;
  created_at: string;
}

export interface Category {
  id: string;
  name_ar: string;
  name_en: string;
  slug: string;
  icon: string | null;
  sort_order: number;
}

export interface Product {
  id: string;
  category_id: string | null;
  name_ar: string;
  name_en: string;
  description_ar: string | null;
  description_en: string | null;
  price: number;
  unit: ProductUnit;
  image_url: string | null;
  stock: number;
  is_active: boolean;
  created_at: string;
  category?: Category;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name_ar: string | null;
  product_name_en: string | null;
  quantity: number;
  unit_price: number;
}

export interface Order {
  id: string;
  user_id: string;
  status: OrderStatus;
  total: number;
  delivery_address: string;
  phone: string;
  notes: string | null;
  created_at: string;
  order_items?: OrderItem[];
  profile?: Profile;
}
