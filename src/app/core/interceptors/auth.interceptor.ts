import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { from, Observable, switchMap } from 'rxjs';
import { CognitoService } from '../../features/auth/services/cognito';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private cognitoService: CognitoService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('hereeeee');
    return from(this.cognitoService.getJwtToken()).pipe(
      switchMap(token => {
        let authReq = req;
        console.log('Token obtenido en el interceptor:', token);
        if (token) {
          authReq = req.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`
            }
          });
        }
        return next.handle(authReq);
      })
    );
  }
}
