import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DocumentoDialogComponent } from './documento-dialog.component';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Importa BrowserAnimationsModule si usas Angular Material

describe('DocumentoDialogComponent', () => {
  let component: DocumentoDialogComponent;
  let fixture: ComponentFixture<DocumentoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentoDialogComponent],
      imports: [
        MatDialogModule,
        ReactiveFormsModule,
        BrowserAnimationsModule // Asegúrate de importar esto si usas Angular Material
      ],
      providers: [
        { provide: MatDialogRef, useValue: {} }, // Proveedor para MatDialogRef
        { provide: MAT_DIALOG_DATA, useValue: {} } // Proveedor para MAT_DIALOG_DATA
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
