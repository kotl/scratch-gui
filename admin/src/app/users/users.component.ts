import { Input, Output, SimpleChange, Component, OnInit, OnChanges } from '@angular/core';
import { API_BASE } from '../constants';
import { ProjectInfo, User, LoginState, ApiClient } from '../api.client';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PwddialogComponent } from '../pwddialog/pwddialog.component';
import { WarningComponent } from '../warning/warning.component';



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
      data: { username: user.username },
      panelClass: 'custom-dialog-container',
    });
  }

  onDelete(user: User) {
    const dialogRef = this.dialog.open(WarningComponent, {
      data: {
        accept: 'Ok',
        cancel: 'Cancel',
        title: 'Are you sure?',
        label: `You will be deleting user ${user.username} and all their projects`,
        onDialogResult: (res)  => {
          if (res) {
            this.deleteUser(user);
          }
        }
      },
      panelClass: 'custom-dialog-container',
    });
  }

  deleteUser(user: User) {
    this.apiClient.deleteUserAndProjects(user.username).then(
      () => {
        this.getUsers();
      });
  }

}
