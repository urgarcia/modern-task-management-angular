import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-error-component',
  standalone: true,
  templateUrl: './errorList.component.html',
})
export class ErrorListComponent implements OnChanges {
  @Input() errors: any;
  @Input() submitted: boolean = false;
  errorMessages: string[] = [];

  ngOnChanges(changes: SimpleChanges) {
    this.errorMessages = this.getErrorMessages(this.errors);
  }

  getErrorMessages(errors: any): string[] {
    if (!errors) return [];
    const messages: string[] = [];
    if (errors['required']) messages.push('Este campo es obligatorio.');
    if (errors['email']) messages.push('El email no es válido.');
    if (errors['minlength']) messages.push(`Debe tener al menos ${errors['minlength'].requiredLength} caracteres.`);
    return messages;
  }
}