/**
 * @fileoverview Componente Footer Profesional
 * @author Uriel García
 * @description Footer con marca profesional para prueba técnica
 * @version 1.0.0
 * @created 2025-08-20
 */

import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <div class="fixed bottom-4 left-4 z-50 pointer-events-none">
      <div class="group backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl px-4 py-3 shadow-2xl 
                  pointer-events-auto transition-all duration-300 hover:bg-white/20 hover:border-white/30 
                  hover:shadow-blue-500/20 hover:shadow-2xl hover:scale-105">
        <div class="flex items-center space-x-3 text-white/80">
          <div class="relative w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl 
                      flex items-center justify-center shadow-lg group-hover:scale-110 
                      transition-transform duration-300 ring-2 ring-white/20 group-hover:ring-white/40">
            <span class="text-white text-sm font-bold">UG</span>
            <!-- Efecto de brillo -->
            <div class="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-xl 
                        opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
          </div>
          <div class="text-sm">
            <div class="flex items-center space-x-2">
              <span class="font-medium text-white/90">Desarrollado por</span>
              <span class="text-white font-semibold bg-gradient-to-r from-blue-400 to-cyan-400 
                           bg-clip-text text-transparent group-hover:from-blue-300 group-hover:to-cyan-300">
                Uriel García
              </span>
            </div>
            <div class="flex items-center space-x-1 text-xs text-white/60 group-hover:text-white/80 
                        transition-colors duration-300">
              <span class="inline-flex items-center">
                <span class="w-2 h-2 bg-emerald-400 rounded-full mr-1 animate-pulse"></span>
                Prueba Técnica
              </span>
              <span class="text-white/40">•</span>
              <span>Angular 20</span>
              <span class="text-white/40">•</span>
              <span>Tasks Management</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Posicionamiento absoluto respecto al viewport */
    .fixed {
      position: fixed !important;
    }
    
    .z-50 {
      z-index: 50 !important;
    }
    
    /* Animación de entrada suave */
    .group {
      animation: slideInLeft 0.8s ease-out;
    }
    
    @keyframes slideInLeft {
      from {
        opacity: 0;
        transform: translateX(-100%);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
    
    /* Efecto glassmorphism mejorado */
    .backdrop-blur-xl {
      -webkit-backdrop-filter: blur(24px);
      backdrop-filter: blur(24px);
    }
    
    /* Efectos hover mejorados */
    .group:hover {
      transform: scale(1.05) translateY(-2px);
      box-shadow: 0 20px 40px rgba(59, 130, 246, 0.3), 0 0 20px rgba(6, 182, 212, 0.2);
    }
    
    /* Texto gradient animado */
    .bg-clip-text {
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    /* Pulse animation para el indicador */
    .animate-pulse {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    
    @keyframes pulse {
      0%, 100% {
        opacity: 1;
        transform: scale(1);
      }
      50% {
        opacity: 0.8;
        transform: scale(1.1);
      }
    }
    
    /* Ring effect */
    .ring-2 {
      box-shadow: 0 0 0 2px currentColor;
    }
    
    /* Media queries para responsive */
    @media (max-width: 640px) {
      .fixed {
        bottom: 1rem !important;
        left: 1rem !important;
      }
      
      .group {
        padding: 0.75rem 1rem;
      }
      
      .text-sm {
        font-size: 0.75rem;
      }
      
      .text-xs {
        font-size: 0.625rem;
      }
      
      .w-8 {
        width: 1.5rem;
        height: 1.5rem;
      }
      
      .space-x-3 > :not([hidden]) ~ :not([hidden]) {
        margin-left: 0.5rem;
      }
    }
    
    /* Optimización para dispositivos con movimiento reducido */
    @media (prefers-reduced-motion: reduce) {
      .group {
        animation: none;
      }
      
      .animate-pulse {
        animation: none;
      }
      
      .transition-all,
      .transition-transform,
      .transition-opacity,
      .transition-colors {
        transition: none;
      }
    }
  `]
})
export class FooterComponent { }
