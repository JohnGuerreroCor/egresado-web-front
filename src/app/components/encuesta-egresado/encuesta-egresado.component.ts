import { Component } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-encuesta-egresado',
  templateUrl: './encuesta-egresado.component.html',
  styleUrls: ['./encuesta-egresado.component.css'],
})
export class EncuestaEgresadoComponent {
  constructor() {
    Swal.fire({
      icon: 'warning',
      title: 'Importante',
      html: 'Por favor, complete o actualice toda la información necesaria para garantizar el <b>registro como egresado</b> y poder generar la <b>liquidación de derechos de grado</b>. Diligencie o actualice los campos de cada una de las pestañas de la parte superior: <br><br> <b>Datos personales</b><br><b>Información académica</b><br><b>Experiencia laboral</b><br><b>Perfil profesional</b>',
      showConfirmButton: true,
      confirmButtonText: 'Listo',
      confirmButtonColor: '#8f141b',

    });
  }
}
