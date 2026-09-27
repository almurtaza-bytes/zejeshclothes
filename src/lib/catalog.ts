import blazer from '@/assets/product-blazer.jpg';
import dress from '@/assets/product-dress.jpg';
import trench from '@/assets/product-trench.jpg';
import shirt from '@/assets/product-shirt.jpg';
import column from '@/assets/product-column.jpg';
import trousers from '@/assets/product-trousers.jpg';
import { supabase } from '@/integrations/supabase/client';

export type Product = {
  id: string; slug: string; name: string; description: string; category: string;
  price: number; color: string; sizes: string[]; stock: number; featured: boolean;
};
export const productImages: Record<string, string> = {
  'the-form-blazer': blazer, 'the-volume-dress': dress, 'the-atelier-trench': trench,
  'the-everyday-shirt': shirt, 'the-column-dress': column, 'the-wide-leg-trouser': trousers,
};
export const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;
export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase.from('products').select('id,slug,name,description,category,price,color,sizes,stock,featured').order('created_at');
  if (error) throw error;
  return data ?? [];
}
