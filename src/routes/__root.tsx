import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Outlet, Link, createRootRouteWithContext, HeadContent, Scripts } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import appCss from '../styles.css?url';
import { ShopProvider } from '@/lib/shop-context';
import { Header, Footer } from '@/components/shop';
import { Toaster } from '@/components/ui/sonner';
export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({ meta: [{ charSet: 'utf-8' }, { name: 'viewport', content: 'width=device-width, initial-scale=1' }], links: [{ rel: 'stylesheet', href: appCss }, { rel: 'preconnect', href: 'https://fonts.googleapis.com' }, { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' }, { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=DM+Sans:wght@400;500;600;700&display=swap' }, { rel: 'icon', href: '/favicon.ico', type: 'image/x-icon' }] }),
  shellComponent: ({ children }: { children: ReactNode }) => <html lang="en"><head><HeadContent /></head><body>{children}<Scripts /></body></html>,
  component: RootComponent,
  notFoundComponent: () => <main className="auth-layout"><div className="auth-box text-center"><h1>Page not found.</h1><p>Let's take you back to the collection.</p><Link className="text-link" to="/">BACK TO ZEJESH</Link></div></main>,
});
function RootComponent() { const { queryClient } = Route.useRouteContext(); return <QueryClientProvider client={queryClient}><ShopProvider><Header /><Outlet /><Footer /><Toaster position="bottom-center" /></ShopProvider></QueryClientProvider>; }
