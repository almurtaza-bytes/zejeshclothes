import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

type CartItem = { id: string; product_id: string; size: string; quantity: number };
type ShopContext = {
  user: User | null; authReady: boolean; cart: CartItem[]; saved: string[];
  addToCart: (productId: string, size: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  toggleSaved: (productId: string) => Promise<void>;
  refresh: () => Promise<void>;
  cartOpen: boolean; setCartOpen: (open: boolean) => void;
};
const Context = createContext<ShopContext | null>(null);
export function useShop() {
  const context = useContext(Context);
  if (!context) throw new Error('Shop provider missing');
  return context;
}
export function ShopProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [saved, setSaved] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const refresh = useCallback(async () => {
    const { data: { user: current } } = await supabase.auth.getUser();
    setUser(current);
    setAuthReady(true);
    if (!current) { setCart([]); setSaved([]); return; }
    const [cartResult, savedResult] = await Promise.all([
      supabase.from('cart_items').select('id,product_id,size,quantity').eq('user_id', current.id).order('created_at'),
      supabase.from('saved_items').select('product_id').eq('user_id', current.id),
    ]);
    if (cartResult.error) throw cartResult.error;
    if (savedResult.error) throw savedResult.error;
    setCart(cartResult.data ?? []);
    setSaved((savedResult.data ?? []).map(item => item.product_id));
  }, []);
  useEffect(() => {
    void refresh().catch(console.error);
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => { setTimeout(() => { void refresh().catch(console.error); }, 0); });
    return () => subscription.unsubscribe();
  }, [refresh]);
  async function addToCart(productId: string, size: string) {
    if (!user) throw new Error('Sign in to add pieces to your bag.');
    const existing = cart.find(item => item.product_id === productId && item.size === size);
    const result = existing
      ? await supabase.from('cart_items').update({ quantity: Math.min(10, existing.quantity + 1) }).eq('id', existing.id)
      : await supabase.from('cart_items').insert({ user_id: user.id, product_id: productId, size, quantity: 1 });
    if (result.error) throw result.error;
    await refresh();
    setCartOpen(true);
  }
  async function updateQuantity(id: string, quantity: number) {
    const result = quantity <= 0
      ? await supabase.from('cart_items').delete().eq('id', id)
      : await supabase.from('cart_items').update({ quantity: Math.min(10, quantity) }).eq('id', id);
    if (result.error) throw result.error;
    await refresh();
  }
  async function toggleSaved(productId: string) {
    if (!user) throw new Error('Sign in to save pieces.');
    const result = saved.includes(productId)
      ? await supabase.from('saved_items').delete().eq('user_id', user.id).eq('product_id', productId)
      : await supabase.from('saved_items').insert({ user_id: user.id, product_id: productId });
    if (result.error) throw result.error;
    await refresh();
  }
  return <Context.Provider value={{ user, authReady, cart, saved, addToCart, updateQuantity, toggleSaved, refresh, cartOpen, setCartOpen }}>{children}</Context.Provider>;
}
