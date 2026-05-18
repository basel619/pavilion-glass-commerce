# 🖥️ مشروع PAVILION - دليل تسليم الكود البرمجي والتفاصيل التقنية
# 🖥️ PAVILION Glass Commerce - Source Code & Technical Documentation

دليل تسليم متكامل ومنظم لمشروع متجر **PAVILION** الإلكتروني لبيع اللابتوبات وقطع الغيار الأصلية. تم إعداد هذا الملف لتسهيل تسليم الكود البرمجي (Source Code Handover) وفهم البنية الهيكلية بالكامل.

---

## 📂 1. البنية الهيكلية للمجلدات (Directory Structure)

```yaml
pavilion-glass-commerce/
├── src/                      # الكود المصدري للمشروع (Source Code)
│   ├── components/           # المكونات المشتركة (Layout, Sidebar, modals, drawers...)
│   ├── integrations/         # الربط مع الخدمات الخارجية (Supabase Client, Types)
│   ├── lib/                  # محركات إدارة الحالة واللغات (i18n, Zustand cart store)
│   ├── routes/               # مسارات وبنية صفحات الموقع (TanStack Router)
│   │   ├── admin.tsx         # لوحة التحكم الرئيسية بالكامل (Admin Panel Dashboard)
│   │   ├── index.tsx         # الصفحة الرئيسية للمتجر (Storefront Homepage with Banners)
│   │   └── product.$id.tsx   # صفحة تفاصيل المنتج وعملية الشراء (Product Details)
│   ├── styles.css            # ملف التنسيق الأساسي ونظام ألوان الثيمات (CSS Variables)
│   └── main.tsx              # نقطة انطلاق التطبيق البرمجية (Application Entrypoint)
├── public/                   # الملفات الثابتة والأيقونات العامة (Favicons, assets)
├── red/                      # مجلدات النشر للإنتاج (Production Site & Admin assets)
├── red_static/               # مجلد النشر الثابت المتوافق مع Netlify / Static hosting
├── supabase_schema.sql       # مخطط قاعدة البيانات بالكامل وجداول الـ SQL
├── vite.config.ts            # إعدادات مجمع Vite الأساسي للسيرفر
├── vite.spa.config.ts        # إعدادات مجمع Vite الخاص بتجميعة الـ SPA
└── wrangler.jsonc            # إعدادات النشر على Cloudflare Workers
```

---

## 🛠️ 2. التقنيات المستخدمة في المشروع (Technology Stack)

*   **Front-End Framework**: React 19 & TypeScript لضمان موثوقية عالية في الأنماط (Type Safety).
*   **Styling & Design System**: TailwindCSS v4 مدمج مع نظام ألوان متطور وVanilla CSS لدعم تأثيرات **الزجاج الشفاف (Glassmorphism)** الفاخرة وتدرجات الإضاءة الخلفية (Radial Gradients).
*   **Routing**: TanStack Router و TanStack Start لتقديم تجربة صفحات أحادية فائقة السرعة (Single Page Application).
*   **State Management**: Zustand لإدارة عربة التسوق وسلة المشتريات بشكل فوري وسلس جداً.
*   **Icons**: Lucide React لمجموعة الأيقونات العصرية والمتكاملة.
*   **Backend & DB**: Supabase (PostgreSQL) لإدارة البيانات بالكامل مع دعم التحديث والاشتراكات اللحظية الحية (Realtime Subscriptions).
*   **Production Deployment**: متوافق تماماً مع النشر على **Cloudflare Workers** للسرعة الفائقة، و **Netlify** للنشر الثابت.

---

## 🗄️ 3. مخطط قاعدة البيانات (Database Schema - PostgreSQL)

يحتوي ملف `supabase_schema.sql` في جذر المشروع على جداول قاعدة البيانات الكاملة المهيأة والمعدة للتشغيل الفوري:

### 1. جدول الأقسام (`categories`)
يخزن الأقسام الرئيسية للقطع واللابتوبات مع دعم اللغتين العربية والإنجليزية.
### 2. جدول الماركات التجارية (`brands`)
لتصنيف المنتجات حسب الشركة المصنعة (Dell, HP, Apple...).
### 3. جدول المنتجات (`products`)
يحتوي على كافة تفاصيل المنتجات، الأسعار الأساسية والمخفضة، الكميات المتوفرة، تقييمات المنتجات، الصور، والربط مع الأقسام.
### 4. جدول الطلبات (`orders`)
يسجل طلبات العملاء بالكامل وتفاصيل السلة الإجمالية، أرقام الهواتف، العناوين وحالة الطلب (pending, completed...).
### 5. جدول البنرات المتحركة (`banners`)
الجدول الجديد كلياً والمسؤول عن تغذية سلايدر الواجهة ديناميكياً:
```sql
CREATE TABLE banners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    title VARCHAR(255),
    link VARCHAR(255),
    image_url TEXT NOT NULL,
    active BOOLEAN DEFAULT TRUE NOT NULL,
    order_index INT DEFAULT 0 NOT NULL
);
```

---

## ✨ 4. أهم الميزات التي تم تطويرها وتسليمها (Key Features Implemented)

### 🚀 1. نظام البنرات الذكي (Banners Controller)
*   **السلايدر المتحرك في المتجر**: سلايدر ديناميكي سينمائي مدعوم بتأثير انتقال تلاشي (Cross-fade) مدته ثانية واحدة، مع زوم خلفي بطيء وتلقائي للصور. ينتقل تلقائياً كل 5 ثوانٍ ويدعم التنقل اليدوي واللمس.
*   **لوحة إدارة البنرات بالكامل**: تبويب كامل في لوحة تحكم الأدمن يسمح بإضافة وحذف وتعديل البنرات ورفع صورها فورياً مع تفعيل حظر الـ RLS وحفظ البيانات بدقة بالغة.

### 🎨 2. ثيم اللايت مود الفاخر (Soft-Lavender Light Mode)
*   دمج ثيم نهاري فائق الفخامة والجمال بلمسات اللافندر اللطيفة والخلفيات الزجاجية الشفافة المريحة للعين.
*   إضافة أزرار شمس/قمر تفاعلية في هيدر الموقع العام ولوحة الإدارة مع حفظ خيار المستخدم تلقائياً في الـ `localStorage`.

### 🔴 3. شعار سلة المشتريات الأحمر التفاعلي (Cart Red Badge)
*   إضافة شعار أحمر دائري متحرك (Bounce Animation) في زاوية زر عربة التسوق بالهيدر لتنبيه العميل بوجود منتجات في عربته وعددها، بحدود ديناميكية ذكية تتناسب مع الثيمين الداكن والفاتح.

---

## 💻 5. دليل التشغيل المحلي وبناء الإنتاج (Local Setup & Build Guide)

### أولاً: تثبيت الحزم والمكتبات
```bash
npm install
```

### ثانياً: تشغيل بيئة التطوير المحلية
1. **تشغيل واجهة المتجر للعملاء (على بورت 5500)**:
   ```bash
   npm run dev
   ```
2. **تشغيل لوحة تحكم الإدارة (على بورت 5501)**:
   ```bash
   npm run admin
   ```

### ثالثاً: بناء وتجميع الموقع للإنتاج (Vite SPA Compilation)
لبناء ملفات الإنتاج وتحديث المجلدات الثابتة قبل الرفع:
```bash
# 1. بناء الكود المصدري الـ SPA
npx vite build --config vite.spa.config.ts

# 2. بناء بيئة السيرفر والـ SSR الكامل
npm run build
```

---

## 🔒 6. حسابات الدخول الافتراضية للوحة التحكم (Default Admin Credentials)
*   **رابط لوحة التحكم**: [http://localhost:5501/admin](http://localhost:5501/admin)
*   **البريد الإلكتروني الماستر**: `admin@pavilion.com`
*   **كلمة المرور الافتراضية**: `pavilion2026`

---

> [!NOTE]
> هذا المشروع تم تجهيزه وتنسيقه بالكامل ليكون جاهزاً للنشر المباشر. جميع ملفات الـ Assets والتنسيقات مجمعة ومحدثة بدقة عالية ومرفوعة بالكامل على مستودع **GitHub** الخاص بك.
