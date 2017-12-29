// Imports
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { IProject } from './project';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import { AppService } from 'app/app.service';

@Injectable()
export class bimsyncProjectService {

    // private instance variable to hold base url
    private _projectsUrl = 'https://api.bimsync.com/v2/projects';
    private _appService: AppService;

    // Resolve HTTP using the constructor
    constructor(private _http: HttpClient,private appService: AppService) { 
        this._appService = appService;
    }

    getProjects(): Observable<IProject[]> {
        return this._http.get<IProject[]>(
            this._projectsUrl,
            {
                headers: new HttpHeaders()
                    .set('Authorization', 'Bearer ' + this._appService.GetCurrentUser().accessToken)
                    .set('Content-Type', 'application/json')
            })
            .do(data => console.log('All: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    createNewProject(Name: string, Description: string): Observable<IProject> {
        return this._http.post<IProject[]>(
            this._projectsUrl,
            {
                name: Name,
                description: Description
            },
            {
                //params: new HttpParams().set('id', '56784'),
                headers: new HttpHeaders()
                    .set('Authorization', 'Bearer ' + this._appService.GetCurrentUser().accessToken)
                    .set('Content-Type', 'application/json')
            })
            .do(data => console.log('All: ' + JSON.stringify(data)))
            .catch(this.handleError);
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
        return Observable.throw(errorMessage);
    }
}