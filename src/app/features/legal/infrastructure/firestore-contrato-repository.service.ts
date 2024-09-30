import { Injectable } from '@angular/core'; // Importa Injectable para permitir la inyección de dependencias
import { AngularFirestore } from '@angular/fire/compat/firestore'; // Importa AngularFirestore para manejar la base de datos Firestore
import { Observable } from 'rxjs'; // Importa Observable para manejar operaciones asincrónicas
import { map } from 'rxjs/operators'; // Importa operadores de RxJS para manejar el flujo de datos
import { ContratoRepository } from '../domain/Repository/ContratoRepository'; // Importa la interfaz del repositorio
import { Contrato } from '../domain/Contrato';
import { TipoContrato } from '../domain/ValueObject/TipoContrato';

@Injectable({
  providedIn: 'root' // Hace que el servicio esté disponible en toda la aplicación
})
export class FirestoreContratoRepositoryService implements ContratoRepository {
  private collectionName = 'contratos'; // Nombre de la colección en Firestore

  constructor(private firestore: AngularFirestore) {} // Inyecta AngularFirestore en el constructor

  // Método para registrar un contrato en Firestore
  registrarContrato(contrato: Contrato): Promise<string> {
    const id = this.firestore.createId(); // Genera un ID único para el contrato
    contrato.id = id; // Asigna el ID generado al contrato
    return this.firestore.collection(this.collectionName).doc(id).set(this.mapContratoToPlainObject(contrato)) // Guarda el contrato en Firestore con el ID generado
      .then(() => id); // Retorna el ID generado después de guardar el contrato
  }

  // Método para consultar un contrato por su ID
  consultarContratoPorId(id: string): Observable<Contrato | null> {
    return this.firestore.collection(this.collectionName).doc(id).snapshotChanges()
      .pipe(
        map(snapshot => {
          const data = snapshot.payload.data() as any;
          return data ? new Contrato(
            data.id, 
            data.titulo, 
            data.fechaInicio.toDate(), 
            data.fechaFin.toDate(), 
            data.partesInvolucradas, 
            new TipoContrato(data.tipo), 
            data.contenido
          ) : null;
        })
      ); // Devuelve un observable con el contrato encontrado o null si no se encuentra
  }

  // Método para consultar contratos por tipo de contrato
  consultarContratosPorTipo(tipo: TipoContrato): Observable<Contrato[]> {
    return this.firestore.collection(this.collectionName, ref => ref.where('tipo', '==', tipo.getValue()))
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data() as any;
            return new Contrato(
              data.id, 
              data.titulo, 
              data.fechaInicio.toDate(), 
              data.fechaFin.toDate(), 
              data.partesInvolucradas, 
              new TipoContrato(data.tipo), 
              data.contenido
            );
          });
        })
      ); // Devuelve un observable con la lista de contratos encontrados
  }

  // Método para consultar todos los contratos
  consultarContratos(): Observable<Contrato[]> {
    return this.firestore.collection(this.collectionName).snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data() as any;
            return new Contrato(
              data.id, 
              data.titulo, 
              data.fechaInicio.toDate(), 
              data.fechaFin.toDate(), 
              data.partesInvolucradas, 
              new TipoContrato(data.tipo), 
              data.contenido
            );
          });
        })
      ); // Devuelve un observable con la lista de todos los contratos
  }

  // Método para actualizar un contrato
  actualizarContrato(id: string, contrato: Contrato): Promise<void> {
    return this.firestore.collection(this.collectionName).doc(id).update(this.mapContratoToPlainObject(contrato)); // Actualiza el contrato en Firestore
  }

  // Método para eliminar un contrato
  eliminarContrato(id: string): Promise<void> {
    return this.firestore.collection(this.collectionName).doc(id).delete(); // Elimina el contrato de Firestore
  }

  // Convierte un objeto Contrato a un objeto plano para almacenarlo en Firestore
  private mapContratoToPlainObject(contrato: Contrato): any {
    return {
      id: contrato.id,
      titulo: contrato.titulo,
      fechaInicio: contrato.fechaInicio,
      fechaFin: contrato.fechaFin,
      partesInvolucradas: contrato.partesInvolucradas,
      tipo: contrato.tipoContrato.getValue(),
      contenido: contrato.contenido
    };
  }
}
