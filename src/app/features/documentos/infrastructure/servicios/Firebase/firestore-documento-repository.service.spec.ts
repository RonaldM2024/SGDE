import { TestBed } from '@angular/core/testing';
import { FirestoreDocumentoRepositoryService } from './firestore-documento-repository.service';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from 'src/environments/environment'; // Importa configuración real

describe('FirestoreDocumentoRepositoryService', () => {
  let service: FirestoreDocumentoRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule
      ],
      providers: [FirestoreDocumentoRepositoryService]
    });
    service = TestBed.inject(FirestoreDocumentoRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
