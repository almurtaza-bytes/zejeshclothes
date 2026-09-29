import { Link, useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { Heart, Search, ShoppingBag, UserRound, Menu, ArrowUpRight, Minus, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { getProducts, productImages, formatPrice, type Product } from '@/lib/catalog';
import { useShop } from '@/lib/shop-context';

export function Header() {
  const { user, saved, cart, cartOpen, setCartOpen } = useShop();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const nav = <>
    <Link to="/shop" search={{ category: 'All', color: 'All', sort: 'featured', q: '' }} onClick={() => setMobileOpen(false)}>Shop all</Link>
    <Link to="/tailoring" onClick={() => setMobileOpen(false)}>Tailoring</Link>
    <Link to="/dresses" onClick={() => setMobileOpen(false)}>Dresses</Link>
    <Link to="/about" onClick={() => setMobileOpen(false)}>Our world</Link>
  </>;
  return <>
    <div className="announcement">THE ART OF GETTING DRESSED <span className="mx-4 opacity-40">—</span> THE NEW EDITION IS HERE</div>
    <header className="site-header">
      <div className="header-inner">
        <div className="header-left"><Button variant="icon" size="icon" className="md:hidden" aria-label="Open menu" onClick={() => setMobileOpen(true)}><Menu /></Button><nav className="desktop-nav">{nav}</nav></div>
        <Link to="/" className="wordmark" aria-label="Zejesh Clothes home">ZEJESH<span>CLOTHES</span></Link>
        <div className="header-actions">
          <Button variant="icon" size="icon" aria-label="Search" title="Search" onClick={() => navigate({ to: '/shop', search: { category: 'All', color: 'All', sort: 'featured', q: '' } })}><Search /></Button>
          <Button variant="icon" size="icon" className="hidden sm:inline-flex" aria-label="Saved pieces" title="Saved pieces" onClick={() => navigate({ to: '/saved' })}><Heart />{saved.length > 0 && <i className="action-dot" />}</Button>
          <Button variant="icon" size="icon" className="hidden sm:inline-flex" aria-label="Account" title="Account" onClick={() => navigate({ to: user ? '/account' : '/auth' })}><UserRound /></Button>
          <Button variant="icon" size="icon" aria-label={`Shopping bag with ${cart.reduce((n,i) => n+i.quantity,0)} items`} title="Shopping bag" onClick={() => setCartOpen(true)}><ShoppingBag />{cart.length > 0 && <i className="action-dot" />}</Button>
        </div>
      </div>
    </header>
    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}><SheetContent side="left" className="mobile-menu"><SheetHeader><SheetTitle className="font-display text-2xl font-normal">ZEJESH CLOTHES</SheetTitle></SheetHeader><nav className="mobile-links">{nav}<Link to="/saved" onClick={() => setMobileOpen(false)}>Saved pieces</Link><Link to={user ? '/account' : '/auth'} onClick={() => setMobileOpen(false)}>Account</Link></nav></SheetContent></Sheet>
    <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
  </>;
}
export function Footer() {
  return <footer className="footer"><div className="footer-top"><div><span className="footer-wordmark">ZEJESH</span><p>Considered pieces for the way you move through the world.</p></div><div className="footer-links"><div><span>DISCOVER</span><Link to="/shop" search={{ category: 'All', color: 'All', sort: 'featured', q: '' }}>The collection</Link><Link to="/about">Our world</Link></div><div><span>ASSISTANCE</span><Link to="/contact">Contact us</Link><Link to="/account">Your account</Link></div></div></div><div className="footer-bottom"><span>© 2026 ZEJESH CLOTHES</span><span>DESIGNED TO BE WORN. MADE TO BE KEPT.</span></div></footer>;
}
export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { saved, toggleSaved } = useShop();
  const navigate = useNavigate();
  const isSaved = saved.includes(product.id);
  async function save() {
    try { await toggleSaved(product.id); toast.success(isSaved ? 'Removed from saved pieces' : 'Saved to your collection'); }
    catch (e) { if (e instanceof Error && e.message.includes('Sign in')) navigate({ to: '/auth' }); else toast.error('Unable to save this piece.'); }
  }
  return <article className="product-card" style={{ animationDelay: `${Math.min(index, 5) * 70}ms` }}><div className="product-media"><Link to="/product/$slug" params={{ slug: product.slug }} aria-label={`View ${product.name}`}><img src={productImages[product.slug]} alt={product.name} loading="lazy" width={912} height={1200} /></Link><span className="product-label">{product.featured ? 'THE EDIT' : product.category.toUpperCase()}</span><Button variant="floating" size="icon" className="product-save" aria-label={isSaved ? `Remove ${product.name} from saved` : `Save ${product.name}`} title={isSaved ? 'Remove from saved' : 'Save piece'} onClick={save}><Heart fill={isSaved ? 'currentColor' : 'none'} /></Button><Link to="/product/$slug" params={{ slug: product.slug }} className="quick-view">DISCOVER PIECE <ArrowUpRight size={15} /></Link></div><div className="product-info"><div><Link to="/product/$slug" params={{ slug: product.slug }}>{product.name}</Link><span>{product.category} · {product.color}</span></div><strong>{formatPrice(product.price)}</strong></div></article>;
}
function CartDrawer({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { cart, updateQuantity, user } = useShop();
  const { data: products = [] } = useQuery({ queryKey: ['products'], queryFn: getProducts });
  const total = cart.reduce((sum, item) => sum + (products.find(p => p.id === item.product_id)?.price ?? 0) * item.quantity, 0);
  return <Sheet open={open} onOpenChange={onOpenChange}><SheetContent side="right" className="cart-panel"><SheetHeader><SheetTitle className="font-display text-3xl font-normal">Your bag <span className="font-body text-sm">({cart.reduce((n,i) => n+i.quantity,0)})</span></SheetTitle></SheetHeader>{!user ? <div className="cart-empty"><ShoppingBag size={35} strokeWidth={1} /><h3>Make it yours.</h3><p>Sign in to keep your selection close, wherever you go.</p><Button asChild onClick={() => onOpenChange(false)}><Link to="/auth">SIGN IN</Link></Button></div> : cart.length === 0 ? <div className="cart-empty"><ShoppingBag size={35} strokeWidth={1} /><h3>Your bag is waiting.</h3><p>Find something worth keeping.</p><Button asChild onClick={() => onOpenChange(false)}><Link to="/shop" search={{ category: 'All', color: 'All', sort: 'featured', q: '' }}>EXPLORE THE COLLECTION</Link></Button></div> : <><div className="cart-list">{cart.map(item => { const product = products.find(p => p.id === item.product_id); if (!product) return null; return <div className="cart-item" key={item.id}><Link to="/product/$slug" params={{ slug: product.slug }} onClick={() => onOpenChange(false)}><img src={productImages[product.slug]} alt={product.name} width={100} height={132} /></Link><div className="cart-item-content"><div><Link to="/product/$slug" params={{ slug: product.slug }} onClick={() => onOpenChange(false)}>{product.name}</Link><span>{product.color} / {item.size}</span></div><div className="cart-item-bottom"><div className="quantity"><Button variant="icon" size="icon" aria-label="Decrease quantity" onClick={() => void updateQuantity(item.id, item.quantity - 1).catch(() => toast.error('Could not update bag'))}>{item.quantity === 1 ? <Trash2 size={14} /> : <Minus size={14} />}</Button><span>{item.quantity}</span><Button variant="icon" size="icon" aria-label="Increase quantity" disabled={item.quantity >= 10} onClick={() => void updateQuantity(item.id, item.quantity + 1).catch(() => toast.error('Could not update bag'))}><Plus size={14} /></Button></div><strong>{formatPrice(product.price * item.quantity)}</strong></div></div></div>; })}</div><div className="cart-summary"><div><span>SUBTOTAL</span><strong>{formatPrice(total)}</strong></div><p>Shipping and taxes calculated at checkout.</p><Button asChild className="w-full" onClick={() => onOpenChange(false)}><Link to="/checkout">CONTINUE TO CHECKOUT <ArrowUpRight size={16} /></Link></Button></div></>}</SheetContent></Sheet>;
}
