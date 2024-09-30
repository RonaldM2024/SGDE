import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Documento } from 'src/app/features/documentos/domain/Documento';
import { PdfGeneratorService } from 'src/app/features/documentos/infrastructure/servicios/Exportacion/pdf-generator.service';
import { Egresado } from 'src/app/features/egresado/domain/Egresado';
import { TipoModulo } from 'src/app/features/log/domain/TipoModulo';
import { FirestoreLogRepositoryService } from 'src/app/features/log/infrastructure/firestore-log-repository.service';

@Component({
  selector: 'app-exportar-modal',
  templateUrl: './exportar-modal.component.html',
  styleUrls: ['./exportar-modal.component.css']
})
export class ExportarModalComponent {
  egresado: Egresado;
  documento: Documento;
  verMetaData: Boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ExportarModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { egresado: Egresado, documento: Documento },
    private pdfGeneratorService: PdfGeneratorService,
    private logRepository: FirestoreLogRepositoryService
  ) {
    this.egresado = data.egresado;
    this.documento = data.documento;
    this.logRepository.registrarAccion(
      TipoModulo.MODULO_CONSULTAS,
      "Abrir ventana de exportar", 
      `Egresado: ${data.egresado.id}, Documento: ${data.documento.id}`
    )
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  exportToPdf(): void {
    if (this.documento && this.documento.consultarImagenUrl()) {
      this.pdfGeneratorService.generatePdfWithImage(this.documento.consultarImagenUrl(), 'document');
      this.logRepository.registrarAccion(
        TipoModulo.MODULO_CONSULTAS,
        "Exportar documento", 
        `Documento: ${this.documento.id}`
      )
    }
  }

  verVistaMetadata(): void {
    this.verMetaData = !this.verMetaData;
  }
}
