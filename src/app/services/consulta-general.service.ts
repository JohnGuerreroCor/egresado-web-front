import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { Periodo } from '../models/periodo';
import { Facultad } from '../models/facultad';
import { ProgramaGeneral } from '../models/programa-general';
import { NivelAcademico } from '../models/nivel-academico';

@Injectable({
  providedIn: 'root',
})
export class ConsultaGeneralService {
  private url: string = `${environment.URL_BACKEND}/consultageneral`;
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

  obtenerPeriodos(): Observable<Periodo[]> {
    return this.http
      .get<Periodo[]>(`${this.url}/obtener-periodos/`, {
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

  obtenerFacultades(): Observable<Facultad[]> {
    return this.http
      .get<Facultad[]>(`${this.url}/obtener-facultades/`, {
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

  obtenerProgramasFacultad(
    sede: number,
    nivel: number,
    facultad: number
  ): Observable<ProgramaGeneral[]> {
    return this.http
      .get<ProgramaGeneral[]>(
        `${this.url}/obtener-programas-facultad/${sede}/${nivel}/${facultad}`,
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

  obtenerNivelesAcademicos(): Observable<NivelAcademico[]> {
    return this.http
      .get<NivelAcademico[]>(`${this.url}/obtener-niveles-academicos`, {
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
}
