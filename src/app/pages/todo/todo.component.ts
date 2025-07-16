import { Component,OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TodoService, Todo } from '../../services/todo.service';
import { CategoryService, Category } from '../../services/category.service';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, shareReplay  } from 'rxjs/operators';
import { take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { CategoryNameAsyncPipe } from '../pipes/category_name.pipe';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, FormsModule,CategoryNameAsyncPipe],
  templateUrl: './todo.html',
  styleUrl: './todo.scss',
  
})
export class TodoComponent {
  writeNewTodo: string = '';

  editingTodoId: string | null = null;
  editedTitle: string = '';
  doneTodoIds: Set<string> = new Set();



  todos$: Observable<Todo[]>;
  categories$: Observable<Category[]>;
  selectedCategoryId$ = new BehaviorSubject<string | null>(null);
  filteredTodos$: Observable<Todo[]>;

  searchTerm$ = new BehaviorSubject<string>(''); 


  constructor(
    private todoService: TodoService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.todos$ = this.todoService.todos$;
    this.categories$ = this.categoryService.categories$;

    this.categories$.pipe(take(1)).subscribe(categories => {
      const firstId = categories[0]?.id || null;
      this.selectedCategoryId$.next(firstId);
    });



    this.filteredTodos$ = combineLatest([
      this.todos$,
      this.selectedCategoryId$,
      this.searchTerm$.pipe(
        debounceTime(2000), 
        distinctUntilChanged()
      )
    ]).pipe(
      map(([todos, selectedCategoryId, searchTerm]) =>
        todos.filter(todo =>
          todo.categoryId === selectedCategoryId &&
          todo.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    );


  } 

  onSearchTermChange(value: string) {
    this.searchTerm$.next(value);
  }
  
 onCategoryChange(categoryId: string) {
  this.selectedCategoryId$.next(categoryId);
}




  addTodo() {
  if (this.writeNewTodo.trim()) {
    this.selectedCategoryId$.pipe(take(1)).subscribe(categoryId => {
      if (categoryId) {
        this.todoService.addTodo(this.writeNewTodo.trim(), categoryId);
        this.writeNewTodo = '';
      }
    });
  }
}

  deleteTodo(id: string) {
    this.todoService.deleteTodo(id);
  }

  startEditing(todo: Todo) {
    this.editingTodoId = todo.id;
    this.editedTitle = todo.title;
  }
  
  
  saveEdit(todoId: string) {
    if (this.editedTitle.trim()) {
      this.todoService.updateTodo(todoId, this.editedTitle.trim());
      this.cancelEdit();
    }
  }

  cancelEdit() {
    this.editingTodoId = null;
    this.editedTitle = '';
  }

  toggleDone(id: string) {
    if (this.doneTodoIds.has(id)) {
      this.doneTodoIds.delete(id);
    } else {
      this.doneTodoIds.add(id);
    }
}


}
