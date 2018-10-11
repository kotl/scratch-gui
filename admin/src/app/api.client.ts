import { HttpClient } from '@angular/common/http';
import { InjectionToken, Injectable } from '@angular/core';
import {API_BASE} from './constants';
import { of, Observable} from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { combineAll, combineLatest, concatMap,flatMap, mergeMap } from 'rxjs/operators';

export interface ProjectInfo {
  title: string;
  projectId: number;
}

export interface User {
  username: string;
  id: number;
  projects: ProjectInfo[];
  checked?: boolean;
}

export type LoginState =
  'NOT_LOGGED_IN'|
  'PASSWORD_CHANGE_NEEDED'|
  'LOGGED_IN';

export interface LoginResult {
  state: LoginState;
  error?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ApiClient {
  private loggedIn: LoginState = 'NOT_LOGGED_IN';
  constructor(private http: HttpClient) {}

  login(password: string): Observable<LoginResult> {
    const req = {
      username: 'admin',
      password: password,
    };
    return this.http.post<LoginResult>(API_BASE + '/login', req)
        .pipe(map((res) => {
            if (password === 'admin') {
              this.loggedIn = 'PASSWORD_CHANGE_NEEDED';
              return { state: this.loggedIn } as LoginResult;
            } else {
              this.loggedIn = 'LOGGED_IN';
              return { state: this.loggedIn } as LoginResult;
            }
        }),
        catchError((error, caught) => {
          this.loggedIn = 'NOT_LOGGED_IN';
          return of({ state: this.loggedIn, error: error.error } as LoginResult);
        }));
  }

  changePassword(username: string, newPassword: string): Observable<LoginResult> {
    return this.http.post<LoginResult>(API_BASE + '/changepwd', {
      username,
      password: newPassword,
    }).pipe(...this.result);
  }

  deleteUser(username: string): Observable<LoginResult> {
    return this.http.post<LoginResult>(API_BASE + '/deleteUser', {
      username }).pipe(...this.result);
  }

  deleteProject(username: string, projectId: number): Observable<LoginResult> {
    return this.http.post<LoginResult>(API_BASE + '/deleteProject', {
      username, projectId }).pipe(...this.result);
  }


  copyProjects(username: string, projects: number[]): Observable<LoginResult[]> {
    return of(...projects).pipe(
      concatMap((projectId) => {
        return this.http.post<LoginResult>(API_BASE + '/copyProject', {
            username, projectId}).pipe(...this.result);
      }
      )).pipe(combineLatest());
  }

  getUsers() {
    return this.http.post<{ users: User[] }>(API_BASE + '/users', {});
  }

  get isLoggedIn() {
    return this.loggedIn;
  }

  get result() {
    return [map((data) => {
      return { state: 'LOGGED_IN' } as LoginResult;
    }),
      catchError((error, caught) => {
        this.loggedIn = 'NOT_LOGGED_IN';
        return of({ state: this.loggedIn, error: error.error } as LoginResult);
      })];
  }
}
