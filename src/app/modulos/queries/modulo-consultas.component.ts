import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Documento } from 'src/app/features/documentos/domain/Documento';
import { FirestoreDocumentoRepositoryService } from 'src/app/features/documentos/infrastructure/servicios/Firebase/firestore-documento-repository.service';
import { Egresado } from 'src/app/features/egresado/domain/Egresado';
import { Cedula } from 'src/app/features/egresado/domain/ValueObject/Cedula';
import { FirestoreEgresadoRepository } from 'src/app/features/egresado/infrastructure/FirestoreEgresadoRepository';
import { DocumentoDialogComponent } from './documento-dialog/documento-dialog.component';
import { ExportarModalComponent } from './exportar-modal/exportar-modal.component';
import { FirestoreLogRepositoryService } from 'src/app/features/log/infrastructure/firestore-log-repository.service';
import { TipoModulo } from 'src/app/features/log/domain/TipoModulo';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modulo-consultas',
  templateUrl: './modulo-consultas.component.html',
  styleUrls: ['./modulo-consultas.component.css']
})
export class ModuloConsultasComponent {
  displayedColumns: string[] = ['Tipo de documento', 'acciones'];
  dataSource = [
    { documento: 'Certificado de grado', fechaRegistro: '01/01/2023' },
    { documento: 'Certificado de grado', fechaRegistro: '01/02/2023' },
    { documento: 'Certificado de grado', fechaRegistro: '01/03/2023' }
  ];

  cedula: string = '';
  nombre: string = '';
  apellido: string = '';
  egresados: Egresado[] = [];
  documentos: Documento[] = [];
  egresadoSeleccionado: Egresado | null = null;

  constructor(
    private egresadoRepository: FirestoreEgresadoRepository,
    private documentoRepository: FirestoreDocumentoRepositoryService,
    public dialog: MatDialog,
    public _toastr: ToastrService,
    private logRepository: FirestoreLogRepositoryService,
  ) {}

  buscarEgresadoPorCedula(): void {
    const cedula = new Cedula(this.cedula);
    this.egresadoRepository.consultarEgresadoPorCedula(cedula).subscribe(egresado => {
      if (egresado) {
        this.egresadoSeleccionado = egresado;
        this._toastr.success('Egresado encontrado')
        this.obtenerDocumentos(egresado.id!);
        this.logRepository.registrarAccion(
          TipoModulo.MODULO_CONSULTAS,
          "Consulta de egresado por cédula", 
          `Consulta de egresado con ID: ${egresado.id}`
        )
      } else {
        this._toastr.error('No se encontró ningún egresado con esta cédula', 'Error', {
          timeOut: 5000,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right'
        });
      }
    });
  }

  buscarEgresadosPorNombre(): void {
    this.egresadoRepository.buscarEgresadosPorNombre(this.nombre).subscribe(egresados => {
      if (egresados.length > 0) {
        this.egresados = egresados;
        this._toastr.success('Egresados encontrados')
        this.logRepository.registrarAccion(
          TipoModulo.MODULO_CONSULTAS,
          "Consulta de egresado por nombre", 
          `Nombre buscado ${this.nombre}`
        )
      } else {
        this._toastr.error('No se encontró ningún egresado con ese nombre', 'Error', {
          timeOut: 5000,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right'
        });
      }
    });
  }

  buscarEgresadosPorApellido(): void {
    this.egresadoRepository.buscarEgresadosPorApellido(this.apellido).subscribe(egresados => {
      if (egresados.length > 0) {
        this.egresados = egresados;
        this._toastr.success('Egresados encontrados')
        this.logRepository.registrarAccion(
          TipoModulo.MODULO_CONSULTAS,
          "Consulta de egresado por apellido", 
          `Apellido buscado ${this.apellido}`
        )
      } else {
        this._toastr.error('No se encontró ningún egresado con ese apellido', 'Error', {
          timeOut: 5000,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right'
        });
      }
    });
  }

  seleccionarEgresado(egresado: Egresado): void {
    this.egresadoSeleccionado = egresado;
    this.obtenerDocumentos(egresado.id!);
    this.logRepository.registrarAccion(
      TipoModulo.MODULO_CONSULTAS,
      "Selección de egresado", 
      `Egresado seleccionado con ID: ${egresado.id}`
    )
  }

  obtenerDocumentos(egresadoId: string): void {
    this.documentoRepository.getDocumentosByEgresadoId(egresadoId).subscribe(documentos => {
      this.documentos = documentos;
    });
  }

  verDocumento(documento: Documento): void {
    this.dialog.open(DocumentoDialogComponent, {
      disableClose: true,
      hasBackdrop: true,
      autoFocus: false,
      width: "750px",
      height: "auto",

      data: { imageUrl: documento.consultarImagenUrl() }
    });
    this.logRepository.registrarAccion(
      TipoModulo.MODULO_CONSULTAS,
      "Ver documento", 
      `ID del documento visto: ${documento.id}`
    )
  }

  abrirExportarModal(documento: Documento): void {
    this.dialog.open(ExportarModalComponent, {
      width: '90vw', // Ajusta el ancho del modal
      height: 'auto', // Ajusta la altura del modal
      maxWidth: '100vw', // Ajusta el ancho máximo del modal
      maxHeight: '100vh', // Ajusta la altura máxima del modal
      data: { egresado: this.egresadoSeleccionado, documento }
    });
  }

  limpiarDatos(){
    this.cedula = ''
    this.nombre = ''
    this.apellido = ''
    this.egresados = []
    this.documentos = []
    this.egresadoSeleccionado = null
  }

  convertirAMayusculas(event: any, campo: string) {
    const valor = event.target.value.toUpperCase();
    switch (campo) {
      case 'cedula':
        this.cedula = valor;
        break;
      case 'nombre':
        this.nombre = valor;
        break;
      case 'apellido':
        this.apellido = valor;
        break;
    }
  }
}
