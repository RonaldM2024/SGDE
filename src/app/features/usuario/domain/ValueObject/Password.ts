export class Password {
    private readonly value: string;
  
    constructor(value: string) {
      if (!this.validate(value)) {
        throw new Error('Contraseña inválida');
      }
      this.value = value;
    }
  
    private validate(value: string): boolean {
      return typeof value === 'string' && value.length >= 6;
    }
  
    public getValue(): string {
      return this.value;
    }

    public equals(other: Password): boolean {
      return this.value === other.value;
    }
  }
  