import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Category {
  id: string;
  name: string;
}

const STORAGE_KEY = 'categories';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {


  private categoriesSubject = new BehaviorSubject<Category[]>(this.loadFromStorage());
  categories$ = this.categoriesSubject.asObservable(); 
  constructor() {}


  private loadFromStorage(): Category[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];

  
}


  private saveCategories(categories: Category[]) {
    this.categoriesSubject.next(categories);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
  }

  addCategory(name: string) {
  if (name!==null && name!== ' ') {
    const current = this.categoriesSubject.getValue();
    const newCategory:Category= {
      id: this.generateUUID(),
      name: name.trim()
    };
    const updated = [...current, newCategory];
    this.categoriesSubject.next(updated);
    this.saveCategories(updated);

  }
}


  
 deleteCategory(id: string) {
  const current = this.categoriesSubject.getValue();
  const index = current.findIndex(c => c.id === id);
  if (index !== -1) {
    current.splice(index, 1);
    this.categoriesSubject.next(current);
    this.saveCategories(current);
  }
}


generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}



}
