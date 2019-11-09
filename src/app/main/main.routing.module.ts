import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainContentComponent } from './main-content/main-content.component';
import { AuthGuardService } from '../shared/services/auth-guard.service';
import { InfoComponent } from './info/info.component';
import { InfoParamEnum } from '../shared/models/enums';

const mainRoutes: Routes = [
  {
    path: 'main',
    component: MainContentComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'info/:' + InfoParamEnum.TYPE + '/:' + InfoParamEnum.ID,
    component: InfoComponent,
    canActivate: [AuthGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forChild(mainRoutes)],
  exports: [RouterModule]
})
export class MainRoutingModule {}
