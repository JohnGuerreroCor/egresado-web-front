import { TestBed } from '@angular/core/testing';

import { ConsultaGeneralService } from './consulta-general.service';

describe('ConsultaGeneralService', () => {
  let service: ConsultaGeneralService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsultaGeneralService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
