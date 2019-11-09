import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainRoutingModule } from './main.routing.module';
import { SharedModule } from '../shared/shared.module';
import { MainContentComponent } from './main-content/main-content.component';
import { StatusTabsComponent } from './main-content/status-tabs/status-tabs.component';
import { TableComponent } from './main-content/status-tabs/table/table.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { AddDialogComponent } from './add-dialog/add-dialog.component';
import { CardsComponent } from './main-content/status-tabs/cards/cards.component';
import { CardComponent } from './main-content/status-tabs/cards/card/card.component';
import { InfoComponent } from './info/info.component';
import { BarRatingModule } from 'ngx-bar-rating';
import { CommentsComponent } from './info/comments/comments.component';
import { WindowResizeService } from '../shared/services/windowResize.service';

@NgModule({
  imports: [
    CommonModule,
    MainRoutingModule,
    SharedModule,
    BarRatingModule
  ],
  declarations: [
    MainContentComponent,
    StatusTabsComponent,
    TableComponent,
    AddDialogComponent,
    ConfirmDialogComponent,
    CardsComponent,
    CardComponent,
    InfoComponent,
    CommentsComponent
  ],
  entryComponents: [
    AddDialogComponent,
    ConfirmDialogComponent
  ],
  providers: [WindowResizeService]
})
export class MainModule { }
