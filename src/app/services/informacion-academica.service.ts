import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { HabilidadInformatica } from '../models/habilidad-informatica';
import { Idioma } from '../models/idioma';
import { RegistroEducativo } from '../models/registro-educativo';
import { DatosComplementarios } from '../models/datos-complementarios';

@Injectable({
  providedIn: 'root',
})
export class InformacionAcademicaService {
  private url: string = `${environment.URL_BACKEND}/informacionAcademica`;
  private httpHeaders = new HttpHeaders({ 'Content-type': 'application/json' });

  userLogeado: String = this.authservice.user.username;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authservice: AuthService
  ) {}

  private aggAutorizacionHeader(): HttpHeaders {
    let token = this.authservice.Token;
    if (token != null) {
      return this.httpHeaders.append('Authorization', 'Bearer ' + token);
    }
    return this.httpHeaders;
  }

  private isNoAutorizado(e: { status: number }): boolean {
    if (e.status == 401 || e.status == 403) {
      if (this.authservice.isAuthenticated()) {
        this.authservice.logout();
      }
      this.router.navigate(['login']);
      return true;
    }
    return false;
  }

  obtenerDatosComplementarios(id: string): Observable<DatosComplementarios[]> {
    return this.http
      .get<DatosComplementarios[]>(
        `${this.url}/obtener-datos-complementarios/${id}`,
        {
          headers: this.aggAutorizacionHeader(),
        }
      )
      .pipe(
        catchError((e) => {
          if (this.isNoAutorizado(e)) {
            return throwError(e);
          }
          return throwError(e);
        })
      );
  }

  obtenerRegistroEducativo(id: string): Observable<RegistroEducativo[]> {
    return this.http
      .get<RegistroEducativo[]>(
        `${this.url}/obtener-registro-educativo/${id}`,
        {
          headers: this.aggAutorizacionHeader(),
        }
      )
      .pipe(
        catchError((e) => {
          if (this.isNoAutorizado(e)) {
            return throwError(e);
          }
          return throwError(e);
        })
      );
  }

  obtenerHabilidadesInformaticas(
    id: string
  ): Observable<HabilidadInformatica[]> {
    return this.http
      .get<HabilidadInformatica[]>(
        `${this.url}/obtener-habilidades-informaticas/${id}`,
        {
          headers: this.aggAutorizacionHeader(),
        }
      )
      .pipe(
        catchError((e) => {
          if (this.isNoAutorizado(e)) {
            return throwError(e);
          }
          return throwError(e);
        })
      );
  }

  obtenerIdiomas(id: string): Observable<Idioma[]> {
    return this.http
      .get<Idioma[]>(`${this.url}/obtener-idiomas/${id}`, {
        headers: this.aggAutorizacionHeader(),
      })
      .pipe(
        catchError((e) => {
          if (this.isNoAutorizado(e)) {
            return throwError(e);
          }
          return throwError(e);
        })
      );
  }

  registrarEstudioRealizado(
    registroEducativo: RegistroEducativo
  ): Observable<number> {
    return this.http.put<number>(
      `${this.url}/registrar-educativo`,
      registroEducativo,
      { headers: this.aggAutorizacionHeader() }
    );
  }

  actualizarEstudioRealizado(
    registroEducativo: RegistroEducativo
  ): Observable<number> {
    return this.http.put<number>(
      `${this.url}/actualizar-educativo`,
      registroEducativo,
      { headers: this.aggAutorizacionHeader() }
    );
  }

  registrarIdioma(idioma: Idioma): Observable<number> {
    return this.http.put<number>(`${this.url}/registrar-idioma`, idioma, {
      headers: this.aggAutorizacionHeader(),
    });
  }

  actualizarIdioma(idioma: Idioma): Observable<number> {
    return this.http.put<number>(`${this.url}/actualizar-idioma`, idioma, {
      headers: this.aggAutorizacionHeader(),
    });
  }

  registrarHabilidadInformatica(
    habilidadInformatica: HabilidadInformatica
  ): Observable<number> {
    return this.http.put<number>(
      `${this.url}/registrar-habilidad-informatica`,
      habilidadInformatica,
      { headers: this.aggAutorizacionHeader() }
    );
  }

  actualizarHabilidadInformatica(
    habilidadInformatica: HabilidadInformatica
  ): Observable<number> {
    return this.http.put<number>(
      `${this.url}/actualizar-habilidad-informatica`,
      habilidadInformatica,
      { headers: this.aggAutorizacionHeader() }
    );
  }

  registrarDatosComplementarios(
    datosComplementarios: DatosComplementarios
  ): Observable<number> {
    return this.http.put<number>(
      `${this.url}/registrar-datos-complementarios`,
      datosComplementarios,
      { headers: this.aggAutorizacionHeader() }
    );
  }

  actualizarDatosComplementarios(
    datosComplementarios: DatosComplementarios
  ): Observable<number> {
    return this.http.put<number>(
      `${this.url}/actualizar-datos-complementarios`,
      datosComplementarios,
      { headers: this.aggAutorizacionHeader() }
    );
  }

  actualizarRegistroEgresado(
    datosComplementarios: DatosComplementarios
  ): Observable<number> {
    return this.http.put<number>(
      `${this.url}/actualizar-registro-egresado`,
      datosComplementarios,
      { headers: this.aggAutorizacionHeader() }
    );
  }
}
