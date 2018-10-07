import {Input, Output , SimpleChange, Component, OnInit, OnChanges } from '@angular/core';
import {API_BASE} from '../constants';
import { ProjectInfo, User, LoginState, ApiClient } from '../api.client';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { PwddialogComponent } from '../pwddialog/pwddialog.component';



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
  constructor(
    private apiClient: ApiClient,
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
    this.apiClient.getUsers().then(
      (users) => {
        this.users = users;
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
    this.apiClient.deleteUserAndProjects(user.username).then(
      () => {
        this.getUsers();
      });
  }

}
