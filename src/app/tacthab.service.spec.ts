import { TestBed, inject } from '@angular/core/testing';

import { TacthabService } from './tacthab.service';

describe('TacthabService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TacthabService]
    });
  });

  it('should be created', inject([TacthabService], (service: TacthabService) => {
    expect(service).toBeTruthy();
  }));
});
