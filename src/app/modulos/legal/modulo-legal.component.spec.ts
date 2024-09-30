import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModuloLegalComponent } from './modulo-legal.component';
import { ReactiveFormsModule } from '@angular/forms'; // Importa ReactiveFormsModule si lo necesitas
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from 'src/environments/environment'; // Asegúrate de que esta es la ruta correcta
import { FirestoreContratoRepositoryService } from 'src/app/features/legal/infrastructure/firestore-contrato-repository.service';
import { MatDialogModule } from '@angular/material/dialog'; // Importa los módulos de Angular Material que uses
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { NgxIndexedDBModule, DBConfig } from 'ngx-indexed-db'; // Importa NgxIndexedDBModule y DBConfig
import { HttpClientModule } from '@angular/common/http'; // Importa HttpClientModule
import { FirestoreLogRepositoryService } from 'src/app/features/log/infrastructure/firestore-log-repository.service'; // Importa el servicio necesario
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

const dbConfig: DBConfig = {
  name: 'MyDb',
  version: 1,
  objectStoresMeta: [{
    store: 'logs',
    storeConfig: { keyPath: 'id', autoIncrement: true },
    storeSchema: [
      { name: 'name', keypath: 'name', options: { unique: false } }
    ]
  }]
};

describe('ModuloLegalComponent', () => {
  let component: ModuloLegalComponent;
  let fixture: ComponentFixture<ModuloLegalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModuloLegalComponent],
      imports: [
        ReactiveFormsModule, // Asegúrate de importar ReactiveFormsModule si usas formularios reactivos
        BrowserAnimationsModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        MatDialogModule, // Agrega cualquier otro módulo de Angular Material que necesites
        MatCardModule,
        MatTableModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        ToastrModule.forRoot(), // Importa ToastrModule
        NgxIndexedDBModule.forRoot(dbConfig), // Importa NgxIndexedDBModule y configúralo
        HttpClientModule // Importa HttpClientModule
      ],
      providers: [
        FirestoreContratoRepositoryService,
        ToastrService, // Añade el ToastrService
        FirestoreLogRepositoryService, // Añade FirestoreLogRepositoryService
        { provide: 'ToastConfig', useValue: {} } // Añade el proveedor de configuración de Toast
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ModuloLegalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
