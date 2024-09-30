import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModuloAdmUsuariosComponent } from './admin/modulo-adm-usuarios.component';
import { ModuloAuditoriaComponent } from './audit/modulo-auditoria.component';
import { ModuloDigitalizadorComponent } from './digitizer/modulo-digitalizador.component';
import { ConsultarContratosComponent } from './legal/consultar-contratos/consultar-contratos.component';
import { ModuloLegalComponent } from './legal/modulo-legal.component';
import { ModuloConsultasComponent } from './queries/modulo-consultas.component';
import { ConsultarManualesComponent } from './support/consultar-manuales/consultar-manuales.component';
import { ModuloSoporteComponent } from './support/modulo-soporte.component';
import { roleGuard } from '../pages/guard/role.guard';
import { NotFoundComponent } from '../not-found/not-found.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {path: 'modulo-digitalizador', component: ModuloDigitalizadorComponent, canActivate: [roleGuard], data: {roles: ['DIGITALIZADOR'] } },
  {path: 'modulo-consultas', component: ModuloConsultasComponent, canActivate: [roleGuard], data: {roles: ['CONSULTOR']} },
  {path: 'modulo-adm-usuarios', component: ModuloAdmUsuariosComponent, canActivate: [roleGuard], data: {roles: ['ADMIN USERS']} },
  {path: 'modulo-auditoria', component: ModuloAuditoriaComponent, canActivate: [roleGuard], data: {roles: ['AUDITOR'] } },
  {path: 'modulo-soporte', component: ModuloSoporteComponent, canActivate: [roleGuard], data: {roles: ['SOPORTE']} },
  {path: 'modulo-legal', component: ModuloLegalComponent, canActivate: [roleGuard], data: {roles: ['LEGAL']} },
  {path: 'consultar-contratos', component: ConsultarContratosComponent },
  {path: 'consultar-manuales', component: ConsultarManualesComponent },
  {path: '**', component: NotFoundComponent }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModuloRaizRoutingModule { }
