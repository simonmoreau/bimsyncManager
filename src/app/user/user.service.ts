import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';

import { throwError, Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { IUser } from '../shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private currentUserSubject: BehaviorSubject<IUser>;
  public currentUser: Observable<IUser>;

  // url: string = 'https://bimsyncmanager.firebaseapp.com';
  uri = 'http://localhost:4200';
  // client_id = '6E63g0C2zVOwlNm';
  clientId = 'hl94XJLXaQe3ogX';
  redirectUri: string = this.uri + '/callback';

  // private apiUrl = 'https://bimsyncfunction.azurewebsites.net/api';
  private apiUrl = 'https://bimsyncfunction-dev.azurewebsites.net/api';

  constructor(
    private http: HttpClient
  ) {
    // Encode the callbackUrl
    this.redirectUri = encodeURIComponent(this.redirectUri);
    this.currentUserSubject = new BehaviorSubject<IUser>(
      JSON.parse(localStorage.getItem('currentUser'))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): IUser {
    return this.currentUserSubject.value;
  }


  public refreshToken(): Observable<IUser> {

    // We must refresh the token before using the user
    return this.RefreshTokenRequest()
      .pipe(map(user => {
        // login successful if there's a jwt token in the response
        if (user && user.AccessToken) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }
        return user;
      }));
  }

  private RefreshTokenRequest(): Observable<IUser> {
    return this.http.get<IUser>(
      this.apiUrl + '/manager/users/' + this.currentUserSubject.value.PowerBISecret,
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      });
  }

  Login(authorizationCode: string): Observable<IUser> {
    return this.createUserRequest(authorizationCode)
      .pipe(map(user => {
        // login successful if there's a jwt token in the response
        if (user && user.AccessToken) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }
        return user;
      }));
  }

  Logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  private createUserRequest(authorizationCode: string): Observable<IUser> {

    const body = {
      AuthorizationCode: authorizationCode,
      RedirectURI: this.redirectUri
    };

    return this.http.post<IUser>(
      this.apiUrl + '/manager/users', JSON.stringify(body),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/json')
      });
  }

  CreateBCFToken(authorizationCode: string): Observable<IUser> {
    return this.createBCFTokenRequest(authorizationCode)
      .pipe(map(user => {
        // login successful if there's a jwt token in the response
        if (user && user.BCFToken) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }
        return user;
      }));
  }

  private createBCFTokenRequest(authorizationCode: string): Observable<IUser> {
    return this.http.get<IUser>(
      this.apiUrl + '/manager/users/' + this.currentUserSubject.value.PowerBISecret + '/bcf',
      {
        params: new HttpParams().set('code', authorizationCode),
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      });
  }

}
