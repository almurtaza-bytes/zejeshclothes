import { createFileRoute, Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Heart, ArrowLeft, ArrowUpRight } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/shop';
import { getProducts, formatPrice, productImages } from '@/lib/catalog';
import { useShop } from '@/lib/shop-context';
export const Route = createFileRoute('/product/$slug')({
  head: ({ params }) => ({ meta: [{ title:`${params.slug.split('-').slice(1).join(' ')} — Zejesh Clothes` }, { name:'description', content:'Discover this considered piece from Zejesh Clothes. Explore fit, details, and the collection.' }, { property:'og:title', content:`${params.slug.split('-').slice(1).join(' ')} — Zejesh Clothes` }, { property:'og:description', content:'Discover this considered piece from the Zejesh Clothes collection.' }, { property:'og:type', content:'product' }, { name:'twitter:card', content:'summary_large_image' }] }), component: ProductPage,
});
function ProductPage() {
  const { slug } = Route.useParams(); const navigate = Route.useNavigate();
  const { data: products = [], isLoading } = useQuery({ queryKey:['products'], queryFn:getProducts });
  const product = products.find(p => p.slug === slug);
  const { addToCart, toggleSaved, saved } = useShop();
  const [size, setSize] = useState(''); const [adding, setAdding] = useState(false);
  if (isLoading) return <main className="section-wrap empty-state">Loading piece…</main>;
  if (!product) return <main className="section-wrap empty-state"><h2>Piece not found.</h2><Link className="text-link" to="/shop" search={{ category:'All',color:'All',sort:'featured',q:'' }}>BACK TO COLLECTION</Link></main>;
  async function add() { if (!product) return; if (!size) { toast.error('Please select a size first.'); return; } setAdding(true); try { await addToCart(product.id,size); toast.success('Added to your bag'); } catch(e) { if (e instanceof Error && e.message.includes('Sign in')) navigate({ to:'/auth' }); else toast.error('Could not add to bag. Please try again.'); } finally { setAdding(false); } }
  async function save() { if (!product) return; try { await toggleSaved(product.id); toast.success(saved.includes(product.id) ? 'Removed from saved pieces' : 'Saved to your collection'); } catch(e) { if (e instanceof Error && e.message.includes('Sign in')) navigate({ to:'/auth' }); else toast.error('Could not save this piece.'); } }
  return <main><div className="section-wrap detail-layout"><div><img className="detail-image" src={productImages[product.slug]} alt={product.name} width={912} height={1200} /><p className="eyebrow mt-5">ZEJESH / {product.category.toUpperCase()} / {product.color.toUpperCase()}</p></div><div className="detail-info"><Link className="text-link" to="/shop" search={{ category:'All',color:'All',sort:'featured',q:'' }}><ArrowLeft size={14} /> BACK TO COLLECTION</Link><div className="mt-11"><span className="eyebrow">THE ZEJESH COLLECTION</span><h1>{product.name}</h1><div className="detail-price">{formatPrice(product.price)}</div><p className="detail-description">{product.description} Designed for the moments that matter, and all the ones in between.</p><span className="detail-label">COLOR — {product.color.toUpperCase()}</span><span className="detail-label">SELECT SIZE</span><div className="size-options">{product.sizes.map(s => <button type="button" key={s} className={size === s ? 'selected' : ''} aria-label={`Size ${s}`} aria-pressed={size === s} onClick={() => setSize(s)}>{s}</button>)}</div><div className="detail-actions"><Button size="wide" onClick={add} disabled={adding || product.stock === 0}>{product.stock ? adding ? 'ADDING…' : 'ADD TO BAG' : 'SOLD OUT'} <ArrowUpRight size={16} /></Button><Button variant="outline" size="icon" aria-label={saved.includes(product.id) ? 'Remove from saved' : 'Save piece'} onClick={save}><Heart fill={saved.includes(product.id) ? 'currentColor' : 'none'} /></Button></div><div className="detail-notes"><div>COMPOSITION & CARE — Carefully selected materials</div><div>SHIPPING — Calculated at checkout</div><div>QUESTIONS? <Link to="/contact" className="underline">GET IN TOUCH</Link></div></div></div></div></div><section className="section-wrap"><div className="section-heading"><div><span className="eyebrow">CONTINUE EXPLORING</span><h2>You may also like.</h2></div></div><div className="product-grid">{products.filter(p => p.id !== product.id).slice(0,3).map((p,i) => <ProductCard product={p} index={i} key={p.id} />)}</div></section></main>;
}
