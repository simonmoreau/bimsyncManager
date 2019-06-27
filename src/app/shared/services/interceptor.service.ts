import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable, BehaviorSubject, of } from 'rxjs';
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
            switch ((error as HttpErrorResponse).status) {
              case 401:
                return this.handle401Error(request, next);
              default:
                return this.handleError(request, next);
            }
          } else {
            return Observable.throw(error);
          }
        })
      );
    }

  }

  addToken(request: HttpRequest<any>, user: IUser): HttpRequest<any> {

    return request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${user.AccessToken.access_token}`
      }
    });
  }

  handleError(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.logoutUser('aie');
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
