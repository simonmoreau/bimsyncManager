// Imports
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import {ISharedRevisions, ISharingCode,
    IViewerRequestBody, IViewerURL
} from '../bimsync-project/bimsync-project.models';
import { AppService } from 'app/app.service';




@Injectable()
export class TakeoffService {

    // private instance variable to hold base url
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
            });
    }

    CreateSharedModel(sharedRevisions: ISharedRevisions): Observable<ISharingCode> {
        return this._http.post<ISharingCode>(
            this._apiUrl + 'manager/users/' + this._appService._user.PowerBISecret + '/share',
            JSON.stringify(sharedRevisions),
            {
                headers: new HttpHeaders()
                    .set('Content-Type', 'application/json')
            });
    }

    GetSharingCode(sharingCodeId: string): Observable<ISharingCode> {
        return this._http.get<ISharingCode>(
            this._apiUrl + 'manager/model/' + sharingCodeId,
            {
                headers: new HttpHeaders()
                    .set('Content-Type', 'application/x-www-form-urlencoded')
            });
    }
}
