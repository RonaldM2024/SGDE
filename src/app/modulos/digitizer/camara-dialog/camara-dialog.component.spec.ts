import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CamaraDialogComponent } from './camara-dialog.component';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('CamaraDialogComponent', () => {
  let component: CamaraDialogComponent;
  let fixture: ComponentFixture<CamaraDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CamaraDialogComponent],
      imports: [
        MatDialogModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CamaraDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
