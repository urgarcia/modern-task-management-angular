import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroUsers } from '@ng-icons/heroicons/outline';
import { heroHomeSolid } from '@ng-icons/heroicons/solid';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { ShowFormErrorsDirective } from '../../../../shared/directives/show-form-errors.directive';
import { AuthService, LoginResponse } from '../../services/auth.service';
import { ErrorListComponent } from '../errorLists/errorList.component';
import { CognitoService } from '../../services/cognito';
import { FooterComponent } from '../../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ ReactiveFormsModule, ErrorListComponent, RouterLink, FooterComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [provideIcons({ heroUsers , heroHomeSolid})]
})
export class LoginComponent {
  loginForm: FormGroup;
  state = signal({
    loading: false,
    submitted: false,
    error: ''
  })
  isLogged = false;
  token: string | null = null;

  constructor(private fb: FormBuilder, private cognitoService: CognitoService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false],
    });
    cognitoService.getJwtToken().then(token => {
      this.token = token;
      this.isLogged = !!token;
      if(this.isLogged){
        this.router.navigate(['/']);
      }
    });
  }

  getErrorMessages(control: AbstractControl | null): string[] {
  if (!control || !control.errors) return [];
  const errors = control.errors;
  const messages: string[] = [];
  if (errors['required']) messages.push('Este campo es obligatorio.');
  if (errors['email']) messages.push('El email no es válido.');
  if (errors['minlength']) messages.push(`Debe tener al menos ${errors['minlength'].requiredLength} caracteres.`);
  // Agrega más validaciones si lo necesitas
  return messages;
  }

  ngOnInit() {
    this.loginForm.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(value => {
        // Aquí puedes manejar los cambios del formulario, por ejemplo, enviarlos a un servicio
        return []; // Retorna un observable vacío o el que necesites
      })
    ).subscribe(value => {
      // Form changes logic here if needed
    });
  }

  onSubmit() {
    // Limpiar errores previos
    this.state.update(state => ({ ...state, error: '', submitted: true }));
    
    if (this.loginForm.valid) { 
      // Activar estado de carga
      this.state.update(state => ({ ...state, loading: true }));
      
      this.cognitoService.signIn(this.loginForm.value.email, this.loginForm.value.password)
        .then(user => {
          console.log('Inicio de sesión exitoso:', user);
          // Redirigir al usuario
          this.router.navigate(['/tasks']);
        })
        .catch(error => {
          console.error('Error en el inicio de sesión:', error);
          // Mostrar error al usuario
          let errorMessage = 'Error en el inicio de sesión. Verifica tus credenciales.';
          
          // Personalizar mensaje según el tipo de error
          if (error.name === 'NotAuthorizedException') {
            errorMessage = 'Usuario o contraseña incorrectos.';
          } else if (error.name === 'UserNotConfirmedException') {
            errorMessage = 'Por favor confirma tu cuenta antes de iniciar sesión.';
          } else if (error.name === 'UserNotFoundException') {
            errorMessage = 'Usuario no encontrado.';
          }
          
          this.state.update(state => ({ ...state, error: errorMessage }));
        })
        .finally(() => {
          // Desactivar estado de carga
          this.state.update(state => ({ ...state, loading: false }));
        });
    } else {
      console.log('Form not valid', this.getErrorMessages(this.loginForm.get('email')));
    }
  }
}
