// EmpleadoRepository.ts
import { Empleado } from '../../Empleado';

export interface EmpleadoRepository {
  crearEmpleado(empleado: Empleado): Promise<void>;
  consultarEmpleado(id: string): Promise<Empleado | null>;
  consultarEmpleados(): Promise<Empleado[]>;
  actualizarEmpleado(id: string, empleado: Empleado): Promise<void>;
}
