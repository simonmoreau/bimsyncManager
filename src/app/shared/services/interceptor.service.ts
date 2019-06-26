import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/user/user.service';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor(public userService: UserService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (request.url.match(/api.bimsync.com\//)) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.userService.currentUserValue.AccessToken.access_token}`
        }
      });
    }


    return next.handle(request);
  }
}
