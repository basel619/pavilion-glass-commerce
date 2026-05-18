-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Categories Table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    image TEXT
);

-- 3. Create Brands Table (Optional but used in admin)
CREATE TABLE brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL
);

-- 4. Create Products Table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    sku TEXT,
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    description_ar TEXT,
    description_en TEXT,
    regular_price NUMERIC NOT NULL DEFAULT 0,
    sale_price NUMERIC,
    stock INTEGER NOT NULL DEFAULT 0,
    in_stock BOOLEAN NOT NULL DEFAULT true,
    rating NUMERIC DEFAULT 5.0,
    image TEXT,
    gallery TEXT[],
    tags TEXT[],
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    brand_id UUID REFERENCES brands(id) ON DELETE SET NULL,
    model_id UUID
);

-- 5. Create Orders Table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_address TEXT,
    source TEXT DEFAULT 'website',
    notes TEXT,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    total NUMERIC NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'pending'
);

-- 6. Create Visits Table (Analytics)
CREATE TABLE visits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    path TEXT NOT NULL
);

-- 7. Disable Row Level Security (RLS) for public access (Since we manage auth via the custom admin login currently)
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE brands DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE visits DISABLE ROW LEVEL SECURITY;

-- 8. Create Banners Table
CREATE TABLE banners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    title VARCHAR(255),
    link VARCHAR(255),
    image_url TEXT NOT NULL,
    active BOOLEAN DEFAULT TRUE NOT NULL,
    order_index INT DEFAULT 0 NOT NULL
);

ALTER TABLE banners DISABLE ROW LEVEL SECURITY;

