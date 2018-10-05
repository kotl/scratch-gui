import { HttpClient } from '@angular/common/http';
import { InjectionToken, Injectable } from '@angular/core';
import {API_BASE} from './constants';

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

  login(password: string): Promise<LoginResult> {
    const req = {
      username: 'admin',
      password: password,
    };
    return new Promise( (resolve, reject) => {
        this.http.post(API_BASE + '/login', req)
        .subscribe(() => {
            if (password === 'admin') {
              this.loggedIn = 'PASSWORD_CHANGE_NEEDED';
              resolve({ state: this.loggedIn });
            } else {
              this.loggedIn = 'LOGGED_IN';
              resolve({ state: this.loggedIn });
            }
        }, (error) => {
          this.loggedIn = 'NOT_LOGGED_IN';
          resolve({ state: this.loggedIn, error: error.error });
        });


      });
  }

  changePassword(username: string, newPassword: string): Promise<LoginResult> {
    const req = {
      username: username,
      password: newPassword,
    };

    return new Promise((resolve, reject) => {
    this.http.post(API_BASE + '/changepwd', req)
      .subscribe((data: any) => {
        this.loggedIn = 'LOGGED_IN';
        resolve({ state: this.loggedIn });
      }, (error) => {
        this.loggedIn = 'NOT_LOGGED_IN';
        resolve({ state: this.loggedIn, error: error.error });
    });
    });
  }

  get isLoggedIn() {
    return this.loggedIn;
  }

}
