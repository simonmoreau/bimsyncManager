// Imports
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import {ISharedRevisions, ISharingCode,
    IViewerRequestBody, IViewerURL
} from '../bimsync-project/bimsync-project.models';
import { AppService } from 'app/app.service';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

@Injectable()
export class TakeoffService {

    // private instance variable to hold base url
    private _bimsyncUrlV2 = 'https://api.bimsync.com/v2/';
    private _apiUrl = 'https://binsyncfunction.azurewebsites.net/api/';

    private _appService: AppService;

    // Resolve HTTP using the constructor
    constructor(private _http: HttpClient, private appService: AppService) {
        this._appService = appService;
    }

    GetSharingURL(viewerRequestBody: IViewerRequestBody): Observable<IViewerURL> {
        return this._http.post<IViewerURL>(
            this._apiUrl + 'bimsync-viewer',
            JSON.stringify(viewerRequestBody),
            {
                headers: new HttpHeaders()
                    .set('Content-Type', 'application/json')
            })
            .do(data => console.log('All: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    CreateSharedModel(sharedRevisions: ISharedRevisions): Observable<ISharingCode> {
        return this._http.post<ISharingCode>(
            this._apiUrl + 'manager/users/' + this._appService._user.PowerBISecret + '/share',
            JSON.stringify(sharedRevisions),
            {
                headers: new HttpHeaders()
                    .set('Content-Type', 'application/json')
            })
            .do(data => console.log('All: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    GetSharingCode(sharingCodeId: string): Observable<ISharingCode> {
        return this._http.get<ISharingCode>(
            this._apiUrl + 'manager/model/' + sharingCodeId,
            {
                headers: new HttpHeaders()
                    .set('Content-Type', 'application/x-www-form-urlencoded')
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
