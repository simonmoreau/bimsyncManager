import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { filter, take, switchMap, catchError, finalize } from 'rxjs/operators';

import { UserService } from 'src/app/user/user.service';
import { IUser } from '../models/user.model';



@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  isRefreshingToken = false;
  userSubject: BehaviorSubject<IUser> = new BehaviorSubject<IUser>(null);

  constructor(
    private userService: UserService,
    private router: Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (request.url.match(/api.bimsync.com\//)) {

      request = this.addToken(request, this.userService.currentUserValue);

      return next.handle(request).pipe(
        catchError(error => {
          if (error instanceof HttpErrorResponse) {
            const err: HttpErrorResponse = error as HttpErrorResponse;
            switch (err.status) {
              case 401:
                return this.handle401Error(request, next);
              default:
                console.log(error);
                return this.handleError(request, next, err);
            }
          } else {
            return Observable.throw(error);
          }
        })
      );
    } else {
      return next.handle(request);
    }

  }

  addToken(request: HttpRequest<any>, user: IUser): HttpRequest<any> {

    return request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${user.AccessToken.access_token}`
      }
    });
  }

  private handleError(request: HttpRequest<any>, next: HttpHandler, err: HttpErrorResponse): Observable<HttpEvent<any>> {

    // return this.logoutUser('aie');

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

  handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshingToken) {
      this.isRefreshingToken = true;

      // Reset here so that the following requests wait until the token
      // comes back from the refreshToken call.
      this.userSubject.next(null);

      return this.userService.refreshToken().pipe(
        switchMap((newUser: IUser) => {
          if (newUser) {
            this.userSubject.next(newUser);
            return next.handle(this.addToken(request, newUser));
          }

          // If we don't get a new token, we are in trouble so logout.
          return this.logoutUser('ouch');
        }),
        catchError(error => {
          // If there is an exception calling 'refreshToken', bad news so logout.
          return this.logoutUser(error);
        }),
        finalize(() => {
          this.isRefreshingToken = false;
        })
      );
    } else {
      return this.userSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(token => {
          return next.handle(this.addToken(request, token));
        })
      );
    }
  }

  logoutUser(error: any) {
    // Route to the login page (implementation up to you)
    // this.userService.Logout();
    // this.router.navigate(['/home']);

    return of(error);

  }
}
