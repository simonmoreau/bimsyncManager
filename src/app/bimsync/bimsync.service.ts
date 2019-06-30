import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpResponse } from '@angular/common/http';

import { Observable, empty, of, from, concat } from 'rxjs';
import { mergeMap, tap, catchError, map, expand, concatMap, toArray, first } from 'rxjs/operators';

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
    return this.gets<IProject>(this.apiUrl + 'projects?pageSize=100');
  }

  getProject(id: string): Observable<IProject> {
    return this.gets<IProject>(this.apiUrl + `projects/${id}`)[0];
  }

  private gets<T>(url: string): Observable<T[]> {
    return this.get(url).pipe(
      expand(({ next }) => next ? this.get(next) : empty()),
      concatMap(({ content }) => content as T[]),
      toArray(),
    );
  }

  private get<T>(url: string): Observable<{
    content: T[],
    next: string | null
  }> {
    return this.http.get<any>(
      url,
      {
        headers: new HttpHeaders().set('Content-Type', 'application/json'),
        observe: 'response'
      }).pipe(
        map(response => ({
          content: response.body,
          next: this.next(response)
        }))
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
