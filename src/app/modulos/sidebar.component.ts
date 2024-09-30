import { Component, HostListener } from '@angular/core';
import { FirebaseUsuarioRepositoryService } from '../features/usuario/infrastructure/firebase-usuario-repository.service';
import { BehavierIdbRepository } from '../features/persistence/behavierIdb-repository.service';
import { Router } from '@angular/router';
import { FirestoreLogRepositoryService } from '../features/log/infrastructure/firestore-log-repository.service';
import { TipoModulo } from '../features/log/domain/TipoModulo';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @HostListener('window:resize', ['$event'])
  sidebarToggled: boolean = true;
  title: any;
  name!: string;
  lastName!: string;
  cargo!: string;
  roles!: string;
  isDigitalizador: boolean = false;
  isConsultor: boolean = false;
  isAdminUsers: boolean = false;
  isAuditor: boolean = false;
  isSoporte: boolean = false;
  isLegal: boolean = false;

  private mobileMaxWidth = 768;

  constructor(
    private _authService: FirebaseUsuarioRepositoryService,
    private _behavierIdbRepository: BehavierIdbRepository,
    private _router: Router,
    private logRepository: FirestoreLogRepositoryService
  ) { }

  isDesktop!: boolean;

  onResize(event: any) {
    this.checkScreenWidth();
    this.checkDeviceType();
  }

  async ngOnInit(): Promise<void> {
    this.checkScreenWidth();
    this.checkDeviceType();
    const userData = await this._behavierIdbRepository.getUser()?.then((user: any) => {
      return user[0];
    });

    //console.log('Usuario:', userData);
    this.name = userData.nombre;
    this.lastName = userData.apellido;
    this.cargo = userData.cargo;
    this.roles = userData.roles;
    //console.log('Usuario:', this.name + " - "+ this.lastName + "Cargo: "+ this.cargo);
    this.validateMenuOptions(this.roles);
  }

  toggleSidebar(): void {
    this.sidebarToggled = !this.sidebarToggled;
  }

  private checkDeviceType(): void {
    this.isDesktop = window.innerWidth > this.mobileMaxWidth;
    console.log('Updated device type:', this.isDesktop ? 'desktop' : 'mobile');
  }

  private checkScreenWidth(): void {
    if (window.innerWidth <= 768) { // Cambia 768 según tu necesidad de diseño
      this.sidebarToggled = false;
    }
  }
  closeToggleSidebar(): void{
    this.sidebarToggled = !this.sidebarToggled;
  }

  validateMenuOptions(roles: any){
    this.isDigitalizador = roles.includes('DIGITALIZADOR');
    this.isConsultor = roles.includes('CONSULTOR');
    this.isAdminUsers = roles.includes('ADMIN USERS');
    this.isAuditor = roles.includes('AUDITOR');
    this.isSoporte = roles.includes('SOPORTE');
    this.isLegal = roles.includes('LEGAL');
  }


  changeRoute(value: any){
    switch(value){
      case 'documenter':
        this.title = 'Escanear Documento';
        return this.title;
      case 'register': 
        this.title = 'Registros';
        return this.title;
    }
  }

  logout(){
    this._authService.logout();
    this._behavierIdbRepository.deleteUsers().then(() => {
      this._router.navigate(['/auth/login']);
      this.logRepository.registrarAccion(
        TipoModulo.MODULO_ADMINISTRACION_USUARIOS,
        "Cerrar sesión", 
        `El usuario con cargo ${this.cargo} a cerrado sesión`
      )
    });
  }
}
