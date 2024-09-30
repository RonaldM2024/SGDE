import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Manual } from 'src/app/features/soporte/domain/Manual';
import { FirebaseManualRepositoryService } from 'src/app/features/soporte/infrastructure/firebase-manual-repository.service';
import { ManualDialogComponent } from './manual-dialog/manual-dialog.component';
import { FirestoreLogRepositoryService } from 'src/app/features/log/infrastructure/firestore-log-repository.service';
import { TipoModulo } from 'src/app/features/log/domain/TipoModulo';
import { ToastrService } from 'ngx-toastr';
import { DialogConfirmationComponent } from 'src/app/pages/shared/dialog-confirmation/dialog-confirmation.component';

@Component({
  selector: 'app-modulo-soporte',
  templateUrl: './modulo-soporte.component.html',
  styleUrls: ['./modulo-soporte.component.css']
})
export class ModuloSoporteComponent {
  displayedColumns: string[] = ['titulo', 'fechaRegistro', 'url', 'acciones'];
  dataSource: Manual[] = [];

  constructor(
    private manualRepository: FirebaseManualRepositoryService, 
    public dialog: MatDialog,
    private logRepository: FirestoreLogRepositoryService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.loadManuales();
  }

  loadManuales(): void {
    this.manualRepository.listarManuales().subscribe(manuales => {
      this.dataSource = manuales;
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ManualDialogComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  openConfirmationDialog(manual: Manual): void {
    const title = "Mensaje de confirmación";
    const description = "¿Está seguro de eliminar el manual?";
    const dialogRef = this.dialog.open(DialogConfirmationComponent, {
      width: '350px',
      data: {title, description}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.eliminarManual(manual);
      }
    });
  }


  eliminarManual(manual: Manual): void {
    const filePath = `manuales/${manual.id}_${manual.url.split('/').pop()}`;
    this.manualRepository.eliminarManual(manual.id, filePath).then(() => {
      console.log('Manual eliminado con éxito');
      this.toastr.success('Manual eliminado con éxito');
      this.loadManuales(); // Recarga los manuales después de eliminar uno
      this.logRepository.registrarAccion(
        TipoModulo.MODULO_SOPORTE,
        "Eliminar manual", 
        `Titulo del manual eliminado: ${manual.titulo}`
      )
    }).catch(error => {
      console.error('Error al eliminar el manual:', error);
      this.toastr.error('Error al eliminar el manual');
    });
  }
}
