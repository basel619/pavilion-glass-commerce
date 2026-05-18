# 💻 دليل مشروع Pavilion Glass Commerce المتكامل (PROJECT.md)
# 💻 Comprehensive Pavilion Glass Commerce Project Guide (PROJECT.md)

مرحباً بك في الدليل الشامل والكامل لمشروع متجر **PAVILION** الفاخر لأجهزة اللابتوب وقطع الغيار الأصلية. يوضح هذا الملف جميع تفاصيل الواجهة الخلفية، الأمامية، قواعد البيانات، الثيمات، وملفات التكوين.

---

## 📂 1. هيكلية المجلدات الرئيسية (Project Directory Structure)

*   `src/`: يحتوي على الكود المصدري بالكامل لـ React و TypeScript.
    *   `src/components/`: المكونات المشتركة والواجهات العامة (Layouts, Cart, Modal).
    *   `src/routes/`: المسارات التفاعلية للموقع (الرئيسية، المتجر، صفحة المنتج، لوحة التحكم).
    *   `src/integrations/`: التكامل البرمجي مع الخدمات الخارجية (Supabase).
    *   `src/lib/`: المكتبات المساعدة مثل سلة المشتريات (`cart.ts`)، اللغات (`i18n.ts`).
    *   `src/styles.css`: ملف التنسيق الأساسي ونظام ألوان الثيمات.
*   `red/`: مجلدات الأصول الناتجة للنشر السريع:
    *   `red/site/`: واجهة المتجر للمستخدمين.
    *   `red/admin/`: لوحة تحكم الإدارة.
*   `red_static/`: النسخة الثابتة المتكاملة المجهزة للنشر على Netlify/Vercel.
*   `dist-spa/`: نواتج تجميع تطبيق الـ SPA العميل.
*   `supabase_schema.sql`: ملف إنشاء جداول قاعدة البيانات والسياسات البرمجية.

---

## 🌐 2. موقع المستخدمين والواجهة الرئيسية (Storefront / User App)

*   **رابط التشغيل المحلي**: [http://localhost:5500](http://localhost:5500)
*   **الملف الرئيسي للمسار**: [src/routes/index.tsx](file:///c:/Users/IRAQ%20SOFT/Desktop/webclass/pavilion-glass-commerce/src/routes/index.tsx)
*   **المكونات التفاعلية الرئيسية**:
    *   **السلايدر المتحرك (Banners Slider)**: سلايدر ديناميكي سينمائي يجلب البنرات النشطة من جدول `banners` تلقائياً مع تأثير انتقال Cross-fade ناعم وحركة تكبير سينمائية طفيفة.
    *   **زر السلة الذكي (ShoppingCart Button)**: يحتوي على شعار أحمر (Red Badge) تفاعلي يهتز برقة (Bounce Animation) بمجرد إضافة أي قطعة جديدة للسلة لعرض إجمالي الكمية تلقائياً.
    *   **زر تبديل الثيمات**: شمس/قمر في أعلى اليمين للتبديل الفوري بين ثيم اللافندر والوضع المظلم.

---

## 💼 3. لوحة تحكم الإدارة (Admin Panel / Dashboard)

*   **رابط التشغيل المحلي**: [http://localhost:5501/admin](http://localhost:5501/admin)
*   **الملف الرئيسي للمسار**: [src/routes/admin.tsx](file:///c:/Users/IRAQ%20SOFT/Desktop/webclass/pavilion-glass-commerce/src/routes/admin.tsx)
*   **بيانات الدخول الافتراضية (Master Credentials)**:
    *   **البريد الإلكتروني**: `admin@pavilion.com`
    *   **كلمة السر**: `pavilion2026`
*   **أقسام لوحة التحكم (Dashboard Tabs)**:
    1.  **نظرة عامة (Overview)**: إحصائيات فورية للمنتجات، المبيعات، والزيارات.
    2.  **البنرات المتحركة (Banners CRUD)**: واجهة لإضافة وحذف وتعديل البنرات مع رفع فوري للصور إلى حاوية التخزين ومزامنة حية ولحظية مع الواجهة الرئيسية للعملاء.
    3.  **المنتجات (Products)**: التحكم الكامل بأسعار اللابتوبات والقطع، الصور، الكميات المتاحة، والماركات.
    4.  **الطلبات (Orders)**: تتبع طلبات العملاء بترميز لوني وحالة الطلب (قيد الانتظار، تم التوصيل، ملغي).
    5.  **الأقسام والماركات (Categories & Brands)**: تصنيف المنتجات بشكل شجري وأنيق.

---

## 🗄️ 4. هيكلية قاعدة البيانات والتخزين (Supabase DB Schema)

تدار البيانات عبر Supabase بجدول خالي من قيود RLS المعقدة لتسهيل التطوير السريع:
*   `categories`: جداول التصنيفات (`name_ar`, `name_en`, `image`).
*   `products`: جداول المنتجات والمخزون والتقييمات والماركات.
*   `orders`: طلبات العملاء وحالتها ومجموع المبيعات وسجل الهاتف والعنوان.
*   `banners`: جدول البنرات المتحركة الفاخرة الجديد:
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

## 🎨 5. نظام الثيمات المتقدم (Dynamic Theme System)

تم دمج نظام الألوان في ملف التنسيق الرئيسي [src/styles.css](file:///c:/Users/IRAQ%20SOFT/Desktop/webclass/pavilion-glass-commerce/src/styles.css):
*   **الوضع الداكن (Dark Mode)**: يعتمد على تدرجات الكحلي الفخم المخملي اللامع مع حواف نيلي متوهجة.
*   **الوضع الفاتح (Lavender Light Mode)**: يعتمد على خلفيات اللافندر المطفأ الفائق الجمال والراحة للعين مع نصوص نيلي داكنة وجدران بطاقات بيضاء زجاجية لؤلؤية رائعة.
*   **التحكم بالثيم**:
    *   يتم تفعيل الثيم بإضافة كلاس `.light` أو `.dark` إلى عنصر الـ `<html>`.
    *   يتم تخزين اختيار المستخدم محلياً (`localStorage.getItem("theme")`) لضمان تفعيله تلقائياً في الزيارات القادمة.

---

## 🔑 6. ملف الإعدادات والبيئات (.env File)

يجب إنشاء ملف باسم `.env` في المجلد الرئيسي للمشروع لربط الواجهة الأمامية والخلفية بخدمات Supabase:

```env
# ─── SUPABASE API CONFIGURATION ──────────────────────────────────
# رابط مشروع سوبابايس الخاص بك
VITE_SUPABASE_URL="https://lfjsophdrgxytibojyow.supabase.co"

# المفتاح العام للمشروع (آمن للاستخدام بالمتصفح)
VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmanNvcGhkcmd4eXRpYm9qeW93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2ODA3NjEsImV4cCI6MjA5NDI1Njc2MX0.vdDjqt8sPopbjVNIWyKDV14kzPa037JYgm2xPlRi2e8"

# مفتاح النشر العام المكرر
VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmanNvcGhkcmd4eXRpYm9qeW93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2ODA3NjEsImV4cCI6MjA5NDI1Njc2MX0.vdDjqt8sPopbjVNIWyKDV14kzPa037JYgm2xPlRi2e8"

# روابط السيرفر الخلفي
SUPABASE_URL="https://lfjsophdrgxytibojyow.supabase.co"
SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmanNvcGhkcmd4eXRpYm9qeW93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2ODA3NjEsImV4cCI6MjA5NDI1Njc2MX0.vdDjqt8sPopbjVNIWyKDV14kzPa037JYgm2xPlRi2e8"

# ⚠️ مفتاح الصلاحيات المطلقة (لا تشاركه أبداً - يُستخدم في سكربتات التطوير فقط وتخطي الـ RLS)
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmanNvcGhkcmd4eXRpYm9qeW93Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODY4MDc2MSwiZXhwIjoyMDk0MjU2NzYxfQ.wi353AOVZT8p4Bh-8TZIQMtHvvRT_nCV3qZnH_nFbIU"

# معرف المشروع على سوبابايس
VITE_SUPABASE_PROJECT_ID="lfjsophdrgxytibojyow"
```

---

## 🛠️ 7. أوامر التطوير والبناء والنشر (Deployment Guide)

### 💻 التشغيل المحلي للتطوير:
1.  تشغيل متجر المستخدمين على بورت 5500:
    ```bash
    npm run dev
    ```
2.  تشغيل لوحة التحكم على بورت 5501:
    ```bash
    npm run admin
    ```

### 📦 البناء والنشر النهائي:
1.  **بناء نسخة الـ SPA الكاملة**:
    ```bash
    npx vite build --config vite.spa.config.ts
    ```
2.  **تحديث مجلدات النشر الثابتة**:
    يتم نقل محتويات مجلد `dist-spa/assets` و `dist-spa/index.html` تلقائياً لمجلدات النشر:
    *   `red/site`
    *   `red/admin`
    *   `red_static`
3.  **النشر على خوادم Cloudflare Workers**:
    يتم البناء الخلفي عبر:
    ```bash
    npm run build
    ```
    ويُنشر السيرفر والواجهة بالاعتماد على تكوين `wrangler.jsonc` المرفق مع المشروع.

---

هذا الملف جاهز ومنظم بالكامل ليكون دليلك الأساسي لإدارة وتحديث متجر Pavilion المتطور! 🚀
