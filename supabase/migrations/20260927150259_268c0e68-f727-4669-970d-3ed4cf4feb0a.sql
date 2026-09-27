CREATE TABLE public.products (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), slug text NOT NULL UNIQUE, name text NOT NULL, description text NOT NULL, category text NOT NULL, price integer NOT NULL CHECK (price > 0), color text NOT NULL CHECK (color IN ('Black','White')), sizes text[] NOT NULL, stock integer NOT NULL DEFAULT 0 CHECK (stock >= 0), featured boolean NOT NULL DEFAULT false, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT ON public.products TO anon, authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can browse products" ON public.products FOR SELECT TO anon, authenticated USING (true);
CREATE TABLE public.cart_items (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL, product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE, size text NOT NULL, quantity integer NOT NULL DEFAULT 1 CHECK (quantity BETWEEN 1 AND 10), created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), UNIQUE (user_id, product_id, size));
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cart_items TO authenticated;
GRANT ALL ON public.cart_items TO service_role;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Shoppers view own cart" ON public.cart_items FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Shoppers add to own cart" ON public.cart_items FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() AND EXISTS (SELECT 1 FROM public.products p WHERE p.id = product_id AND size = ANY(p.sizes) AND p.stock > 0));
CREATE POLICY "Shoppers update own cart" ON public.cart_items FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid() AND EXISTS (SELECT 1 FROM public.products p WHERE p.id = product_id AND size = ANY(p.sizes) AND p.stock > 0));
CREATE POLICY "Shoppers remove own cart" ON public.cart_items FOR DELETE TO authenticated USING (user_id = auth.uid());
CREATE TABLE public.saved_items (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL, product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), UNIQUE (user_id, product_id));
GRANT SELECT, INSERT, UPDATE, DELETE ON public.saved_items TO authenticated;
GRANT ALL ON public.saved_items TO service_role;
ALTER TABLE public.saved_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Shoppers view own saved items" ON public.saved_items FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Shoppers save own items" ON public.saved_items FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Shoppers remove own saved items" ON public.saved_items FOR DELETE TO authenticated USING (user_id = auth.uid());
CREATE OR REPLACE FUNCTION public.touch_updated_at() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END $$;
CREATE TRIGGER touch_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER touch_cart_items_updated_at BEFORE UPDATE ON public.cart_items FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER touch_saved_items_updated_at BEFORE UPDATE ON public.saved_items FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
INSERT INTO public.products (slug,name,description,category,price,color,sizes,stock,featured) VALUES
('the-form-blazer','The Form Blazer','An oversized silhouette, precisely cut. A study in modern tailoring.','Tailoring',28500,'Black',ARRAY['XS','S','M','L'],12,true),
('the-volume-dress','The Volume Dress','A light, architectural shape with movement in every detail.','Dresses',24000,'White',ARRAY['XS','S','M','L'],9,true),
('the-atelier-trench','The Atelier Trench','A timeless outer layer with a quietly commanding presence.','Outerwear',42000,'Black',ARRAY['XS','S','M','L'],7,true),
('the-everyday-shirt','The Everyday Shirt','An elevated essential in crisp cotton, considered from every angle.','Tops',13500,'White',ARRAY['XS','S','M','L','XL'],18,false),
('the-column-dress','The Column Dress','Understated evening dressing, expressed in a single clean line.','Dresses',26000,'Black',ARRAY['XS','S','M','L'],10,false),
('the-wide-leg-trouser','The Wide-Leg Trouser','Fluid tailoring with a refined, effortless drape.','Tailoring',19500,'White',ARRAY['XS','S','M','L','XL'],14,false);