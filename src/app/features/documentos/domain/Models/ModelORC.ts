// ModelOCR.ts
export interface ModelOCR {
    extraerTextoDeImagen(imagenPath: string): Promise<string>; // Devuelve el texto extraído de la imagen
}
  