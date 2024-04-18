import { Component, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { Graduado } from 'src/app/models/graduado';
import { GraduadoService } from 'src/app/services/graduado.service';
import { FotoService } from 'src/app/services/foto.service';
import { FotoAntigua } from 'src/app/models/foto-antigua';
import { DatePipe } from '@angular/common';
import { UbicacionService } from 'src/app/services/ubicacion.service';
import { Pais } from 'src/app/models/pais';
import { Municipio } from 'src/app/models/municipio';
import { Departamento } from 'src/app/models/departamento';
import { DatosPersonalesService } from 'src/app/services/datos-personales.service';
import { DatosPersonales } from 'src/app/models/datos-personales';
import { SoporteExpedicionService } from 'src/app/services/soporte-expedicion.service';
import { InformacionAcademicaService } from 'src/app/services/informacion-academica.service';
import { HabilidadInformatica } from 'src/app/models/habilidad-informatica';
import { RegistroEducativo } from 'src/app/models/registro-educativo';
import { HistorialLaboral } from 'src/app/models/historial-laboral';
import { HistorialLaboralService } from 'src/app/services/historial-laboral.service';
import { DatosComplementarios } from 'src/app/models/datos-complementarios';
import { Idioma } from 'src/app/models/idioma';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-curriculum',
  templateUrl: './curriculum.component.html',
  styleUrls: ['./curriculum.component.css'],
})
export class CurriculumComponent {
  listadoDatosPersonales: DatosPersonales[] = [];
  graduado: Graduado[] = [];

  listadoPaisesResidencia: Pais[] = [];
  listadoDepartamentosResidencia: Departamento[] = [];
  listadoMunicipiosResidencia: Municipio[] = [];
  datosComplementarios: DatosComplementarios[] = [];
  listadoHabilidadInformatica: HabilidadInformatica[] = [];
  listadoRegistroEducativo: RegistroEducativo[] = [];
  listadoIdioma: Idioma[] = [];
  listadoHistorialLaboral: HistorialLaboral[] = [];

  identificacion: string = '';

  formDatosPersonales!: FormGroup;

  cargaFoto: boolean = false;

  nombreFoto = 'Seleccione la foto a cargar...';

  file!: FileList;

  foto: FotoAntigua = {
    url: '',
  };

  dataSource = new MatTableDataSource<Graduado>([]);
  displayedColumns: string[] = [
    'index',
    'codigo',
    'programa',
    'nivelAcademico',
    'sede',
    'fechaGrado',
  ];
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  dialogRef!: MatDialogRef<any>;

  constructor(
    public authService: AuthService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public graduadoService: GraduadoService,
    public fotoService: FotoService,
    public ubicacionService: UbicacionService,
    public datosPersonalesService: DatosPersonalesService,
    public soporteExpedicionService: SoporteExpedicionService,
    public informacionAcademicaService: InformacionAcademicaService,
    public historialLaboralService: HistorialLaboralService,
    private datePipe: DatePipe
  ) {
    this.graduado = [];
    this.foto.url = '';
    this.dataSource = new MatTableDataSource<Graduado>([]);
    this.crearFormularioDatosPersonales();
    this.datosPersonales();
    this.obtenerDatosComplementarios();
    this.informacionAcademicaService
      .obtenerHabilidadesInformaticas(
        this.authService.user.personaIdentificacion
      )
      .subscribe((data) => {
        this.listadoHabilidadInformatica = data;
      });
    this.informacionAcademicaService
      .obtenerIdiomas(this.authService.user.personaIdentificacion)
      .subscribe((data) => {
        this.listadoIdioma = data;
      });
    this.informacionAcademicaService
      .obtenerRegistroEducativo(this.authService.user.personaIdentificacion)
      .subscribe((data) => {
        this.listadoRegistroEducativo = data;
      });
    this.historialLaboralService
      .obtenerHistorialLaboral(this.authService.user.personaIdentificacion)
      .subscribe((data) => {
        this.listadoHistorialLaboral = data;
      });
  }

  private crearFormularioDatosPersonales(): void {
    this.formDatosPersonales = this.formBuilder.group({
      codigo: new FormControl(''),
      identificacionTipo: new FormControl('', Validators.required),
      identificacion: new FormControl('', Validators.required),
      identificacionFechaExpedicion: new FormControl('', Validators.required),
      paisExpedicion: new FormControl('', Validators.required),
      departamentoExpedicion: new FormControl('', Validators.required),
      municipioExpedicion: new FormControl('', Validators.required),
      apellido: new FormControl('', Validators.required),
      nombre: new FormControl('', Validators.required),
      genero: new FormControl('', Validators.required),
      estadoCivil: new FormControl('', Validators.required),
      grupoSanguineo: new FormControl('', Validators.required),
      fechaNacimiento: new FormControl('', Validators.required),
      paisNacimiento: new FormControl('', Validators.required),
      departamentoNacimiento: new FormControl('', Validators.required),
      municipioNacimiento: new FormControl('', Validators.required),
      emailPersonal: new FormControl('', Validators.required),
      paginaWeb: new FormControl('', Validators.required),
      telefonoFijo: new FormControl('', Validators.required),
      telefonoMovil: new FormControl('', Validators.required),
      paisResidencia: new FormControl('', Validators.required),
      departamentoResidencia: new FormControl('', Validators.required),
      municipioResidencia: new FormControl('', Validators.required),
      barrio: new FormControl('', Validators.required),
      direccion: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {}

  onModalClosed() {
    this.datosPersonales();
  }

  obtenerDatosComplementarios() {
    this.informacionAcademicaService
      .obtenerDatosComplementarios(this.authService.user.username.slice(1))
      .subscribe((data) => {
        this.datosComplementarios = data;
      });
  }

  datosPersonales() {
    this.datosPersonalesService
      .obtenerDatosPersonales(this.authService.user.personaIdentificacion)
      .subscribe((data) => {
        this.listadoDatosPersonales = data;
        this.precargaGraduado();
        this.mostrarFoto('' + this.listadoDatosPersonales[0].codigo);
      });
  }

  obtenerDepartamentosResidencia(codigo: number) {
    this.ubicacionService
      .obtenerDepartamentosPorPais(codigo)
      .subscribe((data) => {
        this.listadoDepartamentosResidencia = data;
      });
  }

  obtenerMunicipiosResidencia(codigo: number) {
    this.ubicacionService
      .obtenerMunicipiosPorDepartamento(codigo)
      .subscribe((data) => {
        this.listadoMunicipiosResidencia = data;
      });
  }

  buscarGraduado(id: string) {
    this.graduadoService.obtenerGraduado(id).subscribe((data) => {
      if (JSON.stringify(data) !== '[]') {
        this.graduado = data;
      } else {
        this.graduado = [];
        Swal.fire({
          icon: 'warning',
          title: 'No existe',
          text: 'La cédula digitada no encontró ningún Graduado asociado, por favor rectifique el documento.',
          showConfirmButton: true,
          confirmButtonText: 'Listo',
          confirmButtonColor: '#8f141b',
        });
      }
    });
  }

  precargaGraduado(): void {
    this.formDatosPersonales
      .get('codigo')!
      .setValue(this.listadoDatosPersonales[0].codigo);
    this.formDatosPersonales
      .get('identificacionTipo')!
      .setValue(this.listadoDatosPersonales[0].identificacionTipo);
    this.formDatosPersonales
      .get('identificacion')!
      .setValue(this.listadoDatosPersonales[0].identificacion);
    this.formDatosPersonales
      .get('identificacionFechaExpedicion')!
      .setValue(
        this.datePipe.transform(
          this.listadoDatosPersonales[0].identificacionFechaExpedicion,
          'dd/MM/yyyy'
        )
      );
    this.formDatosPersonales
      .get('paisExpedicion')!
      .setValue(this.listadoDatosPersonales[0].paisExpedicion);
    this.formDatosPersonales
      .get('departamentoExpedicion')!
      .setValue(this.listadoDatosPersonales[0].departamentoExpedicion);
    this.formDatosPersonales
      .get('municipioExpedicion')!
      .setValue(this.listadoDatosPersonales[0].municipioExpedicion);
    this.formDatosPersonales
      .get('apellido')!
      .setValue(this.listadoDatosPersonales[0].apellido);
    this.formDatosPersonales
      .get('nombre')!
      .setValue(this.listadoDatosPersonales[0].nombre);
    this.formDatosPersonales
      .get('genero')!
      .setValue(this.listadoDatosPersonales[0].genero);
    this.formDatosPersonales
      .get('estadoCivil')!
      .setValue(this.listadoDatosPersonales[0].estadoCivil);
    this.formDatosPersonales
      .get('grupoSanguineo')!
      .setValue(this.listadoDatosPersonales[0].grupoSanguineo);
    this.formDatosPersonales
      .get('fechaNacimiento')!
      .setValue(
        this.datePipe.transform(
          this.listadoDatosPersonales[0].fechaNacimiento,
          'dd/MM/yyyy'
        )
      );
    this.formDatosPersonales
      .get('paisNacimiento')!
      .setValue(this.listadoDatosPersonales[0].paisNacimiento);
    this.formDatosPersonales
      .get('departamentoNacimiento')!
      .setValue(this.listadoDatosPersonales[0].departamentoNacimiento);
    this.formDatosPersonales
      .get('municipioNacimiento')!
      .setValue(this.listadoDatosPersonales[0].municipioNacimiento);
    this.formDatosPersonales
      .get('emailPersonal')!
      .setValue(this.listadoDatosPersonales[0].emailPersonal);
    this.formDatosPersonales
      .get('paginaWeb')!
      .setValue(this.listadoDatosPersonales[0].paginaWeb);
    this.formDatosPersonales
      .get('telefonoFijo')!
      .setValue(this.listadoDatosPersonales[0].telefonoFijo);
    this.formDatosPersonales
      .get('telefonoMovil')!
      .setValue(this.listadoDatosPersonales[0].telefonoMovil);
    this.formDatosPersonales
      .get('paisResidencia')!
      .setValue(this.listadoDatosPersonales[0].paisResidencia);
    this.formDatosPersonales
      .get('departamentoResidencia')!
      .setValue(this.listadoDatosPersonales[0].departamentoResidencia);
    this.formDatosPersonales
      .get('municipioResidencia')!
      .setValue(this.listadoDatosPersonales[0].municipioResidencia);
    this.formDatosPersonales
      .get('barrio')!
      .setValue(this.listadoDatosPersonales[0].barrio);
    this.formDatosPersonales
      .get('direccion')!
      .setValue(this.listadoDatosPersonales[0].direccion);
  }

  loadToken() {
    this.activatedRoute.params.subscribe((params) => {
      let key = params['id'];
    });
  }

  subirFoto() {
    let file: any = this.file;
    const foto = new File([file], this.graduado[0].persona.codigo + '.png', {
      type: file.type,
    });
    this.fotoService.subirFoto(foto).subscribe((data) => {
      this.cargaFoto = false;
      this.mensajeRealizado();
    });
  }

  change(file: any): void {
    this.nombreFoto = file.target.files[0].name.replace(/\s/g, '');
    const foto: any = (event?.target as HTMLInputElement)?.files?.[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.foto.url = reader.result as string;
    };
    reader.readAsDataURL(foto);
    if (file.target.files[0].size > 8100000) {
      Swal.fire({
        title: 'El archivo supera el limite de tamaño que es de 8mb',
        confirmButtonText: 'Entiendo',
        confirmButtonColor: '#8f141b',
        showConfirmButton: true,
      });
    } else {
      this.file = file.target.files[0];
      this.cargaFoto = true;
      Swal.fire({
        icon: 'success',
        title: 'Foto cargada, recuerde guardar los cambios realizados.',
        showConfirmButton: true,
        confirmButtonText: 'Listo',
        confirmButtonColor: '#8f141b',
      });
    }
  }

  mostrarFoto(perCodigo: String) {
    this.fotoService.mirarFoto(perCodigo).subscribe((data) => {
      var gg = new Blob([data], { type: 'application/json' });
      if (gg.size !== 4) {
        var blob = new Blob([data], { type: 'image/png' });
        const foto = blob;
        const reader = new FileReader();
        reader.onload = () => {
          this.foto.url = reader.result as string;
        };
        reader.readAsDataURL(foto);
      } else {
        this.fotoService.mirarFotoAntigua('' + perCodigo).subscribe((data) => {
          this.foto = data;
        });
      }
    });
  }

  mostrarArchivo() {
    this.soporteExpedicionService
      .mirarSoporte(+this.listadoDatosPersonales[0].urlAnexoExpedicion)
      .subscribe((data) => {
        var blob = new Blob([data], { type: 'application/pdf' });
        var fileURL = URL.createObjectURL(blob);
        window.open(fileURL);
      });
  }

  mensajeRealizado() {
    Swal.fire({
      icon: 'success',
      title: 'Proceso Realizado',
      showConfirmButton: false,
      timer: 1500,
    });
  }
}
