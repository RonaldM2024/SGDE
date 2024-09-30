import { Injectable } from '@angular/core'; // Importa Injectable para permitir la inyección de dependencias
import { AngularFirestore } from '@angular/fire/compat/firestore'; // Importa AngularFirestore para manejar la base de datos Firestore
import { Documento } from '../../../domain/Documento'; // Importa la clase Documento
import { from, Observable } from 'rxjs'; // Importa Observable para manejar operaciones asincrónicas
import { finalize, map, switchMap } from 'rxjs/operators'; // Importa operadores de RxJS para manejar el flujo de datos
import { TipoDocumento } from '../../../domain/ValueObject/TipoDocumento'; // Importa la clase TipoDocumento
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root' // Hace que el servicio esté disponible en toda la aplicación
})
export class FirestoreDocumentoRepositoryService {
  private collectionName = 'documentos'; // Nombre de la colección en Firestore

  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage
  ) {} // Inyecta AngularFirestore en el constructor

  // Método para crear un nuevo documento en Firestore y subir una imagen a Cloud Storage
  createDocumento(documento: Documento, file: File): Promise<void> {
    const id = this.firestore.createId(); // Genera un ID automáticamente
    documento.id = id; // Asigna el ID generado al documento
    const filePath = `documentos/${id}`; // Define la ruta del archivo en Cloud Storage

    return this.uploadImage(filePath, file).pipe(
      switchMap(url => {
        if (!url) {
          return Promise.reject('Error al obtener la URL del archivo subido');
        }
        documento.imagenUrl = url; // Asigna la URL de la imagen al documento
        return from(this.firestore.collection(this.collectionName).doc(id).set(this.mapDocumentoToPlainObject(documento)));
      })
    ).toPromise() as Promise<void>;
  }

  // Método para subir una imagen a Cloud Storage
  private uploadImage(filePath: string, file: File): Observable<string> {
    const fileRef = this.storage.ref(filePath); // Obtiene una referencia al archivo en la ubicación especificada
    const task = this.storage.upload(filePath, file); // Inicia la subida del archivo

    // Devuelve un observable que emite la URL de descarga una vez que el archivo se haya subido
    return new Observable<string>(observer => {
      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(url => {
            observer.next(url); // Emite la URL de descarga
            observer.complete(); // Completa el observable
          }, error => {
            observer.error(error); // Maneja el error
          });
        })
      ).subscribe();
    });
  }

  // Método para obtener un documento por su ID
  getDocumento(id: string): Observable<Documento | undefined> {
    return this.firestore
      .collection(this.collectionName) // Accede a la colección de documentos
      .doc(id) // Obtiene el documento con el ID especificado
      .snapshotChanges() // Escucha los cambios en el documento
      .pipe(
        map(snapshot => {
          const data = snapshot.payload.data() as any; // Obtiene los datos del documento
          if (data) {
            return new Documento(
              data.id,
              data.egresadoId, // Utiliza egresadoId en lugar de egresadoCedula
              new TipoDocumento(data.tipoDocumento),
              data.contenido,
              data.imagenUrl
            ); // Crea una nueva instancia de Documento con los datos obtenidos
          } else {
            return undefined; // Devuelve undefined si no se encuentra el documento
          }
        })
      );
  }

  // Método para obtener documentos por el ID del egresado
  getDocumentosByEgresadoId(egresadoId: string): Observable<Documento[]> {
    return this.firestore
      .collection(this.collectionName, ref => ref.where('egresadoId', '==', egresadoId)) // Filtra los documentos por egresadoId
      .snapshotChanges() // Escucha los cambios en los documentos
      .pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as any; // Obtiene los datos de cada documento
          const id = a.payload.doc.id; // Obtiene el ID del documento
          return new Documento(
            id,
            data.egresadoId, // Utiliza egresadoId en lugar de egresadoCedula
            new TipoDocumento(data.tipoDocumento),
            data.contenido,
            data.imagenUrl
          ); // Crea una nueva instancia de Documento con los datos obtenidos
        }))
      );
  }

  // Método para actualizar un documento existente
  updateDocumento(documento: Documento): Promise<void> {
    return this.firestore
      .collection(this.collectionName) // Accede a la colección de documentos
      .doc(documento.id) // Selecciona el documento con el ID especificado
      .update(this.mapDocumentoToPlainObject(documento)); // Actualiza el documento en Firestore
  }

  // Método para eliminar un documento por su ID
  deleteDocumento(id: string): Promise<void> {
    return this.firestore
      .collection(this.collectionName) // Accede a la colección de documentos
      .doc(id) // Selecciona el documento con el ID especificado
      .delete(); // Elimina el documento de Firestore
  }

  // Método privado para convertir un objeto Documento a un objeto plano
  private mapDocumentoToPlainObject(documento: Documento): any {
    return {
      id: documento.id,
      egresadoId: documento.egresadoId, // Utiliza egresadoId en lugar de egresadoCedula
      tipoDocumento: documento.tipoDocumento.getValue(),
      contenido: documento.consultarContenido(),
      imagenUrl: documento.consultarImagenUrl()
    };
  }
}
