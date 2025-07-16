import { Pipe, PipeTransform, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CategoryService, Category } from '../../services/category.service';

import { Subscription, map } from 'rxjs';

@Pipe({
  name: 'categoryNameAsync',
  standalone: true,
  pure: false
})
export class CategoryNameAsyncPipe implements PipeTransform, OnDestroy {
  private currentValue: string = '';
  private subscription: Subscription | null = null;
  private lastId: string | null = null;

  constructor(
    private categoryService: CategoryService,
    private cdRef: ChangeDetectorRef
  ) {}

  transform(categoryId: string | null): string {
    if (categoryId === this.lastId) return this.currentValue;

    this.lastId = categoryId;
    if (this.subscription) this.subscription.unsubscribe();

    this.subscription = this.categoryService.categories$
      .pipe(
        map((categories: Category[]) => {
          const match = categories.find(c => c.id === categoryId);
          return match ? match.name : 'Unknown';
        })
      )
      .subscribe(value => {
        this.currentValue = value;
        this.cdRef.markForCheck();
      });

    return this.currentValue;
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
