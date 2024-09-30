import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModuloAdmUsuariosComponent } from './modulo-adm-usuarios.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxIndexedDBModule, DBConfig, NgxIndexedDBService } from 'ngx-indexed-db';
import { ReactiveFormsModule } from '@angular/forms'; // Importa ReactiveFormsModule
import { environment } from 'src/environments/environment'; // Importa configuración real
import { MatCardModule } from '@angular/material/card'; // Importa MatCardModule
import { MatTableModule } from '@angular/material/table'; // Importa MatTableModule

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

describe('ModuloAdmUsuariosComponent', () => {
  let component: ModuloAdmUsuariosComponent;
  let fixture: ComponentFixture<ModuloAdmUsuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModuloAdmUsuariosComponent],
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        ToastrModule.forRoot(),
        HttpClientModule,
        RouterTestingModule,
        NgxIndexedDBModule.forRoot(dbConfig),
        MatCardModule,
        ReactiveFormsModule,
        MatTableModule // Añade MatTableModule aquí
      ],
      providers: [NgxIndexedDBService]
    }).compileComponents();

    fixture = TestBed.createComponent(ModuloAdmUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
