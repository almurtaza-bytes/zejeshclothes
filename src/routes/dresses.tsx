import { createFileRoute } from '@tanstack/react-router';
import { CategoryPage } from '@/components/category-page';
export const Route = createFileRoute('/dresses')({
  head: () => ({ meta: [{ title:'Modern Dresses — Zejesh Clothes' }, { name:'description', content:'Discover the Zejesh Clothes dress edit: sculptural silhouettes and effortless movement in black and white.' }, { property:'og:title', content:'Modern Dresses — Zejesh Clothes' }, { property:'og:description', content:'A focused edit of modern dresses by Zejesh Clothes.' }, { property:'og:type', content:'website' }, { name:'twitter:card', content:'summary_large_image' }] }),
  component: () => <CategoryPage category="Dresses" />,
});