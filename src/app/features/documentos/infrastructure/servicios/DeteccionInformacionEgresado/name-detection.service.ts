import { Injectable } from '@angular/core'; // Importa Injectable para permitir la inyección de dependencias
import { HttpClient } from '@angular/common/http'; // Importa HttpClient para realizar solicitudes HTTP
import { Observable } from 'rxjs'; // Importa Observable para manejar operaciones asincrónicas
import { map } from 'rxjs/operators'; // Importa operadores de RxJS para manejar el flujo de datos

@Injectable({
  providedIn: 'root', // Hace que el servicio esté disponible en toda la aplicación
})
export class NameDetectionService {
  private irrelevantWords: Set<string> = new Set([ // Conjunto de palabras irrelevantes que deben ser ignoradas
    'LA', 'DEL', 'EL', 'Y', 'EN', 'A', 'AL', 'LAS', 'POR', 'CON', 'PARA', 'SE'
  ]);
  private namesSet: Set<string> = new Set(); // Conjunto para almacenar nombres relevantes

  constructor(private http: HttpClient) {} // Inyecta HttpClient en el constructor

  // Método para cargar los nombres desde un archivo CSV
  loadNames(csvUrl: string): Observable<void> {
    return this.http.get(csvUrl, { responseType: 'text' }).pipe( // Realiza una solicitud GET para obtener el CSV
      map((csvData: string) => {
        this.processNames(csvData); // Procesa los datos del CSV
      })
    );
  }

  // Método privado para procesar los nombres del CSV
  private processNames(csvData: string): void {
    const rows = csvData.split('\n'); // Divide el CSV en filas
    rows.forEach(row => {
      const name = row.trim().toUpperCase(); // Limpia y convierte el nombre a mayúsculas
      if (name && !this.irrelevantWords.has(name)) { // Si el nombre no está vacío y no es irrelevante
        this.namesSet.add(name); // Añade el nombre al conjunto de nombres
      }
    });
  }

  // Método para detectar nombres en un texto dado
  detectNames(text: string): string[] {
    const cleanText = text.replace(/[^\w\s]/g, '').toUpperCase(); // Limpia el texto y lo convierte a mayúsculas
    const words = cleanText.split(/\s+/); // Divide el texto en palabras
    const detectedNames = words.filter(word => this.namesSet.has(word)); // Filtra las palabras que están en el conjunto de nombres
    return detectedNames; // Devuelve los nombres detectados
  }
}
