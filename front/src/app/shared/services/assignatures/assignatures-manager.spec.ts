import { TestBed } from '@angular/core/testing';

import { AssignaturesManager } from './assignatures-manager';

describe('AssignaturesManager', () => {
  let service: AssignaturesManager;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssignaturesManager);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
