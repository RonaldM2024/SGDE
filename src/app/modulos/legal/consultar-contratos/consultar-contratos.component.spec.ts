import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConsultarContratosComponent } from './consultar-contratos.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
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

describe('ConsultarContratosComponent', () => {
  let component: ConsultarContratosComponent;
  let fixture: ComponentFixture<ConsultarContratosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConsultarContratosComponent],
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        HttpClientModule,
        ReactiveFormsModule,
        NgxIndexedDBModule.forRoot(dbConfig),
        ToastrModule.forRoot()
      ],
      providers: [
        NgxIndexedDBService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ConsultarContratosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
