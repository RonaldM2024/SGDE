import { TipoDocumento } from './ValueObject/TipoDocumento';

// Documento.ts
export class Documento {
  // Propiedades públicas constantes
  public id: string;
  public readonly egresadoId: string; // Cambiado de egresadoCedula a egresadoId
  public readonly tipoDocumento: TipoDocumento;

  // Propiedades privadas
  private contenido: string;
  public imagenUrl: string;

  // Constructor
  constructor(id: string, egresadoId: string, tipoDocumentoId: TipoDocumento, contenido: string, imagenUrl: string) {
    this.id = id;
    this.egresadoId = egresadoId; // Cambiado de egresadoCedula a egresadoId
    this.tipoDocumento = tipoDocumentoId;
    this.contenido = contenido;
    this.imagenUrl = imagenUrl;
  }

  // Método público para consultar el contenido
  public consultarContenido(): string {
    return this.contenido;
  }

  // Método público para actualizar el contenido
  public actualizarContenido(nuevoContenido: string): void {
    this.contenido = nuevoContenido;
  }

  // Método público para consultar la URL de la imagen
  public consultarImagenUrl(): string {
    return this.imagenUrl;
  }

  // Método público para actualizar el URL de la imagen
  public actualizarURL(url: string): void{
    this.imagenUrl = url
  }
}
