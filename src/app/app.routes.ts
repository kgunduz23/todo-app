import { Routes } from '@angular/router';
import { CategoryComponent } from './pages/category/category.component';
import { TodoComponent } from './pages/todo/todo.component';

export const routes: Routes = [
  { path: 'category', component: CategoryComponent },
  { path: 'todo', component: TodoComponent },
  { path: '', redirectTo: 'category', pathMatch: 'full' },
  { path: 'todo/:categoryId',
  loadComponent: () => import('./pages/todo/todo.component').then(m => m.TodoComponent)}

];

