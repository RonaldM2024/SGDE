export class Telefono {
    private readonly value: string;
  
    constructor(value: string) {
      if (!this.validate(value)) {
        throw new Error('Teléfono inválido');
      }
      this.value = value;
    }
  
    private validate(value: string): boolean {
      const telefonoRegex = /^\d{10}$/;
      return telefonoRegex.test(value);
    }
  
    public getValue(): string {
      return this.value;
    }

    public equals(other: Telefono): boolean {
      return this.value === other.value;
    }
  }
  