import { Cedula } from "./ValueObject/Cedula";
import { NombreCompleto } from "./ValueObject/NombreCompleto";

export class Egresado {
  public id: string | null;
  public cedula: Cedula | null;
  private nombreCompleto: NombreCompleto;

  constructor(id : string | null, cedula: Cedula | null, nombreCompleto: NombreCompleto) {
    this.id = id;
    this.cedula = cedula;
    this.nombreCompleto = nombreCompleto;
  }

  public getNombre(): string {
    return this.nombreCompleto.getNombre();
  }

  public getApellido(): string {
    return this.nombreCompleto.getApellido();
  }

  public getNombreCompleto(): NombreCompleto {
    return this.nombreCompleto;
  }
}

  