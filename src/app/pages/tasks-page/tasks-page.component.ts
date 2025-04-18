// dependencies
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CapitalizeFirstPipe } from '../../pipes/capitalize-first.pipe';

// services
import { AuthService } from '../../services/auth.service';
import { TasksService } from '../../services/tasks.service';

// interfaces
import { Task } from '../../interfaces/task.interface';

@Component({
  selector: 'app-tasks-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CapitalizeFirstPipe],
  templateUrl: './tasks-page.component.html',
  styleUrls: ['./tasks-page.component.scss']
})
export default class TasksPageComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private tasksService = inject(TasksService);

  taskForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(1)]]
  });
  editForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(1)]]
  });

  tasks: Task[] = [];
  isLoading = false;
  showDeleteModal = false;
  taskToDelete: Task | null = null;
  editingTaskId: string | null = null;

  get title() {
    return this.taskForm.get('title')!;
  }

  get editTitle() {
    return this.editForm.get('title')!;
  }

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.isLoading = true;

    this.tasksService.getTasks().subscribe({
      next: (tasks) => this.tasks = tasks,
      error: (error) => console.error('Error loading tasks:', error),
      complete: () => this.isLoading = false
    });
  }

  createTask() {
    if(this.taskForm.invalid) return;

    this.isLoading = true;

    this.tasksService.createTask(this.title.value).subscribe({
      next: (newTask) => {
        this.tasks.unshift(newTask);
        this.taskForm.reset();
      },
      error: (error) => console.error('Error creating task:', error),
      complete: () => this.isLoading = false
    });
  }

  toggleTask(task: Task) {
    this.isLoading = true;

    this.tasksService.updateTask(task.id!, { completed: !task.completed }).subscribe({
      next: (updatedTask) => {
        const index = this.tasks.findIndex(t => t.id === task.id);
        if(index !== -1) this.tasks[index] = updatedTask;
      },
      error: (error) => console.error('Error updating task:', error),
      complete: () => this.isLoading = false
    });
  }

  startEditing(task: Task) {
    this.editingTaskId = task.id!;
    this.editForm.patchValue({ title: task.title });
  }

  cancelEditing() {
    this.editingTaskId = null;
    this.editForm.reset();
  }

  updateTask(task: Task) {
    if(this.editForm.invalid) return;

    this.isLoading = true;

    this.tasksService.updateTask(task.id!, { title: this.editTitle.value }).subscribe({
      next: (updatedTask) => {
        const index = this.tasks.findIndex(t => t.id === task.id);
        if(index !== -1) this.tasks[index] = updatedTask;
        this.cancelEditing();
      },
      error: (error) => console.error('Error updating task:', error),
      complete: () => this.isLoading = false,
    });
  }

  deleteTask(task: Task) {
    this.taskToDelete = task;
    this.showDeleteModal = true;
  }

  async confirmDelete() {
    if(!this.taskToDelete) return;

    this.isLoading = true;

    this.tasksService.deleteTask(this.taskToDelete.id!).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(t => t.id !== this.taskToDelete!.id);
        this.closeModal();
      },
      error: (error) => console.error('Error deleting task:', error),
      complete: () => this.isLoading = false
    });
  }

  closeModal() {
    this.showDeleteModal = false;
    this.taskToDelete = null;
  }

  async logout() {
    this.isLoading = true;

    this.authService.logout().subscribe({
      error: (error) => console.error('Error logging out:', error),
      complete: () => this.isLoading = false
    });
  }
}