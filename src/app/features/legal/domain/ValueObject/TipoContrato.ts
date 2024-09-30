// Clase TipoContrato que representa el tipo de un contrato legal.
export class TipoContrato {
    private static readonly tiposValidos = [
      'Políticas de Privacidad', // Tipo de contrato para Políticas de Privacidad.
      'Términos de Servicio', // Tipo de contrato para Términos de Servicio.
      'Condiciones de uso',
      'Otros'
    ];
  
    private readonly value: string; // Valor del tipo de contrato.
  
    // Constructor de la clase TipoContrato.
    constructor(value: string) {
      if (!TipoContrato.tiposValidos.includes(value)) {
        throw new Error('Tipo de contrato inválido'); // Lanza un error si el tipo de contrato no es válido.
      }
      this.value = value;
    }
  
    // Método que obtiene el valor del tipo de contrato.
    public getValue(): string {
      return this.value;
    }
  
    // Método que compara dos tipos de contrato.
    public equals(other: TipoContrato): boolean {
      return this.value === other.value;
    }
  
    // Método estático que obtiene todos los tipos de contrato válidos.
    public static getTiposValidos(): string[] {
      return TipoContrato.tiposValidos;
    }
  }