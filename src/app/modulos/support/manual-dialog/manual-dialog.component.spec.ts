import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManualDialogComponent } from './manual-dialog.component';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms'; // Importar ReactiveFormsModule
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from 'src/environments/environment';
import { FirestoreLogRepositoryService } from 'src/app/features/log/infrastructure/firestore-log-repository.service';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { ToastrModule, ToastrService } from 'ngx-toastr';

describe('ManualDialogComponent', () => {
  let component: ManualDialogComponent;
  let fixture: ComponentFixture<ManualDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManualDialogComponent],
      imports: [
        MatDialogModule,
        ReactiveFormsModule, // Agregar ReactiveFormsModule aquí
        BrowserAnimationsModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        ToastrModule.forRoot() // Importa el módulo Toastr
      ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: FirestoreLogRepositoryService, useValue: {} },
        { provide: NgxIndexedDBService, useValue: {} },
        ToastrService, // Añade el ToastrService
        { provide: 'ToastConfig', useValue: {} } // Añade el proveedor de configuración de Toast
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ManualDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
