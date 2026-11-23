import { RenderMode, ServerRoute } from '@angular/ssr';

// Render modes from PLAN.md section 8.
export const serverRoutes: ServerRoute[] = [
  // Prerendered at build time
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'about', renderMode: RenderMode.Prerender },
  { path: 'help', renderMode: RenderMode.Prerender },
  { path: 'terms', renderMode: RenderMode.Prerender },
  { path: 'privacy', renderMode: RenderMode.Prerender },
  { path: 'rental-policy', renderMode: RenderMode.Prerender },
  { path: 'dev/components', renderMode: RenderMode.Prerender },

  // Server-rendered per request (query string, meta tags, structured data)
  { path: 'books', renderMode: RenderMode.Server },
  { path: 'books/:slug', renderMode: RenderMode.Server },

  // Browser only (auth, cart and account state)
  { path: 'login', renderMode: RenderMode.Client },
  { path: 'signup', renderMode: RenderMode.Client },
  { path: 'forgot-password', renderMode: RenderMode.Client },
  { path: 'auth/callback', renderMode: RenderMode.Client },
  { path: 'cart', renderMode: RenderMode.Client },
  { path: 'checkout', renderMode: RenderMode.Client },
  { path: 'orders/:id', renderMode: RenderMode.Client },
  { path: 'account/**', renderMode: RenderMode.Client },
  { path: 'read/:slug', renderMode: RenderMode.Client },

  // 404
  { path: '**', renderMode: RenderMode.Server },
];
