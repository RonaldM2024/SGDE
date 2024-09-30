import { ModelOCR } from '../../domain/Models/ModelORC'; // Importa la interfaz ModelOCR
import { Injectable } from '@angular/core'; // Importa Injectable para permitir la inyección de dependencias
import Tesseract from 'tesseract.js'; // Importa Tesseract.js para el reconocimiento óptico de caracteres

@Injectable({
  providedIn: 'root' // Hace que el servicio esté disponible en toda la aplicación
})
export class TesseractModelOCR implements ModelOCR {

  constructor() { } // Constructor vacío

  // Método para extraer texto de una imagen
  async extraerTextoDeImagen(imagenPath: string): Promise<string> {
    return Tesseract.recognize(
      imagenPath, // Ruta de la imagen
      'spa', // Idioma del OCR (español)
      {
        logger: m => console.log(m) // Logger para mostrar el progreso en la consola
      }
    ).then(({ data: { text } }) => text); // Devuelve el texto extraído
  }
}
