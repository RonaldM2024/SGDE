export interface ModelCamara {
    iniciar(): void;
    tomarFoto(): Promise<string>;
    detener(): void;
    cambiarCamara(): void;
} 
  