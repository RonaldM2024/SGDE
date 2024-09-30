import { TipoContrato } from "./ValueObject/TipoContrato";

// Clase Contrato que representa un contrato legal en el sistema.
export class Contrato {
    // Atributos de la clase Contrato.
    public id: string; // Identificador único del contrato.
    public titulo: string; // Título o nombre del contrato.
    public fechaInicio: Date; // Fecha de inicio del contrato.
    public fechaFin: Date; // Fecha de finalización del contrato.
    public partesInvolucradas: string[]; // Lista de partes involucradas en el contrato.
    public tipoContrato: TipoContrato; // Tipo de contrato, usando la clase TipoContrato.
    public contenido: string; // Contenido o texto del contrato.
  
    // Constructor de la clase Contrato.
    constructor(
      id: string,
      titulo: string,
      fechaInicio: Date,
      fechaFin: Date,
      partesInvolucradas: string[],
      tipoContrato: TipoContrato,
      contenido: string
    ) {
      this.id = id;
      this.titulo = titulo;
      this.fechaInicio = fechaInicio;
      this.fechaFin = fechaFin;
      this.partesInvolucradas = partesInvolucradas;
      this.tipoContrato = tipoContrato;
      this.contenido = contenido;
    }
  }
  