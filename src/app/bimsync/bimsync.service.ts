import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpResponse } from '@angular/common/http';

import { Observable, empty, of } from 'rxjs';
import { mergeMap, tap, catchError, map, expand, concatMap } from 'rxjs/operators';

import { IProject } from '../shared/models/bimsync.model';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class BimsyncService {

  // private instance variable to hold base url
  private apiUrl = 'https://api.bimsync.com/v2/';


  constructor(
    private http: HttpClient) { }

  getProjects(): Observable<IProject[]> {
    return this.get(this.apiUrl + 'projects?pageSize=100').pipe(
      map(response => response.body)
    );
  }

  private get(url: string): Observable<HttpResponse<any>> {
    return this.http.get<any>(
      url,
      {
        headers: new HttpHeaders().set('Content-Type', 'application/json'),
        observe: 'response'
      }).pipe(
        expand(response => {
          const next = this.next(response);
          if (next) {
            return this.get(next);
          } else {
            return empty();
          }
        }),
        concatMap(response => {
          return of(response);
        })
      );
  }


  private next(response: HttpResponse<any>): string | null {
    let url: string | null = null;
    const link = response.headers.get('link');
    if (link) {
      const match = link.match(/<([^>]+)>;\s*rel="next"/);
      if (match) {
        [, url] = match;
      }
    }
    return url;
  }
}
