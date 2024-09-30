import { DocumentoRepository } from "../../domain/Repository/DocumentoRepository";

export class ConsultarTodosLosDocumentosDeBaseDatos{
    private repository : DocumentoRepository;

    constructor(repository: DocumentoRepository) {
        this.repository = repository;
    }

    public async ejecutar(){
        return this.repository.consultarDocumentos();
    }
}