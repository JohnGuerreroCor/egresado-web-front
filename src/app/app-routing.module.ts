import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { TokenComponent } from './components/token/token.component';
import { EncuestaEgresadoComponent } from './components/encuesta-egresado/encuesta-egresado.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'token', component: TokenComponent },

  { path: 'encuesta-seguimiento', component: EncuestaEgresadoComponent },

  { path: '', pathMatch: 'full', redirectTo: '/login' },
  { path: '**', pathMatch: 'full', redirectTo: '/login' },
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
