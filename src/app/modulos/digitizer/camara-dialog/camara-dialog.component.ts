import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CapturarImagen } from 'src/app/features/documentos/application/EscanearDocumento/CapturarImagen';
import { WebcamModel } from 'src/app/features/documentos/infrastructure/EscanearDocumento/WebCamModelCamara.service';

@Component({
  selector: 'app-camara-dialog',
  templateUrl: './camara-dialog.component.html',
  styleUrls: ['./camara-dialog.component.css']
})
export class CamaraDialogComponent {
  @ViewChild('webcam', { static: true }) videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas', { static: true }) canvasElement!: ElementRef<HTMLCanvasElement>;
  @ViewChild('snapSound', { static: true }) snapSoundElement!: ElementRef<HTMLAudioElement>;

  imagenPath: string | null = null;
  CamaraIsActive = true;

  private capturarImagenUseCase!: CapturarImagen;

  constructor(private dialogRef: MatDialogRef<CamaraDialogComponent>) {}

  ngOnInit() {
    const modelCamara = new WebcamModel(
      this.videoElement.nativeElement,
      this.canvasElement.nativeElement,
      this.snapSoundElement.nativeElement
    );
    this.capturarImagenUseCase = new CapturarImagen(modelCamara);
    this.activarCamara();
  }

  activarCamara() {
    this.capturarImagenUseCase.activarCamara();
    this.CamaraIsActive = true;
  }

  async capturarImagen() {
    this.imagenPath = await this.capturarImagenUseCase.ejecutar();
  }

  detenerCamara() {
    this.capturarImagenUseCase.detener();
    this.CamaraIsActive = false;
  }

  cambiarCamara() {
    this.capturarImagenUseCase.cambiarCamara();
  }

  closeModal() {   
    this.dialogRef.close(this.imagenPath);
  }

  ngOnDestroy() {
    this.detenerCamara();
  }
}
