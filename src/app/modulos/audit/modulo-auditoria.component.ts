import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Log } from 'src/app/features/log/domain/Log';
import { TipoModulo } from 'src/app/features/log/domain/TipoModulo';
import { FirestoreLogRepositoryService } from 'src/app/features/log/infrastructure/firestore-log-repository.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-modulo-auditoria',
  templateUrl: './modulo-auditoria.component.html',
  styleUrls: ['./modulo-auditoria.component.css']
})
export class ModuloAuditoriaComponent implements OnInit {
  logForm: FormGroup;
  tiposModulos = [
    new TipoModulo(TipoModulo.MODULO_DIGITALIZADOR),
    new TipoModulo(TipoModulo.MODULO_CONSULTAS),
    new TipoModulo(TipoModulo.MODULO_ADMINISTRACION_USUARIOS),
    new TipoModulo(TipoModulo.MODULO_LEGAL),
    new TipoModulo(TipoModulo.MODULO_SOPORTE)
  ];
  logs: { [key: string]: Log[] } = {};
  currentDateTime: string;
  displayedColumns: string[] = ['accion', 'fecha', 'userId', 'ip', 'detalle'];
  dataSource = new MatTableDataSource<Log>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  selectedModulo: string = TipoModulo.MODULO_DIGITALIZADOR;

  constructor(
    private fb: FormBuilder,
    private logService: FirestoreLogRepositoryService,
  ) {
    this.currentDateTime = new Date().toLocaleString();
    this.logForm = this.fb.group({
      accion: ['', Validators.required],
      userId: ['', Validators.required],
      ip: ['', Validators.required],
      detalle: ['', Validators.required],
      tipoModulo: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.tiposModulos.forEach(modulo => {
      this.logService.consultarLogs(modulo).subscribe(logs => {
        this.logs[modulo.getValue()] = logs;
        if (modulo.getValue() === this.selectedModulo) {
          this.dataSource.data = logs;
          this.dataSource.paginator = this.paginator;
        }
      });
    });
  }

  setSelectedModulo(modulo: string): void {
    this.selectedModulo = modulo;
    this.dataSource.data = this.logs[modulo] || [];
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  registrarLog(): void {
    if (this.logForm.valid) {
      const { accion, userId, ip, detalle, tipoModulo } = this.logForm.value;
      const log = new Log('', accion, new Date(), userId, ip, detalle);
      const modulo = new TipoModulo(tipoModulo);

      this.logService.registrarLog(modulo, log).then(() => {
        console.log('Log registrado con éxito');
      }).catch(error => {
        console.error('Error al registrar el log:', error);
      });
    }
  }

  formatDate(timestamp: any): string {
    const date = timestamp.toDate();
    return date.toLocaleString();
  }
}
