import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Amplify } from 'aws-amplify';
import { signIn, signUp, signOut, getCurrentUser, SignUpOutput, fetchAuthSession } from 'aws-amplify/auth';
import { environment } from '../../../../environments/environment';

export interface IUser {
  email: string;
  password: string;
  code: string;
  name: string;
}
@Injectable({
  providedIn: 'root'
})
export class CognitoService {
  
  constructor(){
    Amplify.configure({
      Auth: {
        Cognito: {
          userPoolId: environment.cognito.userPoolId,
          userPoolClientId: environment.cognito.userPoolWebClientId
        }
      }
    });
  }

  // Inicio de sesión
  async signIn(username: string, password: string) {
    try {
      const user = await signIn({ username, password }); // Cambio de Auth.signIn a signIn
      return user;
    } catch (error) {
      console.error('Error en el inicio de sesión:', error);
      throw error;
    }
  }
  // Registro de usuario
  async signUp(email: string, password: string, name: string, username: string) {
    try {
      const user = await signUp({
        username,
        password,
        options:{
          userAttributes: {
            email,
            name
          }
        }
      });
      return user;
    } catch (error) {
      console.error('Error en el registro:', error);
      throw error;
    }
  }

  //funcion para ver si esta logeado
  async isLoggedIn(): Promise<boolean> {
    const token = await this.getJwtToken();
    return !!token;
  }

  // funcion para obtener el token
  async getJwtToken() {
    try {
      const session = await fetchAuthSession();
      
      // Intentar primero accessToken
      if (session.tokens && session.tokens.accessToken) {
        return session.tokens.accessToken.toString();
      }
      
      return null;
    } catch (error) {
      console.error('Error al obtener la sesión:', error);
      return null;
    }
  }

  // Cerrar sesión
  async signOut() {
    try {
      await signOut();
      return true;
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  }

}
