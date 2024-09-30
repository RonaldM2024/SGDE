import { Observable } from 'rxjs';
import { Egresado } from '../domain/Egresado';
import { EgresadoRepository } from '../domain/Repository/EgresadoRepository';

export class ConsultarTodosLosEgresados {
  private egresadoRepository: EgresadoRepository;

  constructor(egresadoRepository: EgresadoRepository) {
    this.egresadoRepository = egresadoRepository;
  }

  public ejecutar(): Observable<Egresado[]> {
    return this.egresadoRepository.consultarEgresados();
  }
}
