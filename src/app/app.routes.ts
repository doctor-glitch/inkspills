import { Routes } from '@angular/router';

export const routes: Routes = [
  // TEMPORARY: component review page. Delete before release.
  {
    path: 'dev/components',
    title: 'Components (dev) · InkSpills',
    loadComponent: () =>
      import('./features/dev/components-gallery').then((m) => m.ComponentsGallery),
  },
];
