export class Email {
    private readonly value: string;
  
    constructor(value: string) {
      if (!this.validate(value)) {
        throw new Error('Email inválido');
      }
      this.value = value;
    }
  
    private validate(value: string): boolean {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    }
  
    public getValue(): string {
      return this.value;
    }
    
    public equals(other: Email): boolean {
      return this.value === other.value;
    }
  }
  