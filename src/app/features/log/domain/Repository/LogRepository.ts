import { Observable } from 'rxjs';
import { Log } from '../Log';
import { TipoModulo } from '../TipoModulo';

export interface LogRepository {
  registrarLog(tipoModulo: TipoModulo, log: Log): Promise<void>;
  consultarLogs(tipoModulo: TipoModulo): Observable<Log[]>;
}
