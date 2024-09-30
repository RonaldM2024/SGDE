import { Observable } from 'rxjs';
import { Egresado } from '../Egresado';
import { Cedula } from '../ValueObject/Cedula';

export interface EgresadoRepository {
  registrarEgresado(egresado: Egresado): Promise<string>;
  consultarEgresadoPorCedula(id: Cedula): Observable<Egresado | null>;
  consultarEgresadoPorNombre(id: string): Observable<Egresado | null>;
  consultarEgresadoPorApellido(id: string): Observable<Egresado | null>;
  consultarEgresados(): Observable<Egresado[]>;
  actualizarEgresado(id: string, egresado: Egresado): Promise<void>;
}
