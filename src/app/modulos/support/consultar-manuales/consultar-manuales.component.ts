import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Manual } from 'src/app/features/soporte/domain/Manual';
import { FirebaseManualRepositoryService } from 'src/app/features/soporte/infrastructure/firebase-manual-repository.service';

@Component({
  selector: 'app-consultar-manuales',
  templateUrl: './consultar-manuales.component.html',
  styleUrls: ['./consultar-manuales.component.css']
})
export class ConsultarManualesComponent {
  manuales: Manual[] = [];
  selectedManual: Manual | null = null; // Variable para almacenar el manual seleccionado
  safeUrl: SafeResourceUrl | null = null; // Variable para almacenar la URL segura

  constructor(
    private manualRepository: FirebaseManualRepositoryService,
    private sanitizer: DomSanitizer // Inyecta el servicio DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadManuales();
  }

  loadManuales(): void {
    this.manualRepository.listarManuales().subscribe(manuales => {
      this.manuales = manuales;
    });
  }

  selectManual(manual: Manual): void {
    this.selectedManual = manual; // Asigna el manual seleccionado
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(manual.url); // Sanitiza la URL del manual
  }

  clearSelectedManual(): void {
    this.selectedManual = null; // Limpia el manual seleccionado
    this.safeUrl = null; // Limpia la URL segura
  }
}
