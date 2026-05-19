import { create } from "zustand";
import { supabase } from "@/integrations/supabase/client";

export interface Product {
  id: string;
  name_ar: string;
  name_en: string;
  sku: string | null;
  image: string | null;
  regular_price: number;
  sale_price: number | null;
  stock: number;
  in_stock: boolean;
  rating: number | null;
  description_ar: string | null;
  description_en: string | null;
  category_id: string | null;
  brand_id: string | null;
  created_at?: string;
}

export interface BrandOpt {
  id: string;
  name_ar: string;
  name_en: string;
  parent_id?: string | null;
  image?: string | null;
}

export interface CatOpt {
  id: string;
  name_ar: string;
  name_en: string;
  image?: string | null;
}

export interface Banner {
  id: string;
  title: string | null;
  image_url: string;
  link: string | null;
  order_index: number;
  active: boolean;
  created_at?: string;
}

interface DataStore {
  products: Product[];
  brands: BrandOpt[];
  categories: CatOpt[];
  banners: Banner[];
  loaded: boolean;
  loading: boolean;
  error: string | null;
  fetchData: (force?: boolean) => Promise<void>;
}

export const useDataStore = create<DataStore>((set, get) => ({
  products: [],
  brands: [],
  categories: [],
  banners: [],
  loaded: false,
  loading: false,
  error: null,
  fetchData: async (force = false) => {
    if (get().loaded && !force && !get().loading) return;
    set({ loading: true, error: null });
    try {
      const [p, b, c, bn] = await Promise.all([
        supabase.from("products").select("*").order("created_at", { ascending: false }),
        supabase.from("brands").select("*").order("name_en"),
        supabase.from("categories").select("*").order("name_en"),
        supabase.from("banners").select("*").eq("active", true).order("order_index", { ascending: true })
      ]);

      const prods = (p.data ?? []).map(x => ({
        ...x,
        regular_price: Number(x.regular_price) || 0,
        sale_price: x.sale_price ? (Number(x.sale_price) || null) : null
      })) as Product[];

      set({
        products: prods,
        brands: (b.data ?? []) as BrandOpt[],
        categories: (c.data ?? []) as CatOpt[],
        banners: (bn.data ?? []) as Banner[],
        loaded: true,
        loading: false
      });
    } catch (err: any) {
      console.error("Data store fetch error:", err);
      set({ error: err.message || "Failed to load data", loading: false });
    }
  }
}));
