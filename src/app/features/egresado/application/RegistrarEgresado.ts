import { Egresado } from "../domain/Egresado";
import { EgresadoRepository } from "../domain/Repository/EgresadoRepository";

export class RegistrarEgresado {
  private repository: EgresadoRepository;

  constructor(repository: EgresadoRepository) {
    this.repository = repository;
  }

  public async ejecutar(egresado: Egresado): Promise<void> {
    // Aquí puedes agregar lógica adicional, como validaciones o reglas de negocio
    await this.repository.registrarEgresado(egresado);
  }
}