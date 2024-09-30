import { ModelCamara } from '../../domain/Models/ModelCamara'; // Importa la interfaz ModelCamara
import Webcam from 'webcam-easy'; // Importa la biblioteca webcam-easy para manejar la cámara web

// Define la clase WebcamModel que implementa la interfaz ModelCamara
export class WebcamModel implements ModelCamara {
  private webcam!: Webcam; // Instancia de la cámara web
  private videoElement!: HTMLVideoElement; // Elemento de video del DOM
  private canvasElement!: HTMLCanvasElement; // Elemento de canvas del DOM
  private snapSoundElement!: HTMLAudioElement; // Elemento de audio del DOM

  // Constructor que inicializa los elementos de video, canvas y audio
  constructor(videoElement: HTMLVideoElement, canvasElement: HTMLCanvasElement, snapSoundElement: HTMLAudioElement) {
    if (typeof navigator !== 'undefined') {
      this.videoElement = videoElement;
      this.canvasElement = canvasElement;
      this.snapSoundElement = snapSoundElement;
      this.webcam = new Webcam(this.videoElement, 'user', this.canvasElement, this.snapSoundElement); // Inicializa la cámara web
    } else {
      console.error('El navegador no está definido. Asegúrese de que este código se ejecuta en un entorno de navegador.'); // Manejo de error si el navegador no está definido
    }
  }

  // Método para iniciar la cámara web
  iniciar(): void {
    if (this.webcam) {
      this.webcam.start()
        .then(result => {
          console.log("Webcam started"); // Mensaje de éxito al iniciar la cámara web
        })
        .catch(err => {
          console.error(err); // Manejo de error al iniciar la cámara web
        });
    }
  }

  // Método asíncrono para tomar una foto
  async tomarFoto(): Promise<string> {
    try {
      if (this.webcam) {
        const picture = this.webcam.snap(); // Captura la foto
        const image = new Image(); // Crea una nueva instancia de Image
        image.src = picture; // Asigna la foto capturada a la imagen

        return new Promise((resolve, reject) => {
          image.onload = () => {
            const context = this.canvasElement.getContext('2d'); // Obtiene el contexto del canvas
            if (context) {
              context.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height); // Limpia el canvas
              context.drawImage(image, 0, 0, this.canvasElement.width, this.canvasElement.height); // Dibuja la imagen en el canvas
              resolve(this.canvasElement.toDataURL('image/png')); // Devuelve la imagen como una URL de datos en formato PNG
            } else {
              reject('No se pudo obtener el contexto del canvas.'); // Manejo de error si no se puede obtener el contexto del canvas
            }
          };

          image.onerror = (error) => {
            reject(`Error al cargar la imagen: ${error}`); // Manejo de error al cargar la imagen
          };
        });
      } else {
        return '';
      }
    } catch (error) {
      console.error("Error taking photo: ", error); // Manejo de error al tomar la foto
      return '';
    }
  }

  // Método para detener la cámara web
  detener(): void {
    if (this.webcam) {
      this.webcam.stop(); // Detiene la cámara web
    }
  }

  // Método para cambiar la cámara (frontal/trasera)
  cambiarCamara(): void {
    if (this.webcam) {
      this.webcam.flip(); // Cambia la cámara
      this.webcam.start()
        .then(result => {
          console.log("Webcam flipped"); // Mensaje de éxito al cambiar la cámara
        })
        .catch(err => {
          console.error(err); // Manejo de error al cambiar la cámara
        });
    }
  }
}
