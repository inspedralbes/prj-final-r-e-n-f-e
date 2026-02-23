import { TestBed } from '@angular/core/testing';

import { ApiManager } from './api-manager';

describe('ApiManager', () => {
  let service: ApiManager;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiManager);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
