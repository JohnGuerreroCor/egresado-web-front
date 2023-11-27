import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import localeEsCO from '@angular/common/locales/es-CO';
import { DatePipe } from '@angular/common';
import { MAT_DATE_LOCALE } from '@angular/material/core';

import { MaterialModules } from './material.modules';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './components/login/login.component';
import { TokenComponent } from './components/token/token.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { EncuestaEgresadoComponent } from './components/encuesta-egresado/encuesta-egresado.component';
import {
  DatosPersonalesComponent,
  ModalContacto,
  ModalExpedicion,
  ModalResidencia,
} from './components/encuesta-egresado/datos-personales/datos-personales.component';
import {
  ExperienciaLaboralComponent,
  ModalExperienciaLaboral,
} from './components/encuesta-egresado/experiencia-laboral/experiencia-laboral.component';
import {
  InformacionAcademicaComponent,
  ModalHabilidadInformatica,
} from './components/encuesta-egresado/informacion-academica/informacion-academica.component';
import { PerfilProfesionalComponent } from './components/encuesta-egresado/perfil-profesional/perfil-profesional.component';

registerLocaleData(localeEsCO, 'es-CO');

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    TokenComponent,
    NavbarComponent,
    EncuestaEgresadoComponent,
    DatosPersonalesComponent,
    ExperienciaLaboralComponent,
    InformacionAcademicaComponent,
    PerfilProfesionalComponent,
    ModalContacto,
    ModalExpedicion,
    ModalResidencia,
    ModalExperienciaLaboral,
    ModalHabilidadInformatica,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModules,
    AppRoutingModule,
    BrowserAnimationsModule,
  ],
  entryComponents: [
    ModalContacto,
    ModalExpedicion,
    ModalResidencia,
    ModalExperienciaLaboral,
    ModalHabilidadInformatica,
  ],
  providers: [
    DatePipe,
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    { provide: LOCALE_ID, useValue: 'es-CO' },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
