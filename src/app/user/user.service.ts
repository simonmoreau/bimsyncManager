import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { throwError, Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { IUser } from '../shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private currentUserSubject: BehaviorSubject<IUser>;
  public currentUser: Observable<IUser>;

  // url: string = 'https://bimsyncmanager.firebaseapp.com';
  url = 'http://localhost:4200';
  // client_id = '6E63g0C2zVOwlNm';
  clientId = 'hl94XJLXaQe3ogX';
  callbackUrl: string = this.url + '/callback';

  // private apiUrl = 'https://bimsyncfunction.azurewebsites.net/api';
  private apiUrl = 'https://bimsyncfunction-dev.azurewebsites.net/api';

  constructor(
    private http: HttpClient
  ) {
    // Encode the callbackUrl
    this.callbackUrl = encodeURIComponent(this.callbackUrl);
    this.currentUserSubject = new BehaviorSubject<IUser>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): IUser {
    this.RefreshToken();
    return this.currentUserSubject.value;
  }


  private RefreshToken(): Observable<IUser> {
    const now = new Date();
    const refresh = new Date(this.currentUserSubject.value.RefreshDate);
    if (refresh < now) {
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
      RedirectURI: this.callbackUrl
    };

    return this.http.post<IUser>(
      this.apiUrl + '/manager/users', JSON.stringify(body),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/json')
      }).pipe(
        tap(data => console.log('All: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
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
      }).pipe(
        tap(data => console.log('All: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  private handleError(err: HttpErrorResponse) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage = '';
    if (err.error instanceof Error) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}
