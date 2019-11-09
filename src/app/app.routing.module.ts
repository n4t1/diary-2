import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthModule } from './auth/auth.module';
import { MainModule } from './main/main.module';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'main',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'main',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    AuthModule,
    MainModule,
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
