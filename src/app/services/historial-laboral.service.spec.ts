import { TestBed } from '@angular/core/testing';

import { HistorialLaboralService } from './historial-laboral.service';

describe('HistorialLaboralService', () => {
  let service: HistorialLaboralService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistorialLaboralService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
