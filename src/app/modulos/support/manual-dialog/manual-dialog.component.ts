import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { TipoModulo } from 'src/app/features/log/domain/TipoModulo';
import { FirestoreLogRepositoryService } from 'src/app/features/log/infrastructure/firestore-log-repository.service';
import { Manual } from 'src/app/features/soporte/domain/Manual';
import { FirebaseManualRepositoryService } from 'src/app/features/soporte/infrastructure/firebase-manual-repository.service';

@Component({
  selector: 'app-manual-dialog',
  templateUrl: './manual-dialog.component.html',
  styleUrls: ['./manual-dialog.component.css']
})
export class ManualDialogComponent implements OnInit {
  manualForm: FormGroup;
  selectedFile!: File;
  isEdit: boolean = false;
  fileError: string = '';
  isSaving: boolean = false;  // Nueva propiedad para gestionar el estado de guardado

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ManualDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { manual: Manual },
    private manualRepository: FirebaseManualRepositoryService,
    private logRepository: FirestoreLogRepositoryService,
    private toastr: ToastrService,
  ) {
    // Initialize the form group
    this.manualForm = this.fb.group({
      titulo: ['', Validators.required],
      fechaRegistro: [this.formatDate(new Date()), Validators.required]
    });

    if (data && data.manual) {
      this.isEdit = true;
      this.manualForm.patchValue({
        titulo: data.manual.titulo,
        fechaRegistro: this.formatDate(new Date(data.manual.fechaRegistro))
      });
    }
  }

  ngOnInit(): void {}

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      if (file.type === 'application/pdf') {
        this.selectedFile = file;
        this.fileError = '';
      } else {
        this.fileError = 'Solo se permiten archivos PDF';
      }
    }
  }

  saveManual(): void {
    this.isSaving = true;  // Deshabilitar el botón de guardar

    if (this.manualForm.valid && this.selectedFile && this.selectedFile.type === 'application/pdf') {
      const { titulo, fechaRegistro } = this.manualForm.value;
      let manual = new Manual('', titulo, new Date(fechaRegistro), '');

      if (this.isEdit && this.data.manual) {
        manual = this.data.manual;
        manual.titulo = titulo;
        manual.fechaRegistro = new Date(fechaRegistro);
        // Update manual in Firestore
        this.manualRepository.actualizarManual(manual).then(() => {
          console.log('Manual actualizado con éxito');
          this.dialogRef.close('success');
        }).catch(error => {
          console.error('Error al actualizar el manual:', error);
          this.isSaving = false;  // Rehabilitar el botón en caso de error
        });
      } else {
        // Create new manual
        this.manualRepository.crearManual(manual, this.selectedFile).then(id => {
          console.log('Manual creado con ID:', id);
          this.dialogRef.close('success');
          this.toastr.success('Manual creado con éxito');
          this.logRepository.registrarAccion(
            TipoModulo.MODULO_SOPORTE,
            "Crear manual", 
            `Manual creado con ID: ${manual.id}`
          )
        }).catch(error => {
          console.error('Error al crear el manual:', error);
          this.isSaving = false;  // Rehabilitar el botón en caso de error
        });
      }
    } else {
      this.isSaving = false;  // Rehabilitar el botón si el formulario no es válido
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
