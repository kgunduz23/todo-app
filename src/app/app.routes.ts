import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'todo',
    loadChildren: () =>
      import('./pages/todo/todo.routes').then(m => m.todoRoutes)
  },
  {
    path: 'category',
    loadChildren: () =>
      import('./pages/category/category.routes').then(m => m.categoryRoutes)
  },
  {
    path: '',
    redirectTo: 'category',
    pathMatch: 'full'
  }
];
