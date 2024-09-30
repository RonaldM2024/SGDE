import { Component } from '@angular/core';
import { Contrato } from 'src/app/features/legal/domain/Contrato';
import { FirestoreContratoRepositoryService } from 'src/app/features/legal/infrastructure/firestore-contrato-repository.service';

@Component({
  selector: 'app-consultar-contratos',
  templateUrl: './consultar-contratos.component.html',
  styleUrls: ['./consultar-contratos.component.css']
})
export class ConsultarContratosComponent {
  contratos: Contrato[] = []; // Almacena la lista de contratos
  selectedContrato: Contrato | null = null; // Almacena el contrato seleccionado

  constructor(private contratoRepository: FirestoreContratoRepositoryService) { }

  ngOnInit(): void {
    this.loadContratos(); // Carga los contratos al inicializar el componente
  }

  // Método para cargar todos los contratos desde Firestore
  loadContratos(): void {
    this.contratoRepository.consultarContratos().subscribe((contratos: Contrato[]) => {
      this.contratos = contratos; // Almacena los contratos en el array
    });
  }

  // Método para seleccionar un contrato y mostrar sus detalles
  selectContrato(contrato: Contrato): void {
    this.selectedContrato = contrato;
  }

  formatContent(content: string): string {
    // Reemplaza los saltos de línea con <br> y los espacios múltiples con &nbsp;
    return content.replace(/\n/g, '<br>').replace(/ /g, '&nbsp;');
  }

  clearSelectedContrato(): void {
    this.selectedContrato = null; // Limpia el contrato seleccionado
  }
}
