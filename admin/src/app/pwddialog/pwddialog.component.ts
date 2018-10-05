import {Inject, Output, Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-pwddialog',
  templateUrl: './pwddialog.component.html',
  styleUrls: ['./pwddialog.component.css']
})
export class PwddialogComponent implements OnInit {
  @Output() username = '';

  constructor(public dialogRef: MatDialogRef<PwddialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: any) {
      this.username = data.username;
  }

  ngOnInit() {
  }

  onPasswordChanged() {
    this.dialogRef.close();
  }
}
