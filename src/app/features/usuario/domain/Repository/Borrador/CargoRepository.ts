// CargoRepository.ts
import { Cargo } from '../../ValueObject/Cargo';

export interface CargoRepository {
  crearCargo(cargo: Cargo): Promise<void>;
  consultarCargo(id: string): Promise<Cargo | null>;
  consultarCargos(): Promise<Cargo[]>;
  actualizarCargo(id: string, cargo: Cargo): Promise<void>;
}
