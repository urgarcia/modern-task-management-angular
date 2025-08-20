import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import { heroHomeSolid } from '@ng-icons/heroicons/solid';
import { CognitoService } from '../../services/cognito';
import { FooterComponent } from '../../../../shared/components/footer/footer.component';

// Validador personalizado para confirmar contraseñas
function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const repeatPassword = control.get('repeatPassword');

  if (!password || !repeatPassword) {
    return null;
  }

  return password.value === repeatPassword.value ? null : { passwordMismatch: true };
}

// Validador para contraseña fuerte
function strongPasswordValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  
  if (!value) {
    return null;
  }

  const hasNumber = /[0-9]/.test(value);
  const hasUpper = /[A-Z]/.test(value);
  const hasLower = /[a-z]/.test(value);
  const hasSymbol = /[#?!@$%^&*-]/.test(value);
  const isValidLength = value.length >= 8;

  const passwordValid = hasNumber && hasUpper && hasLower && hasSymbol && isValidLength;

  return !passwordValid ? {
    strongPassword: {
      hasNumber,
      hasUpper,
      hasLower,
      hasSymbol,
      isValidLength
    }
  } : null;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, FooterComponent],
  providers: [provideIcons({ heroHomeSolid })],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = signal(false);
  error = signal('');
  success = signal('');

  constructor(
    private fb: FormBuilder, 
    private cognitoService: CognitoService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20), Validators.pattern(/^[a-zA-Z0-9_]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, strongPasswordValidator]],
      repeatPassword: ['', [Validators.required]],
      acceptTerms: [false, [Validators.requiredTrue]]
    }, { validators: passwordMatchValidator });
  }

  // Getters para facilitar el acceso a los campos
  get firstName() { return this.registerForm.get('firstName'); }
  get username() { return this.registerForm.get('username'); }
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
  get repeatPassword() { return this.registerForm.get('repeatPassword'); }
  get acceptTerms() { return this.registerForm.get('acceptTerms'); }

  // Función para obtener mensajes de error específicos
  getErrorMessage(fieldName: string): string[] {
    const field = this.registerForm.get(fieldName);
    const errors: string[] = [];

    if (field?.errors && (field.dirty || field.touched)) {
      if (field.errors['required']) {
        errors.push(`${this.getFieldDisplayName(fieldName)} es obligatorio`);
      }
      if (field.errors['email']) {
        errors.push('Formato de email inválido');
      }
      if (field.errors['minlength']) {
        errors.push(`Mínimo ${field.errors['minlength'].requiredLength} caracteres`);
      }
      if (field.errors['maxlength']) {
        errors.push(`Máximo ${field.errors['maxlength'].requiredLength} caracteres`);
      }
      if (field.errors['pattern']) {
        errors.push('Solo letras, números y guiones bajos permitidos');
      }
      if (field.errors['strongPassword']) {
        const requirements = field.errors['strongPassword'];
        errors.push('La contraseña debe tener:');
        if (!requirements.isValidLength) errors.push('• Mínimo 8 caracteres');
        if (!requirements.hasUpper) errors.push('• Al menos una mayúscula');
        if (!requirements.hasLower) errors.push('• Al menos una minúscula');
        if (!requirements.hasNumber) errors.push('• Al menos un número');
        if (!requirements.hasSymbol) errors.push('• Al menos un símbolo (#?!@$%^&*-)');
      }
    }

    // Error de contraseñas no coinciden
    if (fieldName === 'repeatPassword' && this.registerForm.errors?.['passwordMismatch'] && this.repeatPassword?.touched) {
      errors.push('Las contraseñas no coinciden');
    }

    return errors;
  }

  private getFieldDisplayName(fieldName: string): string {
    const names: {[key: string]: string} = {
      firstName: 'Nombre',
      username: 'Nombre de usuario',
      email: 'Email',
      password: 'Contraseña',
      repeatPassword: 'Confirmar contraseña',
      acceptTerms: 'Aceptar términos'
    };
    return names[fieldName] || fieldName;
  }

  async onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.error.set('Por favor, completa todos los campos correctamente');
      return;
    }

    this.loading.set(true);
    this.error.set('');
    this.success.set('');

    try {
      const { firstName, username, email, password } = this.registerForm.value;
      
      const response = await this.cognitoService.signUp(email, password, firstName, username);
      
      this.success.set('¡Cuenta creada exitosamente! Revisa tu email para confirmar tu cuenta.');
      
      // Redirigir al login después de 3 segundos
      setTimeout(() => {
        this.router.navigate(['/auth/login']);
      }, 3000);
      
    } catch (error: any) {
      console.error('Error en el registro:', error);
      
      // Manejo de errores específicos de Cognito
      let errorMessage = 'Error al crear la cuenta. Inténtalo de nuevo.';
      
      if (error.name === 'UsernameExistsException') {
        errorMessage = 'Este nombre de usuario ya está en uso.';
      } else if (error.name === 'InvalidPasswordException') {
        errorMessage = 'La contraseña no cumple con los requisitos de seguridad.';
      } else if (error.name === 'InvalidParameterException') {
        errorMessage = 'Algunos datos no son válidos. Verifica la información.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      this.error.set(errorMessage);
    } finally {
      this.loading.set(false);
    }
  }

  // Verificar si el formulario es válido
  isFormValid(): boolean {
    return this.registerForm.valid;
  }
}
