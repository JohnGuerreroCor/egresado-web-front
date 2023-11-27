import { TestBed } from '@angular/core/testing';

import { InformacionAcademicaService } from './informacion-academica.service';

describe('InformacionAcademicaService', () => {
  let service: InformacionAcademicaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InformacionAcademicaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
