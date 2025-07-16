// src/app/pages/todo/todo.routes.ts
import { Routes } from '@angular/router';
import { TodoComponent } from './todo.component';

export const todoRoutes: Routes = [
  {
    path: ':categoryId',
    component: TodoComponent,
  },
];
