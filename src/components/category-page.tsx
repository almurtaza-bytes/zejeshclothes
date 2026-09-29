import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { ArrowUpRight } from 'lucide-react';
import { getProducts, productImages, formatPrice } from '@/lib/catalog';
import { ProductCard } from '@/components/shop';
import studio from '@/assets/zejesh-studio.jpg';
import dress from '@/assets/product-dress.jpg';

const collections = {
  Tailoring: {
    number: '01', title: 'Tailoring', line: 'The shape of presence.',
    intro: 'A silhouette that says everything without saying too much. Clean lines, decisive proportions, and space to move on your own terms.',
    hero: studio, heroAlt: 'Model in sculptural black tailoring and ivory trousers against a white studio backdrop',
    note: 'A quiet kind of authority.', detail: 'Start with structure. Keep the freedom.',
    featuredSlug: 'the-form-blazer', featureLabel: 'THE FOUNDATION',
    featureText: 'A considered first layer that changes the shape of everything worn with it.',
    next: 'Dresses', nextPath: '/dresses' as const,
  },
  Dresses: {
    number: '02', title: 'Dresses', line: 'Made to move with you.',
    intro: 'An edit of dresses that feel like an occasion in themselves. Defined by silhouette, lifted by movement, and entirely your own.',
    hero: dress, heroAlt: 'Model in a flowing white dress photographed in a light studio',
    note: 'Presence in every movement.', detail: 'From sculptural form to effortless flow.',
    featuredSlug: 'the-volume-dress', featureLabel: 'THE EXPRESSION',
    featureText: 'Soft volume and an unmistakable silhouette; a piece that leaves room for the moment.',
    next: 'Tailoring', nextPath: '/tailoring' as const,
  },
};

export function CategoryPage({ category }: { category: 'Tailoring' | 'Dresses' }) {
  const edit = collections[category];
  const { data: products = [], isLoading, isError } = useQuery({ queryKey: ['products'], queryFn: getProducts });
  const pieces = products.filter(product => product.category === category);
  const featured = pieces.find(product => product.slug === edit.featuredSlug) ?? pieces[0];

  return <main className={`collection-page collection-${category.toLowerCase()}`}>
    <section className="collection-hero">
      <div className="collection-hero-copy">
        <span className="eyebrow">ZEJESH / THE EDIT {edit.number}</span>
        <h1>{edit.title}<span className="collection-period">.</span></h1>
        <p>{edit.line}</p>
        <a href="#collection-pieces" className="text-link">EXPLORE THE EDIT <ArrowUpRight size={16} /></a>
      </div>
      <div className="collection-hero-image"><img src={edit.hero} alt={edit.heroAlt} width={category === 'Tailoring' ? 1600 : 912} height={1200} fetchPriority="high" /></div>
      <span className="collection-hero-index">{edit.number} / ZEJESH CLOTHES</span>
    </section>

    <section className="collection-intro section-wrap">
      <span className="eyebrow">THE POINT OF VIEW / {edit.number}</span>
      <div><h2>{edit.note}</h2><p>{edit.intro}</p></div>
    </section>

    <section id="collection-pieces" className="collection-products section-wrap">
      <div className="collection-heading"><div><span className="eyebrow">THE {category.toUpperCase()} EDIT</span><h2>{edit.detail}</h2></div><span className="collection-count">{String(pieces.length).padStart(2, '0')} PIECES</span></div>
      {isLoading ? <div className="empty-state">Loading collection…</div> : isError ? <div className="empty-state"><h2>Unable to load the edit.</h2><p>Please try again shortly.</p></div> : <div className="collection-grid">{pieces.map((product, index) => <ProductCard product={product} index={index} key={product.id} />)}</div>}
    </section>

    {featured && <section className="collection-feature">
      <div className="collection-feature-image"><img src={productImages[featured.slug]} alt={featured.name} loading="lazy" width={912} height={1200} /></div>
      <div className="collection-feature-copy"><span className="eyebrow">{edit.featureLabel} / {edit.number}</span><h2>{featured.name}</h2><p>{edit.featureText}</p><span className="collection-feature-price">{formatPrice(featured.price)}</span><Link className="text-link" to="/product/$slug" params={{ slug: featured.slug }}>DISCOVER THE PIECE <ArrowUpRight size={16} /></Link></div>
    </section>}

    <div className="collection-next section-wrap"><div><span className="eyebrow">CONTINUE THE EDIT</span><Link to={edit.nextPath}>{edit.next} <ArrowUpRight aria-hidden="true" /></Link></div><Link to="/shop" search={{ category: 'All', color: 'All', sort: 'featured', q: '' }} className="text-link">VIEW THE FULL COLLECTION <ArrowUpRight size={16} /></Link></div>
  </main>;
}
