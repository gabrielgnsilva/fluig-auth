import { TestBed } from '@angular/core/testing';

import { FluigAuthService } from './fluig-auth.service';

describe('FluigAuthService', () => {
  let service: FluigAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FluigAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
