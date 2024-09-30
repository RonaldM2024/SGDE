import { TestBed } from '@angular/core/testing';
import { FirestoreContratoRepositoryService } from './firestore-contrato-repository.service';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from 'src/environments/environment'; // Importa configuración real

describe('FirestoreContratoRepositoryService', () => {
  let service: FirestoreContratoRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule
      ],
      providers: [FirestoreContratoRepositoryService]
    });
    service = TestBed.inject(FirestoreContratoRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
