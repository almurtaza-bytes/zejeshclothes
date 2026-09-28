import { createFileRoute } from '@tanstack/react-router';
import { CategoryPage } from '@/components/category-page';
export const Route = createFileRoute('/tailoring')({
  head: () => ({ meta: [{ title:'Modern Tailoring — Zejesh Clothes' }, { name:'description', content:'Discover Zejesh Clothes tailoring: precise forms, fluid trousers, and quietly confident silhouettes.' }, { property:'og:title', content:'Modern Tailoring — Zejesh Clothes' }, { property:'og:description', content:'A focused edit of modern tailoring by Zejesh Clothes.' }, { property:'og:type', content:'website' }, { name:'twitter:card', content:'summary_large_image' }] }),
  component: () => <CategoryPage category="Tailoring" statement="Precision without rigidity. Modern forms shaped for movement." />,
});