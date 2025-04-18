// dependencies
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// interfaces
import { Task } from '../interfaces/task.interface';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/tasks`;

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  createTask(title: string): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, { title });
  }

  updateTask(id: string, data: Partial<Task>): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, data);
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}