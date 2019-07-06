import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

import { Observable, empty } from 'rxjs';
import { map, expand, concatMap, toArray } from 'rxjs/operators';

import { IProject, IUser, IViewerToken } from '../shared/models/bimsync.model';

@Injectable({
  providedIn: 'root'
})
export class BimsyncService {

  // private instance variable to hold base url
  private apiUrl = 'https://api.bimsync.com/v2/';


  constructor(
    private http: HttpClient) { }

  getProjects(): Observable<IProject[]> {
    return this.getsPaginated<IProject>(this.apiUrl + 'projects');
  }

  getProject(id: string): Observable<IProject> {
    return this.get<IProject>(this.apiUrl + `projects/${id}`);
  }

  getCurrentUser(): Observable<IUser> {
    return this.get<IUser>(this.apiUrl + 'user');
  }

  getViewer3DTokenForRevision(projectId: string, revisionId: string[]): Observable<IViewerToken> {
    const body = {revisions: revisionId};
    return this.post<IViewerToken>(this.apiUrl + `projects/${projectId}/viewer3d/token`, body);
  }

  private post<T>(url: string, body: object): Observable<T> {
    return this.http.post<T>(
      url, body,
      {
        headers: new HttpHeaders().set('Content-Type', 'application/json')
      }
    );
  }

  private get<T>(url: string): Observable<T> {
    return this.http.get<T>(
      url,
      {
        headers: new HttpHeaders().set('Content-Type', 'application/json')
      }
    );
  }

  private getsPaginated<T>(url: string): Observable<T[]> {
    return this.getPaginated(url).pipe(
      expand(({ next }) => next ? this.getPaginated(next) : empty()),
      concatMap(({ content }) => content as T[]),
      toArray(),
    );
  }

  private getPaginated<T>(url: string): Observable<{
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
