# 🌟 Task Management App - Prueba Técnica MVS

> **Aplicación de gestión de tareas con diseño glassmorphism profesional**

![Angular](https://img.shields.io/badge/Angular-20-red?style=for-the-badge&logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-cyan?style=for-the-badge&logo=tailwindcss)
![AWS](https://img.shields.io/badge/AWS-Cognito-orange?style=for-the-badge&logo=amazon-aws)

## 📱 Demo en Vivo

🔗 **[Ver aplicación en vivo](http://3.80.68.247/)** *(actualizar después del deployment)*

## ✨ Características Principales

### 🎨 Diseño & UX
- **Glassmorphism moderno** con efectos de blur y transparencias profesionales
- **Diseño responsivo** optimizado para móvil y desktop
- **Animaciones fluidas** y transiciones suaves
- **Esquema de colores profesional** en tonos slate/gray
- **Componentes reutilizables** con arquitectura modular

### 🔐 Autenticación
- **AWS Cognito** integrado para gestión de usuarios
- **Registro de usuarios** con validación avanzada de contraseñas
- **Login seguro** con manejo de sesiones
- **Guards de autenticación** para proteger rutas

### 📋 Gestión de Tareas
- **CRUD completo** de tareas
- **Estados de tareas** (Pendiente, En Progreso, Completada)
- **Prioridades** configurables (Alta, Media, Baja)
- **Fechas de vencimiento** con validación
- **Interfaz intuitiva** para gestión eficiente

### 🏗️ Arquitectura Técnica
- **Angular 20** con standalone components
- **TypeScript** con tipado estricto
- **Signals** para manejo de estado reactivo
- **Reactive Forms** con validaciones customizadas
- **Lazy Loading** para optimización de rendimiento
- **Interceptores HTTP** para manejo de autenticación

## 🚀 Instalación y Desarrollo

### Prerrequisitos
- Node.js (v18+)
- npm (v9+)
- Angular CLI (v20+)

### Instalación
```bash
# Clonar repositorio
git clone [url-del-repo]
cd frontend

# Instalar dependencias
npm install

# Configurar entorno
cp src/environments/environment.example.ts src/environments/environment.ts
# Editar environment.ts con tus configuraciones de AWS Cognito

# Iniciar servidor de desarrollo
npm start
```

### Scripts Disponibles
```bash
npm start              # Servidor de desarrollo (ng serve)
npm run build          # Build de producción con SSR
npm run build:static   # Build estático para deployment
npm test               # Ejecutar tests
npm run deploy         # Deploy automático a EC2
```

## � Deployment en AWS EC2

### 🎯 Deployment Rápido
```bash
# 1. Crear instancia EC2 (t3.micro, Ubuntu 20.04, Security Group con puerto 80)
# 2. Ejecutar script de deployment
./deploy/quick-deploy.sh TU-IP-EC2 ~/.ssh/tu-key.pem
```

### 📚 Documentación Completa
- **[Guía de Deployment](DEPLOYMENT.md)** - Instrucciones paso a paso
- **[Configuración AWS](deploy/README.md)** - Setup detallado de EC2 y Cognito

---

### 🎯 Para Evaluadores

Esta aplicación demuestra:
- ✅ **Dominio de Angular moderno** (v20, Signals, Standalone Components)
- ✅ **Integración con servicios AWS** (Cognito)
- ✅ **Diseño UI/UX profesional** con glassmorphism
- ✅ **Arquitectura escalable** y mantenible
- ✅ **Deployment en producción** (AWS EC2)
- ✅ **Mejores prácticas** de desarrollo
- ✅ **Documentación completa** y profesional

**Demo live**: [Actualizar con URL después del deployment]

---

## 👨‍� Autor

**Uriel García**  
*Full Stack Developer | Angular & AWS Specialist*

*Desarrollado con ❤️ para demostrar habilidades técnicas y creatividad en desarrollo frontend moderno.*

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.1.5.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
