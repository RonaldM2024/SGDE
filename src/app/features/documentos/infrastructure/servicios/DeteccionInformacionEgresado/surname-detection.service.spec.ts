import { TestBed } from '@angular/core/testing';
import { SurnameDetectionService } from './surname-detection.service';
import { HttpClientModule } from '@angular/common/http';

describe('SurnameDetectionService', () => {
  let service: SurnameDetectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule], // Añade HttpClientModule aquí
      providers: [SurnameDetectionService]
    });
    service = TestBed.inject(SurnameDetectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
