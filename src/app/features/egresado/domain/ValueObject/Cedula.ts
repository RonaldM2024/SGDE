import { isValidCI } from "./validateCI";

export class Cedula {
    private readonly value!: string;
  
    constructor(value: string) {
      if (value && Array.isArray(value) && value.length > 0) {
        // Obtenemos el primer elemento del array
        const cedula = value[0];
        if (typeof cedula === 'string') {
          if (!this.validate(cedula)) {
            throw new Error('Invalid cedula');
          }
          this.value = value;
        } else {
          console.error("El valor del primer elemento no es una string");
        }
      } else {
        this.value = value;
      }
    }
  
    private validate(value: string): boolean {
      // Utiliza la función isValidCI para validar la cédula
      return isValidCI(value);
    }
  
    public getValue(): string {
      return this.value;
    }
  
    public equals(other: Cedula): boolean {
      return this.value === other.value;
    }
  }
  