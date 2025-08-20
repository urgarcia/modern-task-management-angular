import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroHomeSolid } from '@ng-icons/heroicons/solid';
import { CognitoService } from '../../services/cognito';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [NgIcon, RouterLink, ReactiveFormsModule],
  providers: [provideIcons({ heroHomeSolid })],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private cognitoService: CognitoService){
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      repeatPassword: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      lastName: [''],
      rememberMe: [false],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password, firstName, username} = this.loginForm.value;
      console.log('Formulario de registro:', this.loginForm.value);
      debugger;
      this.cognitoService.signUp(email, password, firstName, username).then((response) => {

        // Handle successful registration
        console.log('Registro exitoso', response);
      }).catch((error) => {
        // Handle registration error
        console.error('Error en el registro:', error);
      });
    } else {
      // Mark all fields as touched to show validation errors
      this.loginForm.markAllAsTouched();
    }
  }

}
