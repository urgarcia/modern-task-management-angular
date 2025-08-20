import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, switchMap } from 'rxjs/operators';
import { from } from 'rxjs';
import { CognitoService } from '../../features/auth/services/cognito';

@Injectable({providedIn: 'root'})
export class HttpService {
    constructor(private httpClient: HttpClient, private cognitoService: CognitoService) { }
    
    /**
     * Realiza una petición HTTP genérica con token automático.
     */
    request<T>(
      method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
      url: string,
      options: {
        body?: any,
        params?: any,
        headers?: any
      } = {}
    ) {
      return from(this.cognitoService.getJwtToken()).pipe(
        switchMap(token => {
          let headers = options.headers instanceof HttpHeaders 
            ? options.headers 
            : new HttpHeaders(options.headers || {});

          if (token) {
            headers = headers.set('Authorization', `Bearer ${token}`);
          }

          return this.httpClient.request<T>(method, url, {
            body: options.body,
            params: options.params,
            headers
          });
        }),
        catchError((error) => {
          console.error('HTTP error:', error);
          throw error;
        })
      );
    }
}