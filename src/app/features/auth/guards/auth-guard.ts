import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthState } from '../state/auth.state';
import { CognitoService } from '../services/cognito';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authState: AuthState, private router: Router, private cognitoService: CognitoService) {}

  async canActivate(): Promise<boolean> {
    if (await this.cognitoService.isLoggedIn()) {
      return true; // Permite el acceso si el usuario está autenticado
    } else {
      this.router.navigate(['/auth/login']); // Redirige al login si no está autenticado
      return false;
    }
  }
}