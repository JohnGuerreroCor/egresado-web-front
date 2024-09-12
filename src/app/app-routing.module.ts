import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { TokenComponent } from './components/token/token.component';
import { EncuestaEgresadoComponent } from './components/encuesta-egresado/encuesta-egresado.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { AuthGuard } from './guard/auth.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },

  { path: 'acceso-denegado', component: NotfoundComponent },

  { path: 'login', component: LoginComponent },
  { path: 'token', component: TokenComponent },

 /*  {
    path: 'encuesta-seguimiento',
    component: EncuestaEgresadoComponent,
    canActivate: [AuthGuard],
  }, */
  { path: 'encuesta-seguimiento', component: EncuestaEgresadoComponent },

  { path: '**', redirectTo: 'acceso-denegado' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      onSameUrlNavigation: 'reload',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
