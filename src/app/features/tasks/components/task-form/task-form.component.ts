import { Component, signal, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { Location } from '@angular/common';
import { FooterComponent } from '../../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [ReactiveFormsModule, FooterComponent],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnInit {
  form: FormGroup;
  loading = signal(false);
  error = signal('');
  isEdit = signal(false);
  taskId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private location: Location
  ) {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.maxLength(200)]],
      completed: [false]
    });
  }

  ngOnInit() {
    this.taskId = this.route.snapshot.paramMap.get('id');
    if (this.taskId) {
      this.isEdit.set(true);
      this.loading.set(true);
      this.taskService.getTask(this.taskId).subscribe({
        next: (task) => {
          this.form.patchValue(task);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('No se pudo cargar la tarea');
          this.loading.set(false);
        }
      });
    }
  }

  goBack() {
    this.location.back();
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    if (this.isEdit()) {
      this.taskService.updateTask(this.taskId!, this.form.value).subscribe({
        next: () => {
          this.router.navigate(['/tasks']);
        },
        error: () => {
          this.error.set('No se pudo actualizar la tarea');
          this.loading.set(false);
        }
      });
    } else {
      this.taskService.createTask(this.form.value).subscribe({
        next: () => {
          this.router.navigate(['/tasks']);
        },
        error: () => {
          this.error.set('No se pudo crear la tarea');
          this.loading.set(false);
        }
      });
    }
  }
}
