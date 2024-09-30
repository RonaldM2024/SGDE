import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContratoDialogComponent } from './contrato-dialog.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms'; // Importa ReactiveFormsModule
import { NgxIndexedDBModule, DBConfig, NgxIndexedDBService } from 'ngx-indexed-db';
import { ToastrModule } from 'ngx-toastr';
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

describe('ContratoDialogComponent', () => {
  let component: ContratoDialogComponent;
  let fixture: ComponentFixture<ContratoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContratoDialogComponent],
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        HttpClientModule,
        ReactiveFormsModule, // Añade ReactiveFormsModule aquí
        NgxIndexedDBModule.forRoot(dbConfig),
        ToastrModule.forRoot()
      ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        NgxIndexedDBService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ContratoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
