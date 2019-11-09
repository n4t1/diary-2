import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {

  result = {
    isOK: false,
    id: ''
  };

  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.result.isOK = false;
    this.dialogRef.close(this.result);
  }

  confirm() {
    this.result.isOK = true;
    this.result.id = this.data.id;

    this.dialogRef.close(this.result);
  }

}
