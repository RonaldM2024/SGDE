import { ModelOCR } from "../../domain/Models/ModelORC";

export class ExtraerTextoDeImagen{
    private modelOCR: ModelOCR;
    private contenido = "";

    constructor(modelOCR: ModelOCR){
        this.modelOCR = modelOCR;
    }

    public async ejecutar(imagenPath: string){
        this.contenido = await this.modelOCR.extraerTextoDeImagen(imagenPath);
        return this.contenido;
    }
}