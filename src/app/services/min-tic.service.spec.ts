import { TestBed } from '@angular/core/testing';

import { MinTicService } from './min-tic.service';

describe('MinTicService', () => {
  let service: MinTicService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MinTicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
