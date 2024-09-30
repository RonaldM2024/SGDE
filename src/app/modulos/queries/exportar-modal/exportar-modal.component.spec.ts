import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExportarModalComponent } from './exportar-modal.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxIndexedDBModule, DBConfig, NgxIndexedDBService } from 'ngx-indexed-db';
import { environment } from 'src/environments/environment'; // Importa configuración real
import { PdfGeneratorService } from 'src/app/features/documentos/infrastructure/servicios/Exportacion/pdf-generator.service';
import { FirestoreLogRepositoryService } from 'src/app/features/log/infrastructure/firestore-log-repository.service';
import { Egresado } from 'src/app/features/egresado/domain/Egresado';
import { Documento } from 'src/app/features/documentos/domain/Documento';
import { Cedula } from 'src/app/features/egresado/domain/ValueObject/Cedula';
import { NombreCompleto } from 'src/app/features/egresado/domain/ValueObject/NombreCompleto';

const dbConfig: DBConfig = {
  name: 'MyDb',
  version: 1,
  objectStoresMeta: [{
    store: 'tests',
    storeConfig: { keyPath: 'id', autoIncrement: true },
    storeSchema: [
      { name: 'name', keypath: 'name', options: { unique: false } }
    ]
  }]
};

describe('ExportarModalComponent', () => {
  let component: ExportarModalComponent;
  let fixture: ComponentFixture<ExportarModalComponent>;

  beforeEach(async () => {
    const mockEgresado = new Egresado(
      'egresadoIdMock',
      new Cedula('0123456789'),
      new NombreCompleto('Nombre Mock', 'Apellido Mock')
    );

    const mockDocumento = {
      id: 'documentoIdMock',
      consultarImagenUrl: () => 'mockUrl'
    } as Documento;

    await TestBed.configureTestingModule({
      declarations: [ExportarModalComponent],
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        HttpClientModule,
        ReactiveFormsModule,
        FormsModule,
        NgxIndexedDBModule.forRoot(dbConfig),
        ToastrModule.forRoot(),
        MatDialogModule,
        MatCardModule,
        MatTableModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: { egresado: mockEgresado, documento: mockDocumento } },
        { provide: PdfGeneratorService, useValue: jasmine.createSpyObj('PdfGeneratorService', ['generatePdfWithImage']) },
        { provide: FirestoreLogRepositoryService, useValue: jasmine.createSpyObj('FirestoreLogRepositoryService', ['registrarAccion']) },
        NgxIndexedDBService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ExportarModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
