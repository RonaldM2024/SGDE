import { Injectable } from '@angular/core'; // Importa Injectable para permitir la inyección de dependencias
import { isValidCI } from 'src/app/features/egresado/domain/ValueObject/validateCI'; // Importa la función isValidCI para validar cédulas

@Injectable({
  providedIn: 'root' // Hace que el servicio esté disponible en toda la aplicación
})
export class CiDetectionService {
  
  constructor() { } // Constructor vacío

  // Método para detectar cédulas en un texto dado
  detectCIs(text: string): string[] {
    const ciRegex = /\b\d{10}\b/g; // Expresión regular para encontrar secuencias de 10 dígitos
    const matches = text.match(ciRegex) || []; // Encuentra todas las coincidencias en el texto
    return matches.filter(ci => isValidCI(ci)); // Filtra las coincidencias que son cédulas válidas
  }
}
