import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { Graduado } from '../models/graduado';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GraduadoService {
  private url: string = `${environment.URL_BACKEND}/graduado`;
  private httpHeaders = new HttpHeaders({ 'Content-type': 'application/json' });

  userLogeado: String = this.authservice.user.username;
  id = new BehaviorSubject('');

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

  private isNoAutorizado(e: any): boolean {
    if (e.status == 401 || e.status == 403) {
      if (this.authservice.isAuthenticated()) {
        this.authservice.logout();
      }
      this.router.navigate(['login']);
      return true;
    }
    return false;
  }

  setId(id: string) {
    this.id.next(id);
  }

  obtenerGraduado(codigo: String): Observable<Graduado[]> {
    return this.http.get<Graduado[]>(
      `${this.url}/obtener-graduado/${codigo}/${this.userLogeado}`,
      { headers: this.aggAutorizacionHeader() }
    );
  }

  obtenerGraduadoEstudianteActivo(codigo: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.url}/obtener-graduado-estudiante-activo/${codigo}/${this.userLogeado}`,
      { headers: this.aggAutorizacionHeader() }
    );
  }
}
