// ModelPDF.ts
export interface ModelPDF {
    crearPDF(contenido: string, opciones?: any): Promise<string>; // Devuelve la URL o el path del PDF creado
}
  