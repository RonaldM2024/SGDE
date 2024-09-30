import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isDesktop!: boolean;
  headerText: string = 'SISTEMA DE GESTIÓN DOCUMENTAL DE EGRESADOS';
  mobileMaxWidth = 576; // Ancho máximo para considerar un dispositivo móvil

  ngOnInit(): void {
    this.checkDeviceType();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkDeviceType();
  }

  private checkDeviceType(): void {
    this.isDesktop = window.innerWidth > this.mobileMaxWidth;
    this.headerText = this.isDesktop ? 'SISTEMA DE GESTIÓN DOCUMENTAL DE EGRESADOS' : 'SISTEMA DE GESTION DOCUMENTAL DE EGRESADOS';
    console.log('Updated device type:', this.isDesktop ? 'desktop' : 'mobile');
  }
}
