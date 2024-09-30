import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Contrato } from 'src/app/features/legal/domain/Contrato';
import { TipoContrato } from 'src/app/features/legal/domain/ValueObject/TipoContrato';
import { FirestoreContratoRepositoryService } from 'src/app/features/legal/infrastructure/firestore-contrato-repository.service';
import { TipoModulo } from 'src/app/features/log/domain/TipoModulo';
import { FirestoreLogRepositoryService } from 'src/app/features/log/infrastructure/firestore-log-repository.service';

@Component({
  selector: 'app-contrato-dialog',
  templateUrl: './contrato-dialog.component.html',
  styleUrls: ['./contrato-dialog.component.css']
})
export class ContratoDialogComponent {
  contratoForm: FormGroup;
  tiposContratos = TipoContrato.getTiposValidos();

  constructor(
    public dialogRef: MatDialogRef<ContratoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { contrato: Contrato },
    private fb: FormBuilder,
    private contratoRepository: FirestoreContratoRepositoryService,
    private logRepository: FirestoreLogRepositoryService,
    private toastr: ToastrService,
  ) {
    this.contratoForm = this.fb.group({
      titulo: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
      partesInvolucradas: ['', Validators.required],
      tipoContrato: ['', Validators.required],
      contenido: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.data.contrato) {
      this.contratoForm.patchValue({
        titulo: this.data.contrato.titulo,
        fechaInicio: this.formatDate(this.data.contrato.fechaInicio),
        fechaFin: this.formatDate(this.data.contrato.fechaFin),
        partesInvolucradas: this.data.contrato.partesInvolucradas.join(', '),
        tipoContrato: this.data.contrato.tipoContrato.getValue(),
        contenido: this.data.contrato.contenido
      });
    }
  }

  formatDate(date: any): string {
    if (date instanceof Date) {
      return date.toISOString().split('T')[0];
    } else if (date && date.toDate) {
      return date.toDate().toISOString().split('T')[0];
    }
    return date;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveContrato(): void {
    const formValue = this.contratoForm.value;
    const partesInvolucradas = formValue.partesInvolucradas.split(',').map((parte: string) => parte.trim());
    const nuevoContrato = new Contrato(
      this.data.contrato ? this.data.contrato.id : '',
      formValue.titulo,
      new Date(formValue.fechaInicio),
      new Date(formValue.fechaFin),
      partesInvolucradas,
      new TipoContrato(formValue.tipoContrato),
      formValue.contenido
    );

    if (this.data.contrato) {
      this.contratoRepository.actualizarContrato(this.data.contrato.id, nuevoContrato).then(() => {
        this.toastr.success('Se actualizo el manual con exito')
        this.logRepository.registrarAccion(
          TipoModulo.MODULO_LEGAL,
          "Actualizar Contrato", 
          `Contrato actualizado con ID: ${this.data.contrato.id}`
        )
        this.dialogRef.close(nuevoContrato);
      });
    } else {
      this.contratoRepository.registrarContrato(nuevoContrato).then(() => {
        this.toastr.success('Se creo el manual con exito')
        this.logRepository.registrarAccion(
          TipoModulo.MODULO_LEGAL,
          "Registrar Contrato", 
          `Contrato creado con ID: ${nuevoContrato.id}`
        )
        this.dialogRef.close(nuevoContrato);
      });
    }
  }
}
