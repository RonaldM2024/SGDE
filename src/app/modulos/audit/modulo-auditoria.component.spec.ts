import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModuloAuditoriaComponent } from './modulo-auditoria.component';
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
import { FirestoreLogRepositoryService } from 'src/app/features/log/infrastructure/firestore-log-repository.service';
import { MatPaginatorModule } from '@angular/material/paginator';
import { of } from 'rxjs';
import { Log } from 'src/app/features/log/domain/Log';
import { TipoModulo } from 'src/app/features/log/domain/TipoModulo';

// Mock de Timestamp
const mockTimestamp = {
  toDate: () => new Date()
};

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

describe('ModuloAuditoriaComponent', () => {
  let component: ModuloAuditoriaComponent;
  let fixture: ComponentFixture<ModuloAuditoriaComponent>;
  let logServiceMock: jasmine.SpyObj<FirestoreLogRepositoryService>;

  beforeEach(async () => {
    const logsMock: Log[] = [
      new Log('1', 'Accion 1', mockTimestamp as any, 'User1', '127.0.0.1', 'Detalle 1'),
      new Log('2', 'Accion 2', mockTimestamp as any, 'User2', '127.0.0.2', 'Detalle 2')
    ];

    logServiceMock = jasmine.createSpyObj('FirestoreLogRepositoryService', ['consultarLogs', 'registrarLog']);
    logServiceMock.consultarLogs.and.returnValue(of(logsMock));

    await TestBed.configureTestingModule({
      declarations: [ModuloAuditoriaComponent],
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
        BrowserAnimationsModule,
        MatPaginatorModule
      ],
      providers: [
        { provide: FirestoreLogRepositoryService, useValue: logServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ModuloAuditoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
