// features/log/domain/TipoModulo.ts

export class TipoModulo {
    static readonly MODULO_DIGITALIZADOR = 'MODULO_DIGITALIZADOR';
    static readonly MODULO_CONSULTAS = 'MODULO_CONSULTAS';
    static readonly MODULO_ADMINISTRACION_USUARIOS = 'MODULO_ADMINISTRACION_USUARIOS';
    static readonly MODULO_LEGAL = 'MODULO_LEGAL';
    static readonly MODULO_SOPORTE = 'MODULO_SOPORTE';
    static readonly MODULO_AUDITORIA = 'MODULO_AUDITORIA';
  
    private readonly value: string;
  
    constructor(value: string) {
      if (!TipoModulo.isValid(value)) {
        throw new Error('Tipo de módulo inválido');
      }
      this.value = value;
    }
  
    public getValue(): string {
      return this.value;
    }
  
    public equals(other: TipoModulo): boolean {
      return this.value === other.value;
    }
  
    private static isValid(value: string): boolean {
      return [
        TipoModulo.MODULO_DIGITALIZADOR,
        TipoModulo.MODULO_CONSULTAS,
        TipoModulo.MODULO_ADMINISTRACION_USUARIOS,
        TipoModulo.MODULO_LEGAL,
        TipoModulo.MODULO_SOPORTE,
        TipoModulo.MODULO_AUDITORIA
      ].includes(value);
    }
  }
  