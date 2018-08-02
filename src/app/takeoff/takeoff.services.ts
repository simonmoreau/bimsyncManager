// Imports
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { IProject, IModel, IRevision } from '../bimsync-project/bimsync-project.models';
import { AppService } from 'app/app.service';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import { importExpr } from '@angular/compiler/src/output/output_ast';
import { Body } from '@angular/http/src/body';

@Injectable()
export class takeoffService {

    // private instance variable to hold base url
    private _apiUrl = 'https://api.bimsync.com/v2/';
    private _projectId = '';

    private _appService: AppService;

    // Resolve HTTP using the constructor
    constructor(private _http: HttpClient,private appService: AppService) { 
        this._appService = appService;
    }

    getProjects(): Observable<IProject[]> {
        return this._http.get<IProject[]>(
            this._apiUrl + 'projects',
            {
                headers: new HttpHeaders()
                    .set('Authorization', 'Bearer ' + this._appService.GetUser().accessToken)
                    .set('Content-Type', 'application/json')
            })
            .do(data => console.log('All: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    getModels(projectId: string): Observable<IModel[]> {
        return this._http.get<IModel[]>(
            this._apiUrl + 'projects/'+ projectId +'/models',
            {
                headers: new HttpHeaders()
                    .set('Authorization', 'Bearer ' + this._appService.GetUser().accessToken)
                    .set('Content-Type', 'application/json')
            })
            .do(data => console.log('All: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    getRevisions(projectId: string, modelId: string): Observable<IRevision[]> {
        return this._http.get<IRevision[]>(
            this._apiUrl + 'projects/'+ projectId +'/revisions?model='+modelId,
            {
                headers: new HttpHeaders()
                    .set('Authorization', 'Bearer ' + this._appService.GetUser().accessToken)
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