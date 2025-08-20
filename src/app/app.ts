
/**
 * @fileoverview Componente principal de la aplicación
 * @author Uriel García
 * @description Task Management App - Aplicación moderna con glassmorphism
 * @version 1.0.0
 * @created 2025-08-20
 * @stack Angular 20, TypeScript, Tailwind CSS
 */

import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('angular-example');
}
