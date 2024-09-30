import { Documento } from "../../domain/Documento";
import { DocumentoRepository } from "../../domain/Repository/DocumentoRepository";

export class GuardarDocumentoEnBaseDatos{
    private repository : DocumentoRepository;
    private documento : Documento;

    constructor(repository: DocumentoRepository, documento: Documento) {
        this.repository = repository;
        this.documento = documento;
    }

    public async ejecutar(){
        await this.repository.crearDocumento(this.documento);
    }
}