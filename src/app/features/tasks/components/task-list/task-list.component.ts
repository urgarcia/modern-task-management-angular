import { Component, signal, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { RouterLink, Router } from '@angular/router';
import { CognitoService } from '../../../auth/services/cognito';
import { FooterComponent } from '../../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
    imports: [RouterLink, FooterComponent],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  tasks = signal<Task[]>([]);
  loading = signal(false);
  error = signal('');
  loggingOut = signal(false);

  constructor(
    private taskService: TaskService,
    private cognitoService: CognitoService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loading.set(true);
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks.set(tasks);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Error al cargar las tareas');
        this.loading.set(false);
      }
    });
  }

  deleteTask(id: string) {
    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.tasks.set(this.tasks().filter(t => t.id !== id));
      },
      error: () => {
        this.error.set('No se pudo eliminar la tarea');
      }
    });
  }

  async logout() {
    this.loggingOut.set(true);
    try {
      await this.cognitoService.signOut();
      this.router.navigate(['/auth/login']);
    } catch (error) {
      this.error.set('Error al cerrar sesión');
      console.error('Error durante el logout:', error);
    } finally {
      this.loggingOut.set(false);
    }
  }
}
