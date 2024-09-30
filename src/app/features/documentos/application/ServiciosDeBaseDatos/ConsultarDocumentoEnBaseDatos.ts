import { Cedula } from "../../../egresado/domain/ValueObject/Cedula";
import { DocumentoRepository } from "../../domain/Repository/DocumentoRepository";

export class ConsultarDocumentoEnBaseDatos{
    private repository : DocumentoRepository;
    private cedulaEgresado: Cedula;

    constructor(repository: DocumentoRepository, cedula: Cedula) {
        this.repository = repository;
        this.cedulaEgresado = cedula;
    }

    public async ejecutar(){
        return this.repository.consultarDocumento(this.cedulaEgresado);
    }
}