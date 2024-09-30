import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModuloDigitalizadorComponent } from './modulo-digitalizador.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { NgxIndexedDBModule, DBConfig, NgxIndexedDBService } from 'ngx-indexed-db';
import { environment } from 'src/environments/environment'; // Importa configuración real

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

describe('ModuloDigitalizadorComponent', () => {
  let component: ModuloDigitalizadorComponent;
  let fixture: ComponentFixture<ModuloDigitalizadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModuloDigitalizadorComponent],
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        HttpClientModule,
        ReactiveFormsModule,
        NgxIndexedDBModule.forRoot(dbConfig),
        ToastrModule.forRoot(),
        MatDialogModule,
        MatCardModule,
        MatTableModule
      ],
      providers: [
        { provide: MatDialog, useValue: {} }, // Proveedor para MatDialog
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        NgxIndexedDBService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ModuloDigitalizadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
