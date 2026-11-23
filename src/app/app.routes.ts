import { Routes } from '@angular/router';

// Every route from PLAN.md section 8. Render modes are in app.routes.server.ts.
// Screens for later steps use the placeholder page until they are built (1c, 1d).
const placeholder = () =>
  import('./features/static/placeholder-page').then((m) => m.PlaceholderPage);

/** A route for a screen built in a later step. */
function later(path: string, heading: string) {
  return { path, loadComponent: placeholder, data: { heading } };
}

export const routes: Routes = [
  // Step 1b
  { path: '', loadComponent: () => import('./features/home/home').then((m) => m.Home) },
  {
    path: 'books',
    loadComponent: () => import('./features/catalog/catalog').then((m) => m.Catalog),
  },
  {
    path: 'books/:slug',
    loadComponent: () => import('./features/book/book-page').then((m) => m.BookPage),
  },
  {
    path: 'about',
    loadComponent: () => import('./features/static/about').then((m) => m.About),
  },

  // Step 1c
  later('login', 'Log in'),
  later('signup', 'Sign up'),
  later('forgot-password', 'Forgot password'),
  later('auth/callback', 'Signing you in'),
  later('cart', 'Cart'),
  later('checkout', 'Checkout'),
  later('orders/:id', 'Order completed'),

  // Step 1d
  later('account/details', 'Personal details'),
  later('account/purchased', 'Purchased books'),
  later('account/rented', 'Rented books'),
  later('account/wishlist', 'Wishlist'),
  later('read/:slug', 'Reader'),
  later('help', 'Help'),
  later('terms', 'Terms and conditions'),
  later('privacy', 'Privacy policy'),
  later('rental-policy', 'Rental policy'),

  // TEMPORARY: component review page. Delete before release.
  {
    path: 'dev/components',
    title: 'Components (dev) · InkSpills',
    loadComponent: () =>
      import('./features/dev/components-gallery').then((m) => m.ComponentsGallery),
  },

  // 404 (real page in step 1d)
  later('**', 'Page not found'),
];
