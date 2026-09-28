import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { ArrowUpRight } from 'lucide-react';
import { getProducts } from '@/lib/catalog';
import { ProductCard } from '@/components/shop';

export function CategoryPage({ category, statement }: { category: 'Tailoring' | 'Dresses'; statement: string }) {
  const { data: products = [], isLoading } = useQuery({ queryKey: ['products'], queryFn: getProducts });
  const pieces = products.filter((product) => product.category === category);
  return <main><section className="section-wrap"><div className="page-heading"><span className="eyebrow">ZEJESH / {category.toUpperCase()}</span><h1 className="page-title">{category}.</h1></div><div className="section-heading"><div><span className="eyebrow">THE CATEGORY EDIT</span><p>{statement}</p></div><Link className="text-link" to="/shop" search={{ category:'All', color:'All', sort:'featured', q:'' }}>SHOP ALL <ArrowUpRight size={15} /></Link></div>{isLoading ? <div className="empty-state">Loading collection…</div> : <div className="product-grid">{pieces.map((product,index) => <ProductCard key={product.id} product={product} index={index} />)}</div>}</section><section className="editorial-band"><span className="eyebrow">A STUDY IN FORM</span><h2>{category === 'Tailoring' ? 'Structure, softened.' : 'Movement, considered.'}</h2><Link className="text-link" to="/about">OUR PERSPECTIVE <ArrowUpRight size={15} /></Link></section></main>;
}