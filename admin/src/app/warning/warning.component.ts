import { EventEmitter, Input, Inject, Output, Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-warning',
  templateUrl: './warning.component.html',
  styleUrls: ['./warning.component.css']
})
export class WarningComponent implements OnInit {
  @Input() accept = 'Ok';
  @Input() cancel = 'Cancel';
  @Input() title = 'Warning';
  @Input() label = 'Shall we proceed';
  @Input() onDialogResult: Function;

  constructor(public dialogRef: MatDialogRef<WarningComponent>,
    @Inject(MAT_DIALOG_DATA) data: any) {
      this.accept = data.accept;
      this.cancel = data.cancel;
      this.title = data.title;
      this.label = data.label;
      this.onDialogResult = data.onDialogResult;
  }

  ngOnInit() {
  }

  onAccept() {
    this.dialogRef.close();
    this.onDialogResult(true);
  }

  onCancel() {
    this.dialogRef.close();
    this.onDialogResult(false);
  }

}
