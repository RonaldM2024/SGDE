import { Injectable } from '@angular/core'; // Importa Injectable para permitir la inyección de dependencias
import { HttpClient } from '@angular/common/http'; // Importa HttpClient para realizar solicitudes HTTP
import { Observable } from 'rxjs'; // Importa Observable para manejar operaciones asincrónicas
import { map } from 'rxjs/operators'; // Importa operadores de RxJS para manejar el flujo de datos

@Injectable({
  providedIn: 'root', // Hace que el servicio esté disponible en toda la aplicación
})
export class SurnameDetectionService {
  private irrelevantWords: Set<string> = new Set([ // Conjunto de palabras irrelevantes que deben ser ignoradas
    'DE', 'LA', 'DEL', 'EL', 'Y', 'EN', 'A', 'AL', 'LOS', 'LAS', 'POR', 'CON', 'PARA', 'SE', "QUE", "LEY", "SU", "USO", "O", "A", "BACHILLER", "GRADO"
  ]);
  private surnamesSet: Set<string> = new Set(); // Conjunto para almacenar apellidos relevantes

  constructor(private http: HttpClient) {} // Inyecta HttpClient en el constructor

  // Método para cargar los apellidos desde un archivo CSV
  loadSurnames(csvUrl: string): Observable<void> {
    return this.http.get(csvUrl, { responseType: 'text' }).pipe( // Realiza una solicitud GET para obtener el CSV
      map((csvData: string) => {
        this.processSurnames(csvData); // Procesa los datos del CSV
      })
    );
  }

  // Método privado para procesar los apellidos del CSV
  private processSurnames(csvData: string): void {
    const rows = csvData.split('\n'); // Divide el CSV en filas
    rows.forEach(row => {
      const surname = row.trim().toUpperCase(); // Limpia y convierte el apellido a mayúsculas
      if (surname && !this.irrelevantWords.has(surname)) { // Si el apellido no está vacío y no es irrelevante
        this.surnamesSet.add(surname); // Añade el apellido al conjunto de apellidos
      }
    });
  }

  // Método para detectar apellidos en un texto dado
  detectSurnames(text: string): string[] {
    const cleanText = text.replace(/[^\w\s]/g, '').toUpperCase(); // Limpia el texto y lo convierte a mayúsculas
    const words = cleanText.split(/\s+/); // Divide el texto en palabras
    const detectedSurnames = words.filter(word => this.surnamesSet.has(word)); // Filtra las palabras que están en el conjunto de apellidos
    return detectedSurnames; // Devuelve los apellidos detectados
  }
}
