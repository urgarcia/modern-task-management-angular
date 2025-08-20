import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthState {
  private isAuthenticated = false;

  setAuthState(isAuth: boolean): void {
    this.isAuthenticated = isAuth;
  }
  getAuthState(): boolean {
    return this.isAuthenticated;
  }
}
