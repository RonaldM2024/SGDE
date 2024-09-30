export class TipoDocumento {
    static readonly tiposValidos = [
      'Acta de grado frontal',
      'Acta de grado posterior',
      'Certificado de promoción de curso (Primer Ciclo Básico)',
      'Certificado de promoción de curso (Segundo Ciclo Básico)',
      'Certificado de promoción de curso (Tercer Ciclo Básico)',
      'Certificado de promoción de curso (Primer Ciclo Diversificado)',
      'Certificado de promoción de curso (Segundo Ciclo Diversificado)',
      'Certificado de aptitud',
    ];
  
    private value: string;
  
    constructor(value: string) {
      if (!TipoDocumento.tiposValidos.includes(value)) {
        throw new Error('Tipo de documento inválido');
      }
      this.value = value;
    }
  
    public getValue(): string {
      return this.value;
    }
  
    public equals(other: TipoDocumento): boolean {
      return this.value === other.value;
    }
  }
  