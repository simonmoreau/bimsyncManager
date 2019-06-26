import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { mergeMap, tap, catchError } from 'rxjs/operators';

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
      return this.http.get<IProject[]>(
        this.apiUrl + 'projects?pageSize=1000',
        {
            headers: new HttpHeaders().set('Content-Type', 'application/json')
        });
  }
}
