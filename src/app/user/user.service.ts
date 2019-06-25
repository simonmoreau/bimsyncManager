import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { throwError, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { IUser } from '../shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private user: IUser;
  private user$: Observable<IUser>;

  // url: string = 'https://bimsyncmanager.firebaseapp.com';
  url = 'http://localhost:4200';
  // client_id = '6E63g0C2zVOwlNm';
  clientId = 'hl94XJLXaQe3ogX';
  callbackUrl: string = this.url + '/callback';

  // private apiUrl = 'https://bimsyncfunction.azurewebsites.net/api';
  private apiUrl = 'https://bimsyncfunction-dev.azurewebsites.net/api';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Encode the callbackUrl
    this.callbackUrl = encodeURIComponent(this.callbackUrl);
    this.user$ = this.getUser();
  }

  get User(): Observable<IUser> {
    return this.user$;
  }

  private getUser(): Observable<IUser> {

    // Check if there is a user in memory
    if (this.user) {
      return this.RefreshToken(this.user);
    }

    // Check if there is a user in local storage
    const storedUser: IUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser != null) {
      this.user = storedUser;
      return this.RefreshToken(this.user);
    }

    return of(null);
  }

  private RefreshToken(user: IUser): Observable<IUser> {
    const now = new Date();
    const refresh = new Date(user.RefreshDate);
    if (refresh < now) {
      // We must refresh the token before using the user
      return this.RefreshTokenRequest(user);
    } else {
      return of(user);
    }
  }

  private RefreshTokenRequest(user: IUser): Observable<IUser> {
    return this.http.get<IUser>(
      this.apiUrl + '/manager/users/' + user.PowerBISecret,
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      });
  }

  CreateUser(authorizationCode: string) {
    this.createUserRequest(authorizationCode)
      .subscribe(user => {
        this.user = user;
        // Save to local storage
        localStorage.setItem('user', JSON.stringify(user));
        // Redirect to the home page
        this.router.navigate(['/projects']);
      },
        error => console.log(error));
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

  CreateBCFToken(authorizationCode: string) {
    this.createBCFTokenRequest(authorizationCode)
      .subscribe(user => {
        this.user = user;
        // Save to local storage
        localStorage.setItem('user', JSON.stringify(user));
        // Redirect to the home page
        this.router.navigate(['/projects']);
      },
        error => console.log(error));
  }

  private createBCFTokenRequest(authorizationCode: string): Observable<IUser> {
    return this.http.get<IUser>(
      this.apiUrl + '/manager/users/' + this.user.PowerBISecret + '/bcf',
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
