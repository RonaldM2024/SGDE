import { Injectable } from '@angular/core';
import { TipoModulo } from '../domain/TipoModulo';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Log } from '../domain/Log';
import { map, Observable } from 'rxjs';
import { BehavierIdbRepository } from '../../persistence/behavierIdb-repository.service';
import { IpService } from './IpService';

@Injectable({
  providedIn: 'root'
})
export class FirestoreLogRepositoryService {
  private collectionNames: { [key: string]: string } = {
    [TipoModulo.MODULO_DIGITALIZADOR]: 'logs_digitalizador',
    [TipoModulo.MODULO_CONSULTAS]: 'logs_consultas',
    [TipoModulo.MODULO_ADMINISTRACION_USUARIOS]: 'logs_administracion_usuarios',
    [TipoModulo.MODULO_LEGAL]: 'logs_legal',
    [TipoModulo.MODULO_SOPORTE]: 'logs_soporte',
    [TipoModulo.MODULO_AUDITORIA]: 'logs_auditoria'
  };

  constructor(
    private firestore: AngularFirestore,
    private behavierIdbRepository: BehavierIdbRepository,
    private ipService: IpService, // Inyecta el servicio de IP
  ) {}

  // Registrar un log en Firestore
  async registrarLog(tipoModulo: TipoModulo, log: Log): Promise<void> {
    const collectionName = this.collectionNames[tipoModulo.getValue()];
    if (!collectionName) {
      throw new Error(`No collection found for module type: ${tipoModulo.getValue()}`);
    }
    const id = this.firestore.createId();
    log.id = id;
    await this.firestore.collection(collectionName).doc(id).set(this.mapLogToPlainObject(log));
  }

  // Registrar acción
  async registrarAccion(tipoModulo: string, accion: string, detalle: string): Promise<void> {
    try {
      const userId = await this.behavierIdbRepository.getUserId();
      const ipAddress = await this.getCurrentIpAddress();

      if (userId) {
        const log = new Log(
          '', // ID se genera automáticamente
          accion, // Acción
          new Date(), // Fecha actual
          userId, // ID del usuario
          ipAddress, // Dirección IP
          detalle // Detalle
        );

        await this.registrarLog(new TipoModulo(tipoModulo), log);
        console.log('Log registrado con éxito');
      } else {
        console.error('No se pudo obtener el ID del usuario.');
      }
    } catch (error) {
      console.error('Error al registrar el log:', error);
    }
  }

  async getCurrentIpAddress(): Promise<string> {
    try {
      const response = await this.ipService.getIpAddress().toPromise();
      if (response && response.ip) {
        return response.ip;
      } else {
        throw new Error('No IP address found in the response.');
      }
    } catch (error) {
      console.error('Error al obtener la dirección IP:', error);
      return '127.0.0.1'; // Dirección IP por defecto en caso de error
    }
  }

  // Consultar logs de un tipo de módulo específico en Firestore
  consultarLogs(tipoModulo: TipoModulo): Observable<Log[]> {
    const collectionName = this.collectionNames[tipoModulo.getValue()];
    if (!collectionName) {
      throw new Error(`No collection found for module type: ${tipoModulo.getValue()}`);
    }
    return this.firestore.collection(collectionName).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Log;
        data.id = a.payload.doc.id;
        return data;
      }))
    );
  }

  // Mapeo de un objeto Log a un objeto plano para almacenar en Firestore
  private mapLogToPlainObject(log: Log): any {
    return {
      accion: log.accion,
      fecha: log.fecha,
      userId: log.userId,
      ip: log.ip,
      detalle: log.detalle
    };
  }
}
