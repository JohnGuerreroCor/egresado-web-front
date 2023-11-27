import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EncuestaEgresadoComponent } from './encuesta-egresado.component';

describe('EncuestaEgresadoComponent', () => {
  let component: EncuestaEgresadoComponent;
  let fixture: ComponentFixture<EncuestaEgresadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EncuestaEgresadoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EncuestaEgresadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
