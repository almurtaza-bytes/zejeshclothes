import { createFileRoute, Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { ArrowUpRight } from 'lucide-react';
import studio from '@/assets/zejesh-studio.jpg';
import { getProducts, formatPrice } from '@/lib/catalog';
import { ProductCard } from '@/components/shop';

export const Route = createFileRoute('/')({
  head: () => ({ meta: [{ title: 'Zejesh Clothes — The Collection' }, { name: 'description', content: 'Explore Zejesh Clothes: modern tailoring, dresses and essentials presented in a considered monochrome collection.' }, { property: 'og:title', content: 'Zejesh Clothes — The Collection' }, { property: 'og:description', content: 'An edited wardrobe of modern tailoring, dresses and essentials.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }),
  component: Home,
});

function Home() {
  const { data: products = [] } = useQuery({ queryKey: ['products'], queryFn: getProducts });
  const trench = products.find(p => p.slug === 'the-atelier-trench');
  return <main>
    <section className="hero studio-hero">
      <h1 className="sr-only">Zejesh Clothes</h1>
      <img src={studio} alt="Zejesh Clothes black tailored outerwear and ivory trousers in a white studio" width={1600} height={1200} fetchPriority="high" />
      <div className="studio-hero-caption"><span className="eyebrow">ZEJESH / THE STUDIO</span><div className="studio-hero-product"><span>THE ATELIER TRENCH{trench ? ` — ${formatPrice(trench.price)}` : ''}</span><Link to="/product/$slug" params={{ slug: 'the-atelier-trench' }} aria-label="Discover the Atelier Trench"><ArrowUpRight size={20} /></Link></div></div>
      <span className="studio-hero-index">01 / 06</span>
    </section>
    <div className="intro-strip"><div>ZEJESH CLOTHES</div><div>THE NEW EDITION</div><div>EXPLORE THE COLLECTION</div></div>
    <section className="home-entry section-wrap"><span className="eyebrow">THE ZEJESH COLLECTION / 01</span><div><h2>Clothes worth<br /><em>returning to.</em></h2><p>A considered wardrobe of pieces chosen for their form, their presence, and the way they become your own.</p></div></section>
    <section className="home-chapters section-wrap"><Link to="/tailoring" className="home-chapter"><span>01 / THE EDIT</span><strong>Tailoring</strong><span>SHAPE & PRESENCE <ArrowUpRight size={17} /></span></Link><Link to="/dresses" className="home-chapter"><span>02 / THE EDIT</span><strong>Dresses</strong><span>FORM & MOVEMENT <ArrowUpRight size={17} /></span></Link></section>
    <section className="section-wrap home-products"><div className="section-heading"><div><span className="eyebrow">THE NEW EDITION</span><h2>Selected pieces.</h2><p>An edit of everything worth keeping.</p></div><Link className="text-link" to="/shop" search={{ category:'All', color:'All', sort:'featured', q:'' }}>VIEW ALL <ArrowUpRight size={15} /></Link></div><div className="product-grid">{products.filter(p => p.featured).map((p,i) => <ProductCard product={p} index={i} key={p.id} />)}</div></section>
    <section className="editorial-band"><span className="eyebrow">THE ZEJESH PERSPECTIVE</span><h2>Less, but infinitely more.</h2><Link className="text-link" to="/about">ENTER OUR WORLD <ArrowUpRight size={15} /></Link></section>
    <section className="section-wrap"><div className="section-heading"><div><span className="eyebrow">WARDROBE NOTES</span><h2>The essentials.</h2><p>Considered foundations for every day.</p></div><Link className="text-link" to="/shop" search={{ category:'All', color:'All', sort:'featured', q:'' }}>SHOP ALL <ArrowUpRight size={15} /></Link></div><div className="product-grid">{products.filter(p => !p.featured).map((p,i) => <ProductCard product={p} index={i} key={p.id} />)}</div></section>
  </main>;
}
