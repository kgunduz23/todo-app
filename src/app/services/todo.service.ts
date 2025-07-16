import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Todo {
  id: string;
  title: string;
  categoryId: string;  
}
const STORAGE_KEY = 'todos';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private todosSubject = new BehaviorSubject<Todo[]>(this.loadFromStorage());
  todos$ = this.todosSubject.asObservable();

  constructor() {}

  private loadFromStorage(): Todo[] {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  private saveToStorage(todos: Todo[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  addTodo(title: string, categoryId: string) {
    if (title.trim()) {
      const current = this.todosSubject.getValue();
      const newTodo: Todo = {
        id: this.generateUUID(),
        title: title.trim(),
        categoryId: categoryId,  
      };
      const updated = [...current, newTodo];
      this.todosSubject.next(updated);
      this.saveToStorage(updated);
    }
  }

  deleteTodo(id: string) {
    const current = this.todosSubject.getValue();
    const updated = current.filter(todo => todo.id !== id);
    this.todosSubject.next(updated);
    this.saveToStorage(updated);
  }

  updateTodo(id: string, newTitle: string) {
    const current = this.todosSubject.getValue();
    const updated = current.map(todo =>
      todo.id === id ? { ...todo, title: newTitle } : todo
    );
    this.todosSubject.next(updated);
    this.saveToStorage(updated);
  }

}
