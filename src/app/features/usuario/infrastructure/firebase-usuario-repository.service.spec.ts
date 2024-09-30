import { TestBed } from '@angular/core/testing';
import { FirebaseUsuarioRepositoryService } from './firebase-usuario-repository.service';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from 'src/environments/environment'; // Importa configuración real
import { ToastrModule } from 'ngx-toastr';

describe('FirebaseUsuarioRepositoryService', () => {
  let service: FirebaseUsuarioRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        ToastrModule.forRoot(),
      ],
      providers: [FirebaseUsuarioRepositoryService]
    });
    service = TestBed.inject(FirebaseUsuarioRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
