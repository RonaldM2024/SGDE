import { TestBed } from '@angular/core/testing';
import { FirestoreLogRepositoryService } from './firestore-log-repository.service';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { NgxIndexedDBModule, DBConfig, NgxIndexedDBService } from 'ngx-indexed-db';
import { environment } from 'src/environments/environment'; // Importa configuración real
import { HttpClientModule } from '@angular/common/http';

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

describe('FirestoreLogRepositoryService', () => {
  let service: FirestoreLogRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        NgxIndexedDBModule.forRoot(dbConfig), // Añade NgxIndexedDBModule aquí
        HttpClientModule // Añade HttpClientModule aquí
      ],
      providers: [FirestoreLogRepositoryService, NgxIndexedDBService] // Proveedor para NgxIndexedDBService
    });
    service = TestBed.inject(FirestoreLogRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
