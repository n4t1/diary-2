import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AddDialogComponent } from '../add-dialog/add-dialog.component';
import { AngularFirestoreDbService } from 'src/app/shared/services/angular-firestore-db.service';

@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss']
})
export class MainContentComponent implements OnInit {

  constructor(
    private dialog: MatDialog
    ) { }

  ngOnInit() {}

  openDialog(): void {
    this.dialog.open(AddDialogComponent, {
      width: '410px',
      disableClose: false
    });
  }

}
