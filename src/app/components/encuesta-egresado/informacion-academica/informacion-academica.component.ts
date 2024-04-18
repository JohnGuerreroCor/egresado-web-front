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
import { RegistroEducativo } from 'src/app/models/registro-educativo';
import { Idioma } from 'src/app/models/idioma';
import { HabilidadInformatica } from 'src/app/models/habilidad-informatica';
import { InformacionAcademicaService } from 'src/app/services/informacion-academica.service';
import { ConsultaGeneralService } from 'src/app/services/consulta-general.service';
import { NivelAcademico } from 'src/app/models/nivel-academico';

@Component({
  selector: 'app-informacion-academica',
  templateUrl: './informacion-academica.component.html',
  styleUrls: ['./informacion-academica.component.css'],
})
export class InformacionAcademicaComponent {
  listadoRespuestas: HistorialLaboral[] = [];

  identificacion: string = '';

  dataSourceRegistroEducativo = new MatTableDataSource<RegistroEducativo>([]);
  displayedColumnsRegistroEducativo: string[] = [
    'index',
    'estudio',
    'nivel',
    'municipio',
    'entidad',
    'fecha',
    'finalizado',
    'opciones',
  ];
  @ViewChild('MatPaginatorRegistroEducativo', { static: false })
  paginatorRegistroEducativo!: MatPaginator;

  dataSourceIdioma = new MatTableDataSource<Idioma>([]);
  displayedColumnsIdioma: string[] = [
    'index',
    'idioma',
    'conversacion',
    'escritura',
    'lectura',
    'opciones',
  ];
  @ViewChild('MatPaginatorIdioma', { static: false })
  paginatorIdioma!: MatPaginator;

  dataSourceHabilidadInformatica = new MatTableDataSource<HabilidadInformatica>(
    []
  );
  displayedColumnsHabilidadInformatica: string[] = [
    'index',
    'programa',
    'dominio',
    'opciones',
  ];
  @ViewChild('MatPaginatorHabilidadInformatica', { static: false })
  paginatorHabilidadInformatica!: MatPaginator;

  dialogRef!: MatDialogRef<any>;

  constructor(
    public authService: AuthService,
    public dialog: MatDialog,
    public graduadoService: GraduadoService,
    public fotoService: FotoService,
    public ubicacionService: UbicacionService,
    public datosPersonalesService: DatosPersonalesService,
    public informacionAcademicaService: InformacionAcademicaService,
    private router: Router
  ) {
    this.identificacion = '' + authService.user.personaIdentificacion;
    this.obtenerRegistroEducativo();
    this.obtenerIdiomas();
    this.obtenerHabilidadesInformatica();
  }

  obtenerRegistroEducativo() {
    this.informacionAcademicaService
      .obtenerRegistroEducativo(this.identificacion)
      .subscribe((data) => {
        this.dataSourceRegistroEducativo =
          new MatTableDataSource<RegistroEducativo>(data);
        this.paginatorRegistroEducativo.firstPage();
        this.dataSourceRegistroEducativo.paginator =
          this.paginatorRegistroEducativo;
      });
  }

  obtenerIdiomas() {
    this.informacionAcademicaService
      .obtenerIdiomas(this.identificacion)
      .subscribe((data) => {
        this.dataSourceIdioma = new MatTableDataSource<Idioma>(data);
        this.paginatorIdioma.firstPage();
        this.dataSourceIdioma.paginator = this.paginatorIdioma;
      });
  }

  obtenerHabilidadesInformatica() {
    this.informacionAcademicaService
      .obtenerHabilidadesInformaticas(this.identificacion)
      .subscribe((data) => {
        this.dataSourceHabilidadInformatica =
          new MatTableDataSource<HabilidadInformatica>(data);
        this.paginatorRegistroEducativo.firstPage();
        this.dataSourceHabilidadInformatica.paginator =
          this.paginatorHabilidadInformatica;
      });
  }

  registrarFormularioEstudiosRealizados(): void {
    this.dialogRef = this.dialog.open(ModalEstudiosRealizados, {
      width: '70%',
      disableClose: true,
    });
    this.dialogRef.afterClosed().subscribe(() => {
      this.onModalClosed();
    });
  }

  editarFormularioEstudiosRealizados(element: any): void {
    this.dialogRef = this.dialog.open(ModalEstudiosRealizados, {
      width: '70%',
      disableClose: true,
      data: { registroEducativo: element },
    });
    this.dialogRef.afterClosed().subscribe(() => {
      this.onModalClosed();
    });
  }

  registrarFormularioIdioma(): void {
    this.dialogRef = this.dialog.open(ModalIdioma, {
      width: '50%',
      disableClose: true,
    });
    this.dialogRef.afterClosed().subscribe(() => {
      this.onModalClosed();
    });
  }

  editarFormularioIdioma(element: any): void {
    this.dialogRef = this.dialog.open(ModalIdioma, {
      width: '50%',
      disableClose: true,
      data: { idioma: element },
    });
    this.dialogRef.afterClosed().subscribe(() => {
      this.onModalClosed();
    });
  }

  registrarFormularioHabilidadInformatica(): void {
    this.dialogRef = this.dialog.open(ModalHabilidadInformatica, {
      width: '50%',
      disableClose: true,
    });
    this.dialogRef.afterClosed().subscribe(() => {
      this.onModalClosed();
    });
  }

  editarFormularioHabilidadInformatica(element: any): void {
    this.dialogRef = this.dialog.open(ModalHabilidadInformatica, {
      width: '50%',
      disableClose: true,
      data: { habilidadInformatica: element },
    });
    this.dialogRef.afterClosed().subscribe(() => {
      this.onModalClosed();
    });
  }

  onModalClosed() {
    this.obtenerRegistroEducativo();
    this.obtenerIdiomas();
    this.obtenerHabilidadesInformatica();
  }

  actualizarRegistroEducativo(registroEducativo: RegistroEducativo) {
    this.informacionAcademicaService
      .actualizarEstudioRealizado(registroEducativo)
      .subscribe(
        (data) => {
          if (data > 0) {
            this.obtenerRegistroEducativo();
          } else {
            this.mensajeError();
          }
        },
        (err) => this.fError(err)
      );
  }

  actualizarIdioma(idioma: Idioma) {
    this.informacionAcademicaService.actualizarIdioma(idioma).subscribe(
      (data) => {
        if (data > 0) {
          this.obtenerIdiomas();
        } else {
          this.mensajeError();
        }
      },
      (err) => this.fError(err)
    );
  }

  actualizarHabilidadInformatica(habilidadInformatica: HabilidadInformatica) {
    this.informacionAcademicaService
      .actualizarHabilidadInformatica(habilidadInformatica)
      .subscribe(
        (data) => {
          if (data > 0) {
            this.obtenerHabilidadesInformatica();
          } else {
            this.mensajeError();
          }
        },
        (err) => this.fError(err)
      );
  }

  eliminarRegistroEducativo(element: RegistroEducativo) {
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
        this.actualizarRegistroEducativo(element);
        Swal.fire({
          icon: 'success',
          title: 'Elemento borrado.',
          confirmButtonColor: '#006983',
          confirmButtonText: 'Listo',
        });
      }
    });
  }

  eliminarIdioma(element: Idioma) {
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
        this.actualizarIdioma(element);
        Swal.fire({
          icon: 'success',
          title: 'Elemento borrado.',
          confirmButtonColor: '#006983',
          confirmButtonText: 'Listo',
        });
      }
    });
  }

  eliminarHabilidadInformatica(element: HabilidadInformatica) {
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
        this.actualizarHabilidadInformatica(element);
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

//// MODAL ESTUDIOS REALIZADOS

@Component({
  selector: 'modal-estudios-realizados',
  templateUrl: 'modal-estudios-realizados.html',
  styleUrls: ['./informacion-academica.component.css'],
})
export class ModalEstudiosRealizados {
  editar: boolean = false;
  listadoPaises: Pais[] = [];
  listadoDepartamento: Departamento[] = [];
  listadoMunicipio: Municipio[] = [];
  listadoNivelesFormacion: NivelAcademico[] = [];

  formulario!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ModalHabilidadInformatica>,
    public dialog: MatDialog,
    public authService: AuthService,
    public graduadoService: GraduadoService,
    private formBuilder: FormBuilder,
    public fotoService: FotoService,
    public informacionAcademicaService: InformacionAcademicaService,
    public ubicacionService: UbicacionService,
    public consultaGeneralService: ConsultaGeneralService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (this.authService.validacionToken()) {
      this.obtenerNivelesFormacion();
      this.crearFormulario();
      this.obtenerPais();
      if (JSON.stringify(data) !== 'null') {
        this.editarRegistroEducativo(data.registroEducativo);
      }
    }
  }

  private crearFormulario(): void {
    this.formulario = this.formBuilder.group({
      codigo: new FormControl(''),
      personaCodigo: new FormControl(''),
      titulo: new FormControl('', Validators.required),
      nivelFormacion: new FormControl('', Validators.required),
      pais: new FormControl('', Validators.required),
      departamento: new FormControl('', Validators.required),
      municipio: new FormControl('', Validators.required),
      entidad: new FormControl('', Validators.required),
      fecha: new FormControl('', Validators.required),
      obtenido: new FormControl('', Validators.required),
      estado: new FormControl(''),
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  obtenerNivelesFormacion() {
    this.consultaGeneralService.obtenerNivelesAcademicos().subscribe((data) => {
      this.listadoNivelesFormacion = data;
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

  generar(): void {
    let registroEducativo: RegistroEducativo = new RegistroEducativo();
    registroEducativo.codigo = this.formulario.get('codigo')!.value;
    registroEducativo.personaCodigo = this.authService.user.personaCodigo;
    registroEducativo.titulo = this.formulario.get('titulo')!.value;
    registroEducativo.nivelAcademicoCodigo =
      this.formulario.get('nivelFormacion')!.value;
    registroEducativo.institucion = this.formulario.get('entidad')!.value;
    registroEducativo.municipioCodigo = this.formulario.get('municipio')!.value;
    registroEducativo.fechaFin = this.formulario.get('fecha')!.value;
    registroEducativo.finalizado = this.formulario.get('obtenido')!.value;
    registroEducativo.estado = this.formulario.get('estado')!.value;
    if (this.editar) {
      this.actualizar(registroEducativo);
    } else {
      this.registrar(registroEducativo);
    }
  }

  registrar(registroEducativo: RegistroEducativo) {
    this.informacionAcademicaService
      .registrarEstudioRealizado(registroEducativo)
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

  actualizar(registroEducativo: RegistroEducativo) {
    this.informacionAcademicaService
      .actualizarEstudioRealizado(registroEducativo)
      .subscribe(
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

  editarRegistroEducativo(element: RegistroEducativo) {
    this.editar = true;
    this.formulario.get('codigo')!.setValue(element.codigo);
    this.formulario.get('personaCodigo')!.setValue(element.personaCodigo);
    this.formulario.get('titulo')!.setValue(element.titulo);
    this.formulario
      .get('nivelFormacion')!
      .setValue(element.nivelAcademicoCodigo);
    this.formulario.get('pais')!.setValue(element.paisCodigo);
    this.obtenerDepartamentos(element.paisCodigo);
    this.formulario.get('departamento')!.setValue(element.departamentoCodigo);
    this.obtenerMunicipios(element.departamentoCodigo);
    this.formulario.get('municipio')!.setValue(element.municipioCodigo);

    this.formulario.get('entidad')!.setValue(element.institucion);
    let fechaFin = new Date(element.fechaFin + ' 0:00:00');
    this.formulario.get('fecha')!.setValue(fechaFin);
    this.formulario.get('obtenido')!.setValue('' + element.finalizado);
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

//// MODAL IDIOMAS

@Component({
  selector: 'modal-idioma',
  templateUrl: 'modal-idioma.html',
  styleUrls: ['./informacion-academica.component.css'],
})
export class ModalIdioma {
  editar: boolean = false;

  formulario!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ModalIdioma>,
    public dialog: MatDialog,
    public authService: AuthService,
    public graduadoService: GraduadoService,
    private formBuilder: FormBuilder,
    public fotoService: FotoService,
    public informacionAcademicaService: InformacionAcademicaService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (this.authService.validacionToken()) {
      this.crearFormulario();
      if (JSON.stringify(data) !== 'null') {
        this.editarIdioma(data.idioma);
      }
    }
  }

  private crearFormulario(): void {
    this.formulario = this.formBuilder.group({
      codigo: new FormControl(''),
      personaCodigo: new FormControl(''),
      idioma: new FormControl('', Validators.required),
      conversacion: new FormControl('', Validators.required),
      escritura: new FormControl('', Validators.required),
      lectura: new FormControl('', Validators.required),
      estado: new FormControl(''),
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  generar(): void {
    let idioma: Idioma = new Idioma();
    idioma.codigo = this.formulario.get('codigo')!.value;
    idioma.personaCodigo = this.authService.user.personaCodigo;
    idioma.nombre = this.formulario.get('idioma')!.value;
    idioma.conversacionCodigo = this.formulario.get('conversacion')!.value;
    idioma.escrituraCodigo = this.formulario.get('escritura')!.value;
    idioma.lecturaCodigo = this.formulario.get('lectura')!.value;
    idioma.estado = this.formulario.get('estado')!.value;
    if (this.editar) {
      this.actualizar(idioma);
    } else {
      this.registrar(idioma);
    }
  }

  registrar(idioma: Idioma) {
    this.informacionAcademicaService.registrarIdioma(idioma).subscribe(
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

  actualizar(idioma: Idioma) {
    this.informacionAcademicaService.actualizarIdioma(idioma).subscribe(
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

  editarIdioma(element: Idioma) {
    this.editar = true;
    this.formulario.get('codigo')!.setValue(element.codigo);
    this.formulario.get('personaCodigo')!.setValue(element.personaCodigo);
    this.formulario.get('idioma')!.setValue(element.nombre);
    this.formulario
      .get('conversacion')!
      .setValue('' + element.conversacionCodigo);
    this.formulario.get('escritura')!.setValue('' + element.escrituraCodigo);
    this.formulario.get('lectura')!.setValue('' + element.lecturaCodigo);
    this.formulario.get('estado')!.setValue(element.estado);
  }

  cancelar() {
    this.formulario.reset();
    this.crearFormulario();
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

//// MODAL HABILIDADES INFORMATICAS

@Component({
  selector: 'modal-habilidad-informatica',
  templateUrl: 'modal-habilidad-informatica.html',
  styleUrls: ['./informacion-academica.component.css'],
})
export class ModalHabilidadInformatica {
  editar: boolean = false;

  formulario!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ModalHabilidadInformatica>,
    public dialog: MatDialog,
    public authService: AuthService,
    public graduadoService: GraduadoService,
    private formBuilder: FormBuilder,
    public fotoService: FotoService,
    public informacionAcademicaService: InformacionAcademicaService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (this.authService.validacionToken()) {
      this.crearFormulario();
      if (JSON.stringify(data) !== 'null') {
        this.editarHistorialLaboral(data.habilidadInformatica);
      }
    }
  }

  private crearFormulario(): void {
    this.formulario = this.formBuilder.group({
      codigo: new FormControl(''),
      personaCodigo: new FormControl(''),
      programa: new FormControl('', Validators.required),
      dominio: new FormControl('', Validators.required),
      estado: new FormControl(''),
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  generar(): void {
    let habilidadInformatica: HabilidadInformatica = new HabilidadInformatica();
    habilidadInformatica.codigo = this.formulario.get('codigo')!.value;
    habilidadInformatica.personaCodigo = this.authService.user.personaCodigo;
    habilidadInformatica.nombrePrograma =
      this.formulario.get('programa')!.value;
    habilidadInformatica.dominioCodigo = this.formulario.get('dominio')!.value;
    habilidadInformatica.estado = this.formulario.get('estado')!.value;
    if (this.editar) {
      this.actualizar(habilidadInformatica);
    } else {
      this.registrar(habilidadInformatica);
    }
  }

  registrar(habilidadInformatica: HabilidadInformatica) {
    this.informacionAcademicaService
      .registrarHabilidadInformatica(habilidadInformatica)
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

  actualizar(habilidadInformatica: HabilidadInformatica) {
    this.informacionAcademicaService
      .actualizarHabilidadInformatica(habilidadInformatica)
      .subscribe(
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

  editarHistorialLaboral(element: HabilidadInformatica) {
    this.editar = true;
    this.formulario.get('codigo')!.setValue(element.codigo);
    this.formulario.get('personaCodigo')!.setValue(element.personaCodigo);
    this.formulario.get('programa')!.setValue(element.nombrePrograma);
    this.formulario.get('dominio')!.setValue('' + element.dominioCodigo);
    this.formulario.get('estado')!.setValue(element.estado);
  }

  cancelar() {
    this.formulario.reset();
    this.crearFormulario();
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
