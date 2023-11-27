import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { HistorialLaboral } from '../models/historial-laboral';

@Injectable({
  providedIn: 'root',
})
export class HistorialLaboralService {
  private url: string = `${environment.URL_BACKEND}/historialLaboral`;
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

  obtenerHistorialLaboral(id: string): Observable<HistorialLaboral[]> {
    return this.http
      .get<HistorialLaboral[]>(`${this.url}/obtener-historial-laboral/${id}`, {
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

  obtenerReporteHistorialLaboral(
    inicio: any,
    fin: any
  ): Observable<HistorialLaboral[]> {
    return this.http
      .get<HistorialLaboral[]>(
        `${this.url}/obtener-reporte-historial-laboral/${inicio}/${fin}`,
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

  registrar(historialLaboral: HistorialLaboral): Observable<number> {
    return this.http.put<number>(
      `${this.url}/registrar-historial-laboral`,
      historialLaboral,
      { headers: this.aggAutorizacionHeader() }
    );
  }

  actualizar(historialLaboral: HistorialLaboral): Observable<number> {
    return this.http.put<number>(
      `${this.url}/actualizar-historial-laboral`,
      historialLaboral,
      { headers: this.aggAutorizacionHeader() }
    );
  }
}
