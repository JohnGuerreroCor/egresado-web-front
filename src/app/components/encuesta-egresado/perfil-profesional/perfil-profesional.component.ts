import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GraduadoService } from 'src/app/services/graduado.service';
import { FotoService } from 'src/app/services/foto.service';
import { DatosComplementarios } from 'src/app/models/datos-complementarios';
import { InformacionAcademicaService } from 'src/app/services/informacion-academica.service';
import { AuthService } from 'src/app/services/auth.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil-profesional',
  templateUrl: './perfil-profesional.component.html',
  styleUrls: ['./perfil-profesional.component.css'],
})
export class PerfilProfesionalComponent {
  editar: boolean = false;
  datosComplementarios: DatosComplementarios[] = [];

  formulario!: FormGroup;

  constructor(
    public authService: AuthService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    public graduadoService: GraduadoService,
    public fotoService: FotoService,
    public informacionAcademicaService: InformacionAcademicaService,
    private router: Router
  ) {
    this.crearFormulario();
    this.obtenerDatosComplementarios();
  }

  private crearFormulario(): void {
    this.formulario = this.formBuilder.group({
      codigo: new FormControl(''),
      estudianteCodigo: new FormControl(''),
      modalidad: new FormControl('', Validators.required),
      perfil: new FormControl('', Validators.required),
      programa: new FormControl(''),
      fechaGrado: new FormControl(''),
    });
  }

  generar(): void {
    let datosComplementarios: DatosComplementarios = new DatosComplementarios();
    datosComplementarios.codigo = this.formulario.get('codigo')!.value;
    datosComplementarios.estudianteCodigo =
      this.authService.user.username.slice(1);
    datosComplementarios.modalidad = this.formulario.get('modalidad')!.value;
    datosComplementarios.perfilProfesional =
      this.formulario.get('perfil')!.value;
    if (this.editar) {
      this.actualizar(datosComplementarios);
    } else {
      this.registrar(datosComplementarios);
    }
  }

  obtenerDatosComplementarios() {
    this.informacionAcademicaService
      .obtenerDatosComplementarios(this.authService.user.username.slice(1))
      .subscribe((data) => {
        if (JSON.stringify(data) != '[]') {
          this.editar = true;
          this.editarDatosComplementarios(data[0]);
        }
      });
  }

  registrar(datosComplementarios: DatosComplementarios) {
    this.informacionAcademicaService
      .registrarDatosComplementarios(datosComplementarios)
      .subscribe(
        (data) => {
          if (data > 0) {
            Swal.fire({
              icon: 'success',
              title: 'Registrado',
              text: '¡Operación exitosa!',
              showConfirmButton: false,
              timer: 2500,
            });
            this.actualizarRegistroEgresado(datosComplementarios);
            this.crearFormulario();
            this.obtenerDatosComplementarios();
          } else {
            this.mensajeError();
          }
        },
        (err) => this.fError(err)
      );
  }

  actualizar(datosComplementarios: DatosComplementarios) {
    this.informacionAcademicaService
      .actualizarDatosComplementarios(datosComplementarios)
      .subscribe(
        (data) => {
          if (data > 0) {
            Swal.fire({
              icon: 'success',
              title: 'Actualizado',
              text: '¡Operación exitosa!',
              showConfirmButton: false,
            });
            this.obtenerDatosComplementarios();
          } else {
            this.mensajeError();
          }
        },
        (err) => this.fError(err)
      );
  }

  actualizarRegistroEgresado(datosComplementarios: DatosComplementarios) {
    this.informacionAcademicaService
      .actualizarRegistroEgresado(datosComplementarios)
      .subscribe(
        (data) => {
          if (data > 0) {
            Swal.fire({
              icon: 'success',
              title: 'Registrado como egresado',
              text: '¡Ya puede generar la liquidación de derechos de grado!',
              showConfirmButton: false,
            });
            this.obtenerDatosComplementarios();
          } else {
            this.mensajeError();
          }
        },
        (err) => this.fError(err)
      );
  }

  editarDatosComplementarios(element: DatosComplementarios) {
    this.editar = true;
    this.formulario.get('codigo')!.setValue(element.codigo);
    this.formulario.get('estudianteCodigo')!.setValue(element.estudianteCodigo);
    this.formulario.get('modalidad')!.setValue(element.modalidad);
    this.formulario.get('perfil')!.setValue(element.perfilProfesional);
    this.formulario.get('programa')!.setValue(element.programa);
    this.formulario.get('fechaGrado')!.setValue(element.fechaGrado);
  }

  mensajeSuccses() {
    Swal.fire({
      icon: 'success',
      title: 'Proceso realizado',
      text: '¡Operación exitosa!',
      showConfirmButton: false,
      timer: 2500,
    });
  }

  mensajeError() {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo completar el proceso.',
      showConfirmButton: true,
      confirmButtonText: 'Listo',
      confirmButtonColor: '#8f141b',
    });
  }

  fError(er: any): void {
    let err = er.error.error_description;
    let arr: string[] = err.split(':');
    if (arr[0] == 'Access token expired') {
      this.authService.logout();
      this.router.navigate(['login']);
    } else {
      this.mensajeError();
    }
  }
}
