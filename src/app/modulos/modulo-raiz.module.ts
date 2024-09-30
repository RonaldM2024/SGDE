import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar.component';

import { ModuloRaizRoutingModule } from './modulo-raiz-routing.module';
import { SharedModule } from '../pages/shared/shared.module';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { ModuloAdmUsuariosComponent } from './admin/modulo-adm-usuarios.component';
import { ModuloAuditoriaComponent } from './audit/modulo-auditoria.component';
import { CamaraDialogComponent } from './digitizer/camara-dialog/camara-dialog.component';
import { EditImgDialogComponent } from './digitizer/edit-img-dialog/edit-img-dialog.component';
import { ModuloDigitalizadorComponent } from './digitizer/modulo-digitalizador.component';
import { ConsultarContratosComponent } from './legal/consultar-contratos/consultar-contratos.component';
import { ContratoDialogComponent } from './legal/contrato-dialog/contrato-dialog.component';
import { ModuloLegalComponent } from './legal/modulo-legal.component';
import { DocumentoDialogComponent } from './queries/documento-dialog/documento-dialog.component';
import { ExportarModalComponent } from './queries/exportar-modal/exportar-modal.component';
import { ModuloConsultasComponent } from './queries/modulo-consultas.component';
import { ConsultarManualesComponent } from './support/consultar-manuales/consultar-manuales.component';
import { ManualDialogComponent } from './support/manual-dialog/manual-dialog.component';
import { ModuloSoporteComponent } from './support/modulo-soporte.component';
import { MatDialogModule } from '@angular/material/dialog';
import { HomeComponent } from './home/home.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { DialogConfirmationComponent } from '../pages/shared/dialog-confirmation/dialog-confirmation.component';


@NgModule({
  declarations: [
    SidebarComponent,
    ModuloDigitalizadorComponent,
    ModuloConsultasComponent,
    ModuloAdmUsuariosComponent,
    ModuloAuditoriaComponent,
    ModuloSoporteComponent,
    ModuloLegalComponent,
    EditImgDialogComponent,
    CamaraDialogComponent,
    ExportarModalComponent,
    DocumentoDialogComponent,
    ContratoDialogComponent,
    ManualDialogComponent,
    ConsultarContratosComponent,
    ConsultarManualesComponent,
    HomeComponent,
    DialogConfirmationComponent,
  ],
  imports: [
    CommonModule,
    ModuloRaizRoutingModule,
    SharedModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    MatDialogModule,
    MatPaginatorModule,
  ]
})
export class ModuloRaizModule { }
