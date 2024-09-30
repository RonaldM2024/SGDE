import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import Cropper from 'cropperjs'; // Importa la biblioteca Cropper.js para la edición de imágenes


@Component({
  selector: 'app-edit-img-dialog',
  templateUrl: './edit-img-dialog.component.html',
  styleUrls: ['./edit-img-dialog.component.css']
})
export class EditImgDialogComponent {
  @ViewChild('image', { static: false }) imageElement!: ElementRef; // Obtiene una referencia al elemento de la imagen en el DOM
  cropper!: Cropper; // Instancia de Cropper.js
  imageUrl!: string | ArrayBuffer; // URL de la imagen cargada
  scaleX: number = 1; // Factor de escala en el eje X
  scaleY: number = 1; // Factor de escala en el eje Y

  constructor(private dialogRef: MatDialogRef<EditImgDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.imageUrl = data.imageUrl; // Obtiene la URL de la imagen cargada
  }

  ngAfterViewInit() {
    this.initializeCropperWithRetry(0);
  }

  initializeCropperWithRetry(retryCount: number) {
    if (this.imageElement && this.imageElement.nativeElement) {
      // Inicializa Cropper.js con el elemento de la imagen
      this.cropper = new Cropper(this.imageElement.nativeElement, {
        aspectRatio: NaN,
        viewMode: 1,
        autoCropArea: 0.5,
        movable: true,
        rotatable: true,
        scalable: true,
        zoomable: true
      });
    } else if (retryCount < 5) { // Intenta hasta 5 veces
      setTimeout(() => this.initializeCropperWithRetry(retryCount + 1), 100); // Espera 100 ms antes de reintentar
    } else {
      console.error('No se pudo inicializar Cropper.js: elemento de imagen no disponible.');
    }
  }
 
  // Metodo para cerrar el Modal y enviar la foto
  closeModal(){   
    this.dialogRef.close(this.imageUrl);
  }
  // Método para rotar la imagen a la izquierda
  rotateLeft(): void {
    if (this.cropper) {
      this.cropper.rotate(-45); // Rota la imagen -45 grados
    }
  }

  // Método para rotar la imagen a la derecha
  rotateRight(): void {
    if (this.cropper) {
      this.cropper.rotate(45); // Rota la imagen 45 grados
    }
  }

  // Método para voltear la imagen en el eje X
  flipX(): void {
    if (this.cropper) {
      this.scaleX = -this.scaleX; // Invierte el factor de escala en el eje X
      this.cropper.scaleX(this.scaleX); // Aplica la escala en el eje X
    }
  }

  // Método para voltear la imagen en el eje Y
  flipY(): void {
    if (this.cropper) {
      this.scaleY = -this.scaleY; // Invierte el factor de escala en el eje Y
      this.cropper.scaleY(this.scaleY); // Aplica la escala en el eje Y
    }
  }

  // Método para enviar la imagen recortada al componente scanner
  sendCroppedImage(): void {
    if (this.cropper) {
      const croppedCanvas = this.cropper.getCroppedCanvas(); // Obtiene el canvas recortado
      const croppedImage = croppedCanvas.toDataURL('image/png'); // Convierte el canvas a una URL de datos PNG
      this.dialogRef.close(croppedImage); // Cierra el diálogo y envía la imagen recortada
    }
  }

  // Método para descargar
  downloadCroppedImage(): void {
    if (this.cropper) {
      const croppedCanvas = this.cropper.getCroppedCanvas(); // Obtiene el canvas recortado
      const croppedImage = croppedCanvas.toDataURL('image/png'); // Convierte el canvas a una URL de datos PNG
      const link = document.createElement('a'); // Crea un enlace
      link.href = croppedImage; // Asigna la URL de datos al enlace
      link.download = 'cropped-image.png'; // Establece el nombre del archivo descargado
      link.click(); // Simula un clic en el enlace para iniciar la descarga
    }
  }

  // Método que se ejecuta al destruir el componente
  ngOnDestroy(): void {
    if (this.cropper) {
      this.cropper.destroy(); // Destruye la instancia de Cropper.js para liberar recursos
      this.imageUrl = '';
    }
  }
}
