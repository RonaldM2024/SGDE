import { Manual } from '../Manual';
import { Observable } from 'rxjs';

export interface ManualRepository {
  crearManual(manual: Manual, file: File): Promise<string>;
  consultarManualPorId(id: string): Observable<Manual | null>;
  actualizarManual(manual: Manual): Promise<void>;
  eliminarManual(id: string, filePath: string): Promise<void>;
  listarManuales(): Observable<Manual[]>;
}
