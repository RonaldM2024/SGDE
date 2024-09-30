import { Injectable } from '@angular/core'; // Importa Injectable para permitir la inyección de dependencias
import { AngularFirestore } from '@angular/fire/compat/firestore'; // Importa AngularFirestore para manejar la base de datos Firestore
import { Observable } from 'rxjs'; // Importa Observable para manejar operaciones asincrónicas
import { map, take } from 'rxjs/operators'; // Importa operadores de RxJS para manejar el flujo de datos
import { EgresadoRepository } from '../domain/Repository/EgresadoRepository'; // Importa la interfaz del repositorio
import { Egresado } from '../domain/Egresado'; // Importa la clase Egresado
import { Cedula } from '../domain/ValueObject/Cedula'; // Importa la clase Cedula
import { NombreCompleto } from '../domain/ValueObject/NombreCompleto'; // Importa la clase NombreCompleto

@Injectable({
  providedIn: 'root' // Hace que el servicio esté disponible en toda la aplicación
})
export class FirestoreEgresadoRepository implements EgresadoRepository {
  private collectionName = 'egresados'; // Nombre de la colección en Firestore

  constructor(private firestore: AngularFirestore) {} // Inyecta AngularFirestore en el constructor

  // Método para registrar un egresado en Firestore
  registrarEgresado(egresado: Egresado): Promise<string> {
    const id = this.firestore.createId(); // Genera un ID único para el egresado
    egresado.id = id; // Asigna el ID generado al egresado
    return this.firestore.collection(this.collectionName).doc(id).set(this.mapEgresadoToPlainObject(egresado)) // Guarda el egresado en Firestore con el ID generado
      .then(() => id); // Retorna el ID generado después de guardar el egresado
  }

  // Método para consultar un egresado por cédula
  consultarEgresadoPorCedula(cedula: Cedula): Observable<Egresado | null> {
    return this.firestore.collection(this.collectionName, ref => ref.where('cedula', '==', cedula.getValue()))
      .snapshotChanges()
      .pipe(
        map(actions => {
          const data = actions.map(a => a.payload.doc.data() as any);
          return data.length ? new Egresado(data[0].id, new Cedula(data[0].cedula), new NombreCompleto(data[0].nombre, data[0].apellido)) : null;
        })
      ); // Devuelve un observable con el egresado encontrado o null si no se encuentra
  }

  // Método para consultar un egresado por nombre
  consultarEgresadoPorNombre(nombre: string): Observable<Egresado | null> {
    return this.firestore.collection(this.collectionName, ref => ref.where('nombre', '==', nombre))
      .snapshotChanges()
      .pipe(
        map(actions => {
          const data = actions.map(a => a.payload.doc.data() as any);
          return data.length ? new Egresado(data[0].id, data[0].cedula ? new Cedula(data[0].cedula) : null, new NombreCompleto(data[0].nombre, data[0].apellido)) : null;
        })
      ); // Devuelve un observable con el egresado encontrado o null si no se encuentra
  }

  // Método para consultar un egresado por apellido
  consultarEgresadoPorApellido(apellido: string): Observable<Egresado | null> {
    return this.firestore.collection(this.collectionName, ref => ref.where('apellido', '==', apellido))
      .snapshotChanges()
      .pipe(
        map(actions => {
          const data = actions.map(a => a.payload.doc.data() as any);
          return data.length ? new Egresado(data[0].id, data[0].cedula ? new Cedula(data[0].cedula) : null, new NombreCompleto(data[0].nombre, data[0].apellido)) : null;
        })
      ); // Devuelve un observable con el egresado encontrado o null si no se encuentra
  }

  consultarEgresadoPorNombreCompleto(nombre: string, apellido: string): Observable<Egresado | null> {
    return this.firestore.collection(this.collectionName, ref => ref.where('nombre', '==', nombre).where('apellido', '==', apellido))
      .snapshotChanges()
      .pipe(
        map(actions => {
          const data = actions.map(a => a.payload.doc.data() as any);
          return data.length ? new Egresado(data[0].id, data[0].cedula ? new Cedula(data[0].cedula) : null, new NombreCompleto(data[0].nombre, data[0].apellido)) : null;
        }),
        take(1) // Asegura que solo se emita el primer valor y luego se complete
      );
  }

  // Método para consultar todos los egresados
  consultarEgresados(): Observable<Egresado[]> {
    return this.firestore.collection(this.collectionName)
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data() as any;
            return new Egresado(data.id, data.cedula ? new Cedula(data.cedula) : null, new NombreCompleto(data.nombre, data.apellido));
          });
        })
      ); // Devuelve un observable con la lista de todos los egresados
  }

  // Método para actualizar un egresado
  actualizarEgresado(id: string | null, egresado: Egresado): Promise<void> {
    if (id) {
      return this.firestore.collection(this.collectionName).doc(id).update(this.mapEgresadoToPlainObject(egresado));
    } else {
      // Handle the case when ID is null
      return Promise.reject('ID no proporcionado');
    }
  }

  // Método para buscar egresados por nombre
  buscarEgresadosPorNombre(nombre: string): Observable<Egresado[]> {
    return this.firestore.collection(this.collectionName, ref => ref.where('nombre', '==', nombre))
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data() as any;
            return new Egresado(data.id, data.cedula ? new Cedula(data.cedula) : null, new NombreCompleto(data.nombre, data.apellido));
          });
        })
      ); // Devuelve un observable con la lista de egresados con el mismo nombre
  }

  // Método para buscar egresados por apellido
  buscarEgresadosPorApellido(apellido: string): Observable<Egresado[]> {
    return this.firestore.collection(this.collectionName, ref => ref.where('apellido', '==', apellido))
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data() as any;
            return new Egresado(data.id, data.cedula ? new Cedula(data.cedula) : null, new NombreCompleto(data.nombre, data.apellido));
          });
        })
      ); // Devuelve un observable con la lista de egresados con el mismo apellido
  }

  // Convierte un objeto Egresado a un objeto plano para almacenarlo en Firestore
  private mapEgresadoToPlainObject(egresado: Egresado): any {
    return {
      id: egresado.id,
      cedula: egresado.cedula ? egresado.cedula.getValue() : null,
      nombre: egresado.getNombre(),
      apellido: egresado.getApellido()
    };
  }
}
