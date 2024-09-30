import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Contrato } from 'src/app/features/legal/domain/Contrato';
import { FirestoreContratoRepositoryService } from 'src/app/features/legal/infrastructure/firestore-contrato-repository.service';
import { ContratoDialogComponent } from './contrato-dialog/contrato-dialog.component';
import { FirestoreLogRepositoryService } from 'src/app/features/log/infrastructure/firestore-log-repository.service';
import { TipoModulo } from 'src/app/features/log/domain/TipoModulo';
import { ToastrService } from 'ngx-toastr';
import { DialogConfirmationComponent } from 'src/app/pages/shared/dialog-confirmation/dialog-confirmation.component';

@Component({
  selector: 'app-modulo-legal',
  templateUrl: './modulo-legal.component.html',
  styleUrls: ['./modulo-legal.component.css']
})
export class ModuloLegalComponent implements OnInit {
  contratos: Contrato[] = [];
  displayedColumns: string[] = ['titulo', 'fechaInicio', 'fechaFin', 'acciones'];
  dataSource: Contrato[] = [];

  constructor(
    private contratoRepository: FirestoreContratoRepositoryService,
    public dialog: MatDialog,
    private logRepository: FirestoreLogRepositoryService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.loadContratos();
  }

  loadContratos(): void {
    this.contratoRepository.consultarContratos().subscribe((contratos) => {
      this.contratos = contratos;
      this.dataSource = contratos;
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ContratoDialogComponent, {
      width: '600px',
      data: { contrato: null }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadContratos();
      }
    });
  }

  openConfirmationDialog(contrato: Contrato): void {
    const title = "Mensaje de confirmación";
    const description = "¿Está seguro de eliminar el contrato?";
    const dialogRef = this.dialog.open(DialogConfirmationComponent, {
      width: '350px',
      data: {title, description}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.eliminarContrato(contrato);
      }
    });
  }

  editContrato(contrato: Contrato): void {
    const dialogRef = this.dialog.open(ContratoDialogComponent, {
      width: '600px',
      data: { contrato }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadContratos();
      }
    });
  }

  eliminarContrato(contrato: Contrato): void {
    this.contratoRepository.eliminarContrato(contrato.id).then(() => {
      this.loadContratos();
      this.toastr.success('Contrato eliminado con exito')
      this.logRepository.registrarAccion(
        TipoModulo.MODULO_LEGAL,
        "Eliminar Contrato", 
        `Titulo de Contrato eliminado: ${contrato.titulo}`
      )
    }).catch(error => {
      this.toastr.error('Error al eliminar el contrato')
      console.error('Error al eliminar el contrato:', error);
    });
  }
}
