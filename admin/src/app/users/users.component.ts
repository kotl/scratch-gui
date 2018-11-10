import { Input, Output, SimpleChange, Component, OnInit, OnChanges } from '@angular/core';
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
        this.users = result.users.sort( (a, b) => {
          if (a.username === 'admin') { return -1; }
          if (b.username === 'admin') { return 1; }
          return a.username.localeCompare(b.username);
        });
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

  onDeleteProjects(user: User) {
    const dialogRef = this.dialog.open(WarningComponent, {
      data: {
        accept: 'Ok',
        cancel: 'Cancel',
        title: 'Are you sure?',
        label: `You will be deleting all projects of ${user.username}`,
        onDialogResult: (res) => {
          if (res) {
            this.deleteAll([user], false);
          }
        }
      },
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
            this.deleteAll([user], true);
          }
        }
      },
      panelClass: 'custom-dialog-container',
    });
  }


  deleteAll(users: User[], deleteUserAsWell: boolean) {
    of(...users).pipe(
      concatMap(
        (user) => {
          const values: Array<ProjectInfo|null> = user.projects;
          if (!!deleteUserAsWell) {
            values.push(null);
          }
          return of(...values).pipe(
            concatMap(
              (project) => {
                if (!!project && !!project.projectId) {
                  return this.apiClient.deleteProject(user.username,
                    project.projectId);
                } else {
                  return this.apiClient.deleteUser(user.username);
                }
              }
            )
          );
        }
      )).subscribe((res) => {
        this.result = res;
      }, undefined, () => {
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
            this.deleteAll(this.selectedUsers, true);
          }
        }
      },
      panelClass: 'custom-dialog-container',
    });
  }

  onDeleteProjectsOfSelected() {
    const dialogRef = this.dialog.open(WarningComponent, {
      data: {
        accept: 'Ok',
        cancel: 'Cancel',
        title: 'Are you sure?',
        label: `You will be deleting all projects of selected users`,
        onDialogResult: (res) => {
          if (res) {
            this.deleteAll(this.selectedUsers, false);
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
    this.copyAllToAdmin([user]);
  }

  onCopyAllToAdmin() {
    this.copyAllToAdmin(this.selectedUsers);
  }

  copyAllToAdmin(users: User[]) {
   of(...users).pipe(
      concatMap(
        (val) => this.apiClient.copyProjects(val.username, val.projects.map(p => p.projectId))
      )).subscribe((results) => {
        results.filter((res) => !!res.error).forEach(
          (res => {
            this.result = res;
          }));
      }, undefined, () => {
        this.getUsers();
      });
  }

}
