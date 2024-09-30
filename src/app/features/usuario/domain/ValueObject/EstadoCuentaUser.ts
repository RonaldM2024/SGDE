export class EstadoCuentaUser {
    private static readonly estadosValidos = [
      'INACTIVO',
      'ACTIVO',
      'SUSPENDIDA'
    ];
  
    private estado: string;
  
    constructor(estado: string) {
      if (!EstadoCuentaUser.estadosValidos.includes(estado)) {
        throw new Error(`Estado inválido: ${estado}`);
      }
      this.estado = estado;
    }
  
    public getEstado(): string {
      return this.estado;
    }
  
    public setEstado(nuevoEstado: string): void {
      if (!EstadoCuentaUser.estadosValidos.includes(nuevoEstado)) {
        throw new Error(`Estado inválido: ${nuevoEstado}`);
      }
      this.estado = nuevoEstado;
    }
  
    public static esEstadoValido(estado: string): boolean {
      return EstadoCuentaUser.estadosValidos.includes(estado);
    }
  
    public static getEstadosValidos(): string[] {
      return [...EstadoCuentaUser.estadosValidos];
    }
  }
  