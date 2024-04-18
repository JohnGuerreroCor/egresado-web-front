import { Component, ViewChild, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { GraduadoService } from 'src/app/services/graduado.service';
import { FotoService } from 'src/app/services/foto.service';
import { UbicacionService } from 'src/app/services/ubicacion.service';
import { DatosPersonalesService } from 'src/app/services/datos-personales.service';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Pais } from 'src/app/models/pais';
import { Departamento } from 'src/app/models/departamento';
import { Municipio } from 'src/app/models/municipio';
import { Ambito } from 'src/app/models/ambito';
import { HistorialLaboralService } from 'src/app/services/historial-laboral.service';
import { HistorialLaboral } from 'src/app/models/historial-laboral';

@Component({
  selector: 'app-experiencia-laboral',
  templateUrl: './experiencia-laboral.component.html',
  styleUrls: ['./experiencia-laboral.component.css'],
})
export class ExperienciaLaboralComponent {
  listadoRespuestas: HistorialLaboral[] = [];

  identificacion: string = '';

  dataSource = new MatTableDataSource<HistorialLaboral>([]);
  displayedColumns: string[] = [
    'index',
    'cargo',
    'funcion',
    'empresa',
    'fechaInicio',
    'fechaFin',
    'opciones',
  ];
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  dialogRef!: MatDialogRef<any>;

  constructor(
    public authService: AuthService,
    public dialog: MatDialog,
    public graduadoService: GraduadoService,
    public fotoService: FotoService,
    public ubicacionService: UbicacionService,
    public datosPersonalesService: DatosPersonalesService,
    public historialLaboralService: HistorialLaboralService,
    private router: Router
  ) {
    this.identificacion = '' + authService.user.personaIdentificacion;
    this.obtenerMencionReconocimiento();
  }

  obtenerMencionReconocimiento() {
    this.historialLaboralService
      .obtenerHistorialLaboral(this.identificacion)
      .subscribe((data) => {
        this.listadoRespuestas = data;
        this.dataSource = new MatTableDataSource<HistorialLaboral>(data);
        this.paginator.firstPage();
        this.dataSource.paginator = this.paginator;
      });
  }

  registrarFormulario(): void {
    this.dialogRef = this.dialog.open(ModalExperienciaLaboral, {
      width: '50%',
      disableClose: true,
    });
    this.dialogRef.afterClosed().subscribe(() => {
      this.onModalClosed();
    });
  }

  editarFormulario(element: any): void {
    this.dialogRef = this.dialog.open(ModalExperienciaLaboral, {
      width: '50%',
      disableClose: true,
      data: { historialLaboral: element },
    });
    this.dialogRef.afterClosed().subscribe(() => {
      this.onModalClosed();
    });
  }

  onModalClosed() {
    this.obtenerMencionReconocimiento();
  }

  actualizar(historialLaboral: HistorialLaboral) {
    this.historialLaboralService.actualizar(historialLaboral).subscribe(
      (data) => {
        if (data > 0) {
          this.obtenerMencionReconocimiento();
        } else {
          this.mensajeError();
        }
      },
      (err) => this.fError(err)
    );
  }

  eliminarMencionReconocimiento(element: HistorialLaboral) {
    Swal.fire({
      title: '¿Está seguro de eliminar este elemento?',
      text: 'La siguiente operación será irreversible',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00c053',
      cancelButtonColor: '#ffc107',
      confirmButtonText: 'Si, estoy seguro',
      cancelButtonText: 'Cancelar opreación',
    }).then((result) => {
      if (result.isConfirmed) {
        element.estado = 0;
        this.actualizar(element);
        Swal.fire({
          icon: 'success',
          title: 'Elemento borrado.',
          confirmButtonColor: '#006983',
          confirmButtonText: 'Listo',
        });
      }
    });
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

//// MODAL

@Component({
  selector: 'modal-experiencia-laboral',
  templateUrl: 'modal-experiencia-laboral.html',
  styleUrls: ['./experiencia-laboral.component.css'],
})
export class ModalExperienciaLaboral {
  listadoAmbitos: Ambito[] = [];
  listadoPaises: Pais[] = [];
  listadoDepartamento: Departamento[] = [];
  listadoMunicipio: Municipio[] = [];
  editar: boolean = false;

  formulario!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ModalExperienciaLaboral>,
    public dialog: MatDialog,
    public authService: AuthService,
    public graduadoService: GraduadoService,
    private formBuilder: FormBuilder,
    public fotoService: FotoService,
    public historialLaboralService: HistorialLaboralService,
    public ubicacionService: UbicacionService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (this.authService.validacionToken()) {
      this.obtenerPais();
      this.crearFormulario();
      if (JSON.stringify(data) !== 'null') {
        this.editarHistorialLaboral(data.historialLaboral);
      }
    }
  }

  private crearFormulario(): void {
    this.formulario = this.formBuilder.group({
      codigo: new FormControl(''),
      personaCodigo: new FormControl(''),
      cargo: new FormControl('', Validators.required),
      funcion: new FormControl('', Validators.required),
      empresa: new FormControl('', Validators.required),
      fechaInicio: new FormControl('', Validators.required),
      fechaFin: new FormControl('', Validators.required),
      estado: new FormControl(''),
    });
  }

  obtenerPais() {
    this.ubicacionService.obtenerPaises().subscribe((data) => {
      this.listadoPaises = data;
    });
  }

  obtenerDepartamentos(element: number) {
    this.listadoDepartamento = [];
    this.ubicacionService
      .obtenerDepartamentosPorPais(element)
      .subscribe((data) => {
        this.listadoDepartamento = data;
      });
  }

  obtenerMunicipios(element: number) {
    this.listadoMunicipio = [];
    this.ubicacionService
      .obtenerMunicipiosPorDepartamento(element)
      .subscribe((data) => {
        this.listadoMunicipio = data;
      });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  generar(): void {
    let historialLaboral: HistorialLaboral = new HistorialLaboral();
    historialLaboral.codigo = this.formulario.get('codigo')!.value;
    historialLaboral.personaCodigo = this.authService.user.personaCodigo;
    historialLaboral.cargo = this.formulario.get('cargo')!.value;
    historialLaboral.funcion = this.formulario.get('funcion')!.value;
    historialLaboral.empresa = this.formulario.get('empresa')!.value;
    historialLaboral.fechaInicio = this.formulario.get('fechaInicio')!.value;
    historialLaboral.fechaFin = this.formulario.get('fechaFin')!.value;
    historialLaboral.estado = this.formulario.get('estado')!.value;
    if (this.editar) {
      this.actualizar(historialLaboral);
    } else {
      this.registrar(historialLaboral);
    }
  }

  registrar(historialLaboral: HistorialLaboral) {
    this.historialLaboralService.registrar(historialLaboral).subscribe(
      (data) => {
        if (data > 0) {
          Swal.fire({
            icon: 'success',
            title: 'Registrado',
            text: '¡Operación exitosa!',
            showConfirmButton: false,
            timer: 2500,
          });
          this.cancelar();
          this.dialogRef.close();
          this.crearFormulario();
        } else {
          this.mensajeError();
        }
      },
      (err) => this.fError(err)
    );
  }

  actualizar(historialLaboral: HistorialLaboral) {
    this.historialLaboralService.actualizar(historialLaboral).subscribe(
      (data) => {
        if (data > 0) {
          Swal.fire({
            icon: 'success',
            title: 'Actualizado',
            text: '¡Operación exitosa!',
            showConfirmButton: false,
          });
          this.dialogRef.close();
          this.cancelar();
        } else {
          this.mensajeError();
        }
      },
      (err) => this.fError(err)
    );
  }

  editarHistorialLaboral(element: HistorialLaboral) {
    this.editar = true;
    this.formulario.get('codigo')!.setValue(element.codigo);
    this.formulario.get('personaCodigo')!.setValue(element.personaCodigo);
    this.formulario.get('cargo')!.setValue(element.cargo);
    this.formulario.get('funcion')!.setValue(element.funcion);
    this.formulario.get('empresa')!.setValue(element.empresa);
    let fechaInicio = new Date(element.fechaInicio + ' 0:00:00');
    this.formulario.get('fechaInicio')!.setValue(fechaInicio);
    let fechaFin = new Date(element.fechaFin + ' 0:00:00');
    this.formulario.get('fechaFin')!.setValue(fechaFin);
    this.formulario.get('estado')!.setValue(element.estado);
  }

  cancelar() {
    this.formulario.reset();
    this.crearFormulario();
    this.obtenerPais();
    this.editar = false;
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
