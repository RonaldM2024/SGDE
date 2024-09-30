import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Manual } from '../domain/Manual';
import { catchError, finalize, from, map, Observable, switchMap } from 'rxjs';
import { ManualRepository } from '../domain/Repository/ManualRepository';

@Injectable({
  providedIn: 'root'
})
export class FirebaseManualRepositoryService implements ManualRepository{
  private collectionName = 'manuales';

  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage
  ) {}

  // Método para crear un manual en Firestore y subir un archivo a Cloud Storage
  crearManual(manual: Manual, file: File): Promise<string> {
    const id = this.firestore.createId(); // Genera un ID único para el manual
    const filePath = `manuales/${id}`; // Define la ruta del archivo en Cloud Storage

    // Sube el archivo a Cloud Storage y obtiene la URL de descarga
    return this.uploadImage(filePath, file).pipe(
      switchMap(url => {
        if (!url) {
          return Promise.reject('Error al obtener la URL del archivo subido');
        }
        manual.id = id;
        manual.url = url;
        return from(this.firestore.collection(this.collectionName).doc(id).set(this.mapManualToPlainObject(manual)))
          .pipe(map(() => id));
      })
    ).toPromise() as Promise<string>;
  }

  // Método para subir una imagen a Cloud Storage
  uploadImage(filePath: string, file: File): Observable<string> {
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

  // Método para consultar un manual por ID
  consultarManualPorId(id: string): Observable<Manual | null> {
    return this.firestore.collection(this.collectionName).doc(id).snapshotChanges()
      .pipe(
        map(snapshot => {
          const data = snapshot.payload.data() as any;
          if (data) {
            return new Manual(data.id, data.titulo, data.fechaRegistro.toDate(), data.url);
          } else {
            return null;
          }
        })
      );
  }

  // Método para actualizar un manual
  actualizarManual(manual: Manual): Promise<void> {
    return this.firestore.collection(this.collectionName).doc(manual.id).update(this.mapManualToPlainObject(manual));
  }

  // Método para eliminar un manual
  eliminarManual(id: string, filePath: string): Promise<void> {
    return this.firestore.collection(this.collectionName).doc(id).delete().then(() => {
      return this.storage.ref(`manuales/${id}`).delete().toPromise();
    });
  }

  // Método para listar todos los manuales
  listarManuales(): Observable<Manual[]> {
    return this.firestore.collection(this.collectionName).snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data() as any;
            return new Manual(data.id, data.titulo, data.fechaRegistro.toDate(), data.url);
          });
        })
      );
  }

  // Convierte un objeto Manual a un objeto plano para almacenarlo en Firestore
  private mapManualToPlainObject(manual: Manual): any {
    return {
      id: manual.id,
      titulo: manual.titulo,
      fechaRegistro: manual.fechaRegistro,
      url: manual.url
    };
  }
}
