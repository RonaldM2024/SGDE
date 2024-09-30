import { TestBed } from '@angular/core/testing';
import { FirebaseManualRepositoryService } from './firebase-manual-repository.service';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from 'src/environments/environment'; // Importa configuración real

describe('FirebaseManualRepositoryService', () => {
  let service: FirebaseManualRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule
      ],
      providers: [FirebaseManualRepositoryService]
    });
    service = TestBed.inject(FirebaseManualRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
