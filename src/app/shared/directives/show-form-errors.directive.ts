import { Directive, Input, ElementRef, Renderer2, OnChanges } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Directive({
  selector: '[appShowErrors]',
})
export class ShowFormErrorsDirective implements OnChanges {
  private valueSub: any = null;
  private statusSub: any = null;
  @Input('appShowErrors') control: AbstractControl | null = null;
  @Input() submitted: boolean = false;

  constructor(private el: ElementRef, private renderer: Renderer2) {}



  ngOnChanges() {
    console.log('cambio');
    const errors = this.control?.errors;
    const errorMessages = [];
    // Solo mostrar errores si el control fue tocado o el formulario fue enviado
      const show = this.control?.touched || this.submitted;
      this.updateErrors();
      this.unsubscribe();
      if (this.control) {
        this.valueSub = this.control.valueChanges?.subscribe(() => {
          this.updateErrors();
        });
        this.statusSub = (this.control as any).statusChanges?.subscribe(() => {
          this.updateErrors();
        });
      }
    if (show && errors) {
      if (errors['required']) {
        errorMessages.push('Este campo es obligatorio.');
      }
      if (errors['email']) {
        errorMessages.push('El email no es válido.');
      }
      if (errors['minlength']) {
        errorMessages.push(`Debe tener al menos ${errors['minlength'].requiredLength} caracteres.`);
      }
    }
    this.renderer.setProperty(this.el.nativeElement, 'innerHTML', errorMessages.join('<br>'));
    }

    ngOnDestroy() {
      this.unsubscribe();
    }

    private unsubscribe() {
      if (this.valueSub) {
        this.valueSub.unsubscribe();
        this.valueSub = null;
      }
      if (this.statusSub) {
        this.statusSub.unsubscribe();
        this.statusSub = null;
      }
    }

    private updateErrors() {
      const errors = this.control?.errors;
      const errorMessages = [];
      const show = this.control?.touched || this.submitted;
      if (show && errors) {
        if (errors['required']) {
          errorMessages.push('Este campo es obligatorio.');
        }
        if (errors['email']) {
          errorMessages.push('El email no es válido.');
        }
        if (errors['minlength']) {
          errorMessages.push(`Debe tener al menos ${errors['minlength'].requiredLength} caracteres.`);
        }
      }
      this.renderer.setProperty(this.el.nativeElement, 'innerHTML', errorMessages.join('<br>'));
    }
  }