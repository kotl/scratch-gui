import { Input, Output, SimpleChange, Component, OnInit, OnChanges } from '@angular/core';
import { API_BASE } from '../constants';
import { ProjectInfo, User, LoginState,LoginResult, ApiClient } from '../api.client';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PwddialogComponent } from '../pwddialog/pwddialog.component';
import { WarningComponent } from '../warning/warning.component';

import { concatMap } from 'rxjs/operators';

import { of } from 'rxjs';
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
  users: User[] = [];
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
    this.apiClient.getUsers().subscribe(
      (result) => {
        this.users = result.users;
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
        onDialogResult: (res) => {
          if (res) {
            this.deleteUser(user);
          }
        }
      },
      panelClass: 'custom-dialog-container',
    });
  }

  deleteUser(user: User) {
    this.apiClient.deleteUserAndProjects(user.username).subscribe(
      (res: LoginResult) => {
        this.result = res;
        this.getUsers();
      });
  }

  deleteAll() {
    of(...this.selectedUsers).pipe(
      concatMap(
        (val) => this.apiClient.deleteUserAndProjects(val.username)
      )).subscribe((res) => { this.result = res; }, undefined, () => {
        this.getUsers();
      });
  }

  onDeleteAll() {
    const dialogRef = this.dialog.open(WarningComponent, {
      data: {
        accept: 'Ok',
        cancel: 'Cancel',
        title: 'Are you sure?',
        label: `You will be deleting all selected users and all their projects`,
        onDialogResult: (res) => {
          if (res) {
            this.deleteAll();
          }
        }
      },
      panelClass: 'custom-dialog-container',
    });
  }

  set result(value: LoginResult) {
    this.state = value.state;
    this.error = value.error;
  }

  get selectedCount() {
    return this.users.filter(
      (user) => (user.checked)).length;
  }

  get selectedUsers() {
    return this.users.filter((user) => (user.checked));
  }

  onCopyToAdmin(user: User) {
    this.apiClient.copyProjects(user.username).subscribe(
      (res: LoginResult) => {
        // Show toast?
        this.result = res;
        this.getUsers();
      }
    );
  }

  onCopyAllToAdmin() {
   of(...this.selectedUsers).pipe(
      concatMap(
        (val) => this.apiClient.copyProjects(val.username)
      )).subscribe((res) => { this.result = res; }, undefined, () => {
        this.getUsers();
      });
  }

}
