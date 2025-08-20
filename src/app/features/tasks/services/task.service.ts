/**
 * @fileoverview Servicio de gestión de tareas
 * @author Uriel García
 * @description Servicio para el manejo CRUD de tareas - Prueba Técnica
 * @version 1.0.0
 * @created 2025-08-20
 */

import { Injectable } from '@angular/core';
import { HttpService } from '../../../core/services/httpService';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TaskService {
  constructor(private http: HttpService) {}

  getTasks(): Observable<Task[]> {
    return this.http.request<Task[]>('GET', `${environment.apiUrl}/tasks`);
  }

  getTask(id: string): Observable<Task> {
    return this.http.request<Task>('GET', `${environment.apiUrl}/tasks/${id}`);
  }

  createTask(task: Partial<Task>): Observable<Task> {
    return this.http.request<Task>('POST', `${environment.apiUrl}/tasks`, { body: task });
  }

  updateTask(id: string, task: Partial<Task>): Observable<Task> {
    return this.http.request<Task>('PUT', `${environment.apiUrl}/tasks/${id}`, { body: task });
  }

  deleteTask(id: string): Observable<any> {
    return this.http.request<any>('DELETE', `${environment.apiUrl}/tasks/${id}`);
  }
}
