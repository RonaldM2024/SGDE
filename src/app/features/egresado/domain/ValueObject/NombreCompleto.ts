export class NombreCompleto {
    private readonly nombre: string;
    private readonly apellido: string;
  
    constructor(nombre: string, apellido: string) {
      if (!this.validarNombre(nombre)) {
        throw new Error('Nombre inválido');
      }
      if (!this.validarApellido(apellido)) {
        throw new Error('Apellido inválido');
      }
      this.nombre = nombre;
      this.apellido = apellido;
    }
  
    private validarNombre(nombre: string): boolean {
      // Agrega tu lógica de validación aquí (por ejemplo, no vacío, longitud mínima, etc.)
      return nombre.length > 0 && nombre.length <= 50;
    }
  
    private validarApellido(apellido: string): boolean {
      // Agrega tu lógica de validación aquí (por ejemplo, no vacío, longitud mínima, etc.)
      return apellido.length > 0 && apellido.length <= 50;
    }
  
    public getNombre(): string {
      return this.nombre;
    }
  
    public getApellido(): string {
      return this.apellido;
    }
  
    public equals(other: NombreCompleto): boolean {
      return this.nombre === other.nombre && this.apellido === other.apellido;
    }
  }
  