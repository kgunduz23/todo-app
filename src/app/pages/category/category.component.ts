import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CategoryService, Category } from '../../services/category.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './category.html',
  styleUrl: './category.scss'
})
export class CategoryComponent {
  newCategory: string = '';
  categories: Category[] = [];
  categories$: Observable<Category[]>;



  constructor(private categoryService: CategoryService) {
    this.categories$ = this.categoryService.categories$;
   
  }

  addCategory() {
    if (this.newCategory.trim()) {
      this.categoryService.addCategory(this.newCategory.trim());
      this.newCategory = '';
    }
  }

  deleteCategory(id: string) {
    this.categoryService.deleteCategory(id);
  }
}
