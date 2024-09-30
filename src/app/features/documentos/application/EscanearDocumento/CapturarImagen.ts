import { ModelCamara } from "../../domain/Models/ModelCamara"; // Importa la interfaz ModelCamara

// Define la clase CapturarImagen
export class CapturarImagen {
  private modelCamara: ModelCamara; // Instancia de ModelCamara
  private imagenPath = ""; // Ruta de la imagen capturada

  // Constructor que inicializa modelCamara
  constructor(modelCamara: ModelCamara) {
    this.modelCamara = modelCamara;
  }

  // Método para activar la cámara
  public activarCamara(): void {
    this.modelCamara.iniciar();
  }

  // Método asíncrono para ejecutar la captura de imagen
  public async ejecutar(): Promise<string> {
    this.imagenPath = await this.modelCamara.tomarFoto(); // Toma la foto y almacena la ruta de la imagen
    return this.imagenPath;
  }

  // Método para detener la cámara
  public detener(): void {
    this.modelCamara.detener();
  }

  // Método para cambiar la cámara (frontal/trasera)
  public cambiarCamara(): void {
    this.modelCamara.cambiarCamara();
  }
}
