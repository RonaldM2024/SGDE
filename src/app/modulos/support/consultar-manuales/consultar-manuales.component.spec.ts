import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultarManualesComponent } from './consultar-manuales.component';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';

describe('ConsultarManualesComponent', () => {
  let component: ConsultarManualesComponent;
  let fixture: ComponentFixture<ConsultarManualesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConsultarManualesComponent],
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ConsultarManualesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
