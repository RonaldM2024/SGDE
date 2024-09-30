import { TestBed } from '@angular/core/testing';

import { CiDetectionService } from './ci-detection.service';

describe('CiDetectionService', () => {
  let service: CiDetectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CiDetectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
