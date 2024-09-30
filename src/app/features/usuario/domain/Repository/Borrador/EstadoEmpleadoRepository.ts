// EstadoEmpleadoRepository.ts
import { EstadoEmpleado } from '../../ValueObject/EstadoEmpleado';

export interface EstadoEmpleadoRepository {
  crearEstadoEmpleado(estadoEmpleado: EstadoEmpleado): Promise<void>;
  consultarEstadoEmpleado(id: string): Promise<EstadoEmpleado | null>;
  consultarEstadosEmpleado(): Promise<EstadoEmpleado[]>;
  actualizarEstadoEmpleado(id: string, estadoEmpleado: EstadoEmpleado): Promise<void>;
}
