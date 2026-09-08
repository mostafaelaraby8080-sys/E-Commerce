# حتة الجبن | Hata El Jibna — Grocery & Meat Store

متجر إلكتروني متكامل للحوم البقر والبقالة، يدعم اللغتين العربية والإنجليزية (RTL/LTR).

A full-stack bilingual (Arabic/English) grocery and meat e-commerce platform with RTL/LTR support.

## الميزات | Features

- **ثنائي اللغة (عربي/إنجليزي)** مع دعم كامل لـ RTL/LTR
- **صفحة رئيسية** مع عرض الفئات والمنتجات المميزة
- **تصفح المنتجات** مع البحث والتصفية حسب الفئة والترتيب
- **صفحة تفاصيل المنتج** مع منتجات ذات صلة
- **سلة تسوق** مع حساب التوصيل التلقائي
- **إتمام الطلب** مع حفظ بيانات التوصيل
- **سجل الطلبات** مع تتبع الحالة
- **تسجيل دخول/إنشاء حساب** مع أدوار (مستخدم/مشرف)
- **لوحة تحكم المشرف**:
  - نظرة عامة على الإحصائيات
  - إدارة المنتجات (إضافة/تعديل/حذف)
  - إدارة الطلبات وتحديث الحالة
  - إدارة الفئات

## التقنيات | Tech Stack

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend/Database**: Supabase (PostgreSQL) with Row Level Security
- **Auth**: Supabase Auth (email/password)
- **Icons**: Lucide React
- **Routing**: React Router

## التشغيل المحلي | Local Setup

```bash
# تثبيت الحزم | Install dependencies
npm install

# تشغيل بيئة التطوير | Run dev server
npm run dev

# بناء المشروع | Build for production
npm run build

# فحص الأنواع | Type check
npm run typecheck
```

## متغيرات البيئة | Environment Variables

انسخ `.env.example` إلى `.env` واملأ القيم:

Copy `.env.example` to `.env` and fill in your Supabase credentials:

```
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## هيكل المشروع | Project Structure

```
src/
├── components/       # المكونات المشتركة | Shared components
├── contexts/         # سياق React | React contexts (Auth, Cart, Language)
├── i18n/             # الترجمات | Translations (AR/EN)
├── lib/              # إعداد Supabase | Supabase client
├── pages/            # الصفحات | Pages
│   └── admin/        # لوحة التحكم | Admin panel
└── types/            # أنواع TypeScript | TypeScript types
```

## قاعدة البيانات | Database

يستخدم المشروع Supabase (PostgreSQL) مع الجداول التالية:

- `profiles` — ملفات المستخدمين مع الأدوار
- `categories` — فئات المنتجات
- `products` — المنتجات
- `orders` — الطلبات
- `order_items` — عناصر الطلب

جميع الجداول مفعّل عليها Row Level Security (RLS).

## رفع المشروع على GitHub | Deploying to GitHub

1. لا ترفع ملف `.env` — تأكد أنه في `.gitignore`
2. استخدم رسائل commit واضحة مثل: `feat: add shopping cart` أو `fix: update product schema`

## الرخصة | License

MIT
