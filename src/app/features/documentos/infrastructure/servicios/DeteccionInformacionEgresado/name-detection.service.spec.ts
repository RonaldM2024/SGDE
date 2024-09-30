import { TestBed } from '@angular/core/testing';
import { NameDetectionService } from './name-detection.service';
import { HttpClientModule } from '@angular/common/http';

describe('NameDetectionService', () => {
  let service: NameDetectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule], // Añade HttpClientModule aquí
      providers: [NameDetectionService]
    });
    service = TestBed.inject(NameDetectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
