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

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ ReactiveFormsModule, ErrorListComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [provideIcons({ heroUsers , heroHomeSolid})]
})
export class LoginComponent {
  loginForm: FormGroup;
  state = signal({
    loading: false,
    submitted: false
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
      console.log('token:', token);
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
      console.log('Form changes:', value);
    });
  }

  onSubmit() {
    this.state.update(state => ({ ...state, submitted: true }));
    if (this.loginForm.valid) { 

      this.cognitoService.signIn(this.loginForm.value.email, this.loginForm.value.password)
        .then(user => {
          console.log('Inicio de sesión exitoso:', user);

      this.state.update(state => ({ ...state, loading: true, submitted: false }));
      this.loginForm.reset();
        })
        .catch(error => {
          console.error('Error en el inicio de sesión:', error);
        });


    } else {
      console.log('Form not valid', this.getErrorMessages(this.loginForm.get('email')));
    }
  }
}
