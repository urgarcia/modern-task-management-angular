import { ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { provideRouter } from '@angular/router';
import { provideZonelessChangeDetection } from '@angular/core';

// Asumiendo que tus rutas están definidas en este archivo
import { routes } from './app.routes'; 
import { provideHttpClient } from '@angular/common/http';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideRouter(routes),
    provideZonelessChangeDetection(),
    provideHttpClient()
  ]
};

export const config = serverConfig;