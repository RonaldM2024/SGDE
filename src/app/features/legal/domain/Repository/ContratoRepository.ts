// features/legal/domain/Repository/ContratoRepository.ts

import { Observable } from 'rxjs';
import { Contrato } from '../Contrato';
import { TipoContrato } from '../ValueObject/TipoContrato';

// Interfaz ContratoRepository que define los métodos para interactuar con los contratos en el sistema.
export interface ContratoRepository {
  registrarContrato(contrato: Contrato): Promise<string>;
  consultarContratoPorId(id: string): Observable<Contrato | null>;
  consultarContratosPorTipo(tipo: TipoContrato): Observable<Contrato[]>;
  consultarContratos(): Observable<Contrato[]>;
  actualizarContrato(id: string, contrato: Contrato): Promise<void>;
  eliminarContrato(id: string): Promise<void>;
}
