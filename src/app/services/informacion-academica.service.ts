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

  obtenerReporteHabilidadesInformaticas(
    inicio: any,
    fin: any
  ): Observable<HabilidadInformatica[]> {
    return this.http
      .get<HabilidadInformatica[]>(
        `${this.url}/obtener-reporte-habilidades-informaticas/${inicio}/${fin}`,
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

  obtenerReporteIdiomas(inicio: any, fin: any): Observable<Idioma[]> {
    return this.http
      .get<Idioma[]>(`${this.url}/obtener-reporte-idiomas/${inicio}/${fin}`, {
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

  obtenerReporteRegistroEducativo(
    inicio: any,
    fin: any
  ): Observable<RegistroEducativo[]> {
    return this.http
      .get<RegistroEducativo[]>(
        `${this.url}/obtener-reporte-registro-educativo/${inicio}/${fin}`,
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

  obtenerReporteDatosComplementarios(
    inicio: any,
    fin: any
  ): Observable<DatosComplementarios[]> {
    return this.http
      .get<DatosComplementarios[]>(
        `${this.url}/obtener-reporte-datos-complementarios/${inicio}/${fin}`,
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
}
