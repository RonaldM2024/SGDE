import { TestBed } from '@angular/core/testing';
import { FirestoreStorageService } from './firestore-storage.service';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { environment } from 'src/environments/environment'; // Importa configuración real

describe('FirestoreStorageService', () => {
  let service: FirestoreStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireStorageModule
      ],
      providers: [FirestoreStorageService]
    });
    service = TestBed.inject(FirestoreStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
