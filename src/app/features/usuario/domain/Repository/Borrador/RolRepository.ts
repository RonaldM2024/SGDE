// RolRepository.ts
import { Rol } from '../../ValueObject/Rol';

export interface RolRepository {
  crearRol(rol: Rol): Promise<void>;
  consultarRol(id: string): Promise<Rol | null>;
  consultarRoles(): Promise<Rol[]>;
  actualizarRol(id: string, rol: Rol): Promise<void>;
}
