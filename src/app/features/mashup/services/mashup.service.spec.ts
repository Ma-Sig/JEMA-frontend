import { TestBed } from '@angular/core/testing';

import { MashupService } from './mashup.service';

describe('MashupService', () => {
  let service: MashupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MashupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
