// Imports
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import {
    IProject, IModel, IRevision,
    ISharedRevisions, ISharingCode,
    IViewerRequestBody, IViewerURL, IViewerToken
} from '../bimsync-project/bimsync-project.models';
import { AppService } from 'app/app.service';
import { IProduct } from './takeoff.model';

import { Observable } from 'rxjs/Observable';
import { from } from 'rxjs/observable/from';
import { mergeMap } from 'rxjs/operators';
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

    getProjects(): Observable<IProject[]> {
        return this._http.get<IProject[]>(
            this._bimsyncUrlV2 + 'projects?pageSize=1000',
            {
                headers: new HttpHeaders()
                    .set('Authorization', 'Bearer ' + this._appService.GetUser().AccessToken.access_token)
                    .set('Content-Type', 'application/json')
            })
            .do(data => console.log('All: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    getProject(projectId: string): Observable<IProject> {
        return this._http.get<IProject>(
            this._bimsyncUrlV2 + 'projects/' + projectId,
            {
                headers: new HttpHeaders()
                    .set('Authorization', 'Bearer ' + this._appService.GetUser().AccessToken.access_token)
                    .set('Content-Type', 'application/json')
            })
            .do(data => console.log('All: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    getModels(projectId: string): Observable<IModel[]> {
        return this._http.get<IModel[]>(
            this._bimsyncUrlV2 + 'projects/' + projectId + '/models?pageSize=1000',
            {
                headers: new HttpHeaders()
                    .set('Authorization', 'Bearer ' + this._appService.GetUser().AccessToken.access_token)
                    .set('Content-Type', 'application/json')
            })
            .do(data => console.log('All: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    getRevisions(projectId: string, modelId: string): Observable<IRevision[]> {
        return this._http.get<IRevision[]>(
            this._bimsyncUrlV2 + 'projects/' + projectId + '/revisions?pageSize=1000&model=' + modelId,
            {
                headers: new HttpHeaders()
                    .set('Authorization', 'Bearer ' + this._appService.GetUser().AccessToken.access_token)
                    .set('Content-Type', 'application/json')
            })
            .do(data => console.log('All: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    getProductsTypeSummary(projectId: string, revisionId: string): Observable<object> {
        return this._http.get<object>(
            this._bimsyncUrlV2 + 'projects/' + projectId + '/ifc/products/ifctypes?revision=' + revisionId,
            {
                headers: new HttpHeaders()
                    .set('Authorization', 'Bearer ' + this._appService.GetUser().AccessToken.access_token)
                    .set('Content-Type', 'application/json')
            })
            .do(data => console.log('All: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    getViewer3dToken(projectId: string, revisionId: string): Observable<IViewerToken> {
        let revisions: any = {revisions: [revisionId]};
        let body: string = JSON.stringify(revisions);

        return this._http.post<IViewerToken>(
            this._bimsyncUrlV2 + 'projects/' + projectId + '/viewer3d/token',
            body,
            {
                headers: new HttpHeaders()
                    .set('Authorization', 'Bearer ' + this._appService.GetUser().AccessToken.access_token)
                    .set('Content-Type', 'application/json')
            })
            .do(data => console.log('All: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    getProducts(projectId: string, revisionId: string, ifcClass: string, productsNumber: number): Observable<IProduct[]> {
        let requestsNumber = Math.ceil(productsNumber / 1000);
        let requestsPages = Array.from(new Array(requestsNumber), (val, index) => index + 1);

        return from(requestsPages).pipe(
            mergeMap(pageNumber => <Observable<IProduct[]>>this._http.get<IProduct[]>(
                this._bimsyncUrlV2 + 'projects/'
                + projectId + '/ifc/products?pageSize=1000&page='
                + pageNumber + '&revision=' + revisionId + '&ifcType=' + ifcClass,
                {
                    headers: new HttpHeaders()
                        .set('Authorization', 'Bearer ' + this._appService.GetUser().AccessToken.access_token)
                        .set('Content-Type', 'application/json')
                }))
        )
            .catch(this.handleError);
    }

    getAllRevisions(projectId: string): Observable<IRevision[]> {
        return this._http.get<IRevision[]>(
            this._bimsyncUrlV2 + 'projects/' + projectId + '/revisions?pageSize=1000',
            {
                headers: new HttpHeaders()
                    .set('Authorization', 'Bearer ' + this._appService.GetUser().AccessToken.access_token)
                    .set('Content-Type', 'application/json')
            })
            .do(data => console.log('All: ' + JSON.stringify(data)))
            .catch(this.handleError);
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
