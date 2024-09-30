import { Observable } from 'rxjs';
import { Cedula } from '../../../egresado/domain/ValueObject/Cedula';
import { Documento } from '../Documento';

export interface DocumentoRepository {
  crearDocumento(documento: Documento): Promise<void>;
  consultarDocumento(id: Cedula): Observable<Documento | null>;
  consultarDocumentos(): Observable<Documento[]>;
  actualizarDocumento(id: Cedula, documento: Documento): Promise<void>;
}
