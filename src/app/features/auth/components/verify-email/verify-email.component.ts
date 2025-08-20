/**
 * @fileoverview Componente de verificación de email para AWS Cognito
 * @description Permite a los usuarios verificar su email mediante código de confirmación
 * @author Uriel García
 * @created 2025-08-20
 * @lastModified 2025-08-20
 */

import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CognitoService } from '../../services/cognito';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.scss'
})
export class VerifyEmailComponent {
  
  // Formulario reactivo
  verifyForm: FormGroup;
  
  // Signals para manejo de estado
  loading = signal(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);
  resendingCode = signal(false);
  
  // Usuario desde la navegación
  username = signal<string>('');
  email = signal<string>('');

  constructor(
    private fb: FormBuilder,
    private cognitoService: CognitoService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.verifyForm = this.fb.group({
      verificationCode: ['', [
        Validators.required,
        Validators.pattern(/^\d{6}$/), // Código de 6 dígitos
        Validators.minLength(6),
        Validators.maxLength(6)
      ]]
    });

    // Obtener datos del usuario desde la navegación
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.username.set(navigation.extras.state['username'] || '');
      this.email.set(navigation.extras.state['email'] || '');
    }

    // Si no hay datos, redirigir al registro
    if (!this.username() || !this.email()) {
      this.router.navigate(['/auth/register']);
    }
  }

  /**
   * Getter para acceder fácilmente al campo de código de verificación
   */
  get verificationCode() {
    return this.verifyForm.get('verificationCode');
  }

  /**
   * Verifica si el formulario es válido y no está cargando
   */
  isFormValid(): boolean {
    return this.verifyForm.valid && !this.loading();
  }

  /**
   * Confirma el registro del usuario con el código de verificación
   */
  async onSubmit(): Promise<void> {
    if (!this.isFormValid()) {
      this.markFormGroupTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    this.success.set(null);

    try {
      const code = this.verificationCode?.value;
      const username = this.username();

      await this.cognitoService.confirmSignUp(username, code);
      
      this.success.set('¡Email verificado correctamente! Redirigiendo al login...');
      
      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        this.router.navigate(['/auth/login'], {
          state: { 
            message: 'Registro completado. Ahora puedes iniciar sesión.',
            username: username 
          }
        });
      }, 2000);

    } catch (error: any) {
      console.error('Error al verificar código:', error);
      
      // Manejo de errores específicos de Cognito
      if (error.name === 'CodeMismatchException') {
        this.error.set('Código de verificación incorrecto. Verifica e intenta nuevamente.');
      } else if (error.name === 'ExpiredCodeException') {
        this.error.set('El código ha expirado. Solicita un nuevo código.');
      } else if (error.name === 'LimitExceededException') {
        this.error.set('Demasiados intentos. Espera un momento antes de intentar nuevamente.');
      } else {
        this.error.set('Error al verificar el código. Intenta nuevamente.');
      }
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Reenvía el código de confirmación
   */
  async resendCode(): Promise<void> {
    this.resendingCode.set(true);
    this.error.set(null);
    this.success.set(null);

    try {
      await this.cognitoService.resendConfirmationCode(this.username());
      this.success.set('Código reenviado a tu email. Revisa tu bandeja de entrada.');
    } catch (error: any) {
      console.error('Error al reenviar código:', error);
      this.error.set('Error al reenviar el código. Intenta nuevamente.');
    } finally {
      this.resendingCode.set(false);
    }
  }

  /**
   * Obtiene los mensajes de error para el campo de código
   */
  getCodeErrorMessage(): string[] {
    const errors: string[] = [];
    const codeControl = this.verificationCode;

    if (codeControl?.errors && codeControl?.touched) {
      if (codeControl.errors['required']) {
        errors.push('El código de verificación es obligatorio');
      }
      if (codeControl.errors['pattern']) {
        errors.push('El código debe contener solo 6 dígitos');
      }
      if (codeControl.errors['minlength'] || codeControl.errors['maxlength']) {
        errors.push('El código debe tener exactamente 6 dígitos');
      }
    }

    return errors;
  }

  /**
   * Marca todos los campos del formulario como tocados para mostrar errores
   */
  private markFormGroupTouched(): void {
    Object.keys(this.verifyForm.controls).forEach(key => {
      const control = this.verifyForm.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Permite solo números en el input del código
   */
  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/\D/g, ''); // Solo números
    input.value = value.slice(0, 6); // Máximo 6 dígitos
    this.verificationCode?.setValue(value.slice(0, 6));
  }

  /**
   * Regresar al registro
   */
  goBackToRegister(): void {
    this.router.navigate(['/auth/register']);
  }
}
