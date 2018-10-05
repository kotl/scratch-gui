import {Input, Output , SimpleChange, Component, OnInit, OnChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {API_BASE} from '../constants';
import { LoginState, ApiClient } from '../api.client';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { PwddialogComponent } from '../pwddialog/pwddialog.component';

export interface User {
  username: string;
  id: number;
  projects: ProjectInfo[];
  checked?: boolean;
}

export interface ProjectInfo {
    title: string;
    projectId: number;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, OnChanges {
  @Output() error = '';
  @Input()
  state: LoginState = 'NOT_LOGGED_IN';
  @Output()
  users: User[];
  constructor(private http: HttpClient,
    private dialog: MatDialog) { }

  ngOnInit() {
  }

  selectAll() {
    this.users.forEach(
      (user) => {
        if (user.username !== 'admin') {
          user.checked = !user.checked;
        }
      }
    );
  }

  ngOnChanges(change: { state: SimpleChange }) {
    if (change.state.firstChange && change.state.currentValue === 'LOGGED_IN') {
      this.getUsers();
    }
  }
  getUsers() {
    this.http.post(API_BASE + '/users', {})
      .subscribe((data: any) => {
          this.users = data.users;
          this.error = '';
      }, (error) => {
        this.error = error.error;
      });

  }

  onBrowseProjects(user: User) {
    // TODO: make component for browsing projects
  }

  onChangePassword(user: User) {
    const dialogRef = this.dialog.open(PwddialogComponent, {
      data: {username: user.username},
       panelClass: 'custom-dialog-container',
    });
  }

  onDelete(user: User) {
    // TODO: make service method for deletion and call it
  }

}
