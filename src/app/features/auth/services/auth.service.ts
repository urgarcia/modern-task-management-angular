import { Injectable } from '@angular/core';
import { HttpService } from '../../../core/services/httpService';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface LoginResponse {
  token: string;
  user: any;
}

export interface RegisterPayload {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  // otros campos necesarios
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpService) { }

  /**
   * Realiza el login del usuario
   * @param email Email del usuario
   * @param password Contraseña
   * @returns Observable con la respuesta del backend
   */
  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.request<LoginResponse>('POST', `${environment.apiUrl}/login`, {
      body: { email, password }
    });
  }

  /**
   * Registra un nuevo usuario
   * @param user Datos del usuario
   * @returns Observable con la respuesta del backend
   */
  register(user: RegisterPayload): Observable<any> {
    return this.http.request<any>('POST', `${environment.apiUrl}/register`, {
      body: user
    });
  }

  /**
   * Ejemplo de método para obtener el usuario actual (puedes adaptarlo)
   */
  getCurrentUser(): Observable<any> {
    return this.http.request<any>('GET', `${environment.apiUrl}/user`);
  }

  /**
   * Ejemplo de método para cerrar sesión
   */
  logout(): Observable<any> {
    return this.http.request<any>('POST', `${environment.apiUrl}/logout`);
  }
}
