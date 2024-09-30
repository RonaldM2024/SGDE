import { Injectable } from '@angular/core'; // Importa Injectable para permitir la inyección de dependencias
import { AngularFireStorage } from '@angular/fire/compat/storage'; // Importa AngularFireStorage para manejar el almacenamiento en Firebase
import { Observable } from 'rxjs'; // Importa Observable para manejar operaciones asincrónicas
import { finalize, map } from 'rxjs/operators'; // Importa operadores de RxJS para manejar el flujo de datos

@Injectable({
  providedIn: 'root' // Hace que el servicio esté disponible en toda la aplicación
})
export class FirestoreStorageService {
  constructor(private storage: AngularFireStorage) {} // Inyecta AngularFireStorage en el constructor

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
          });
        })
      ).subscribe();
    });
  }

  // Método para obtener las URLs de todas las imágenes en Cloud Storage
  getImages(): Observable<string[]> {
    const ref = this.storage.ref('/documentos/'); // Obtiene una referencia al directorio raíz
    return ref.listAll().pipe(
      map(result => {
        const urls: string[] = []; // Inicializa un array para almacenar las URLs
        result.items.forEach(itemRef => {
          itemRef.getDownloadURL().then(url => urls.push(url)); // Obtiene la URL de descarga para cada archivo y la añade al array
        });
        return urls; // Devuelve el array de URLs
      })
    );
  }

  getBase64ImageFromURL(url: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        const reader = new FileReader();
        reader.onloadend = function() {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(xhr.response);
      };
      xhr.onerror = function() {
        reject(new Error('Failed to load image'));
      };
      xhr.open('GET', url);
      xhr.responseType = 'blob';
      xhr.send();
    });
  }
}
