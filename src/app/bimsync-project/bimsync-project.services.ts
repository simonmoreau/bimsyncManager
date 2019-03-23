// Imports
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { IProject, IRevision, IMember, IBimsyncBoard, IViewerToken, IProduct, IModel } from '../bimsync-project/bimsync-project.models';
import { AppService } from 'app/app.service';

import { Observable } from 'rxjs/Observable';
import { from } from 'rxjs/observable/from';
import { mergeMap } from 'rxjs/operators';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

@Injectable()
export class BimsyncProjectService {

    // private instance variable to hold base url
    private _apiUrl = 'https://api.bimsync.com/v2/';
    private _bcfUrl = 'https://bcf.bimsync.com/bcf/beta/projects';

    private _appService: AppService;

    // Resolve HTTP using the constructor
    constructor(private _http: HttpClient, private appService: AppService) {
        this._appService = appService;
    }

    getProjects(): Observable<IProject[]> {
        return this._http.get<IProject[]>(
            this._apiUrl + 'projects?pageSize=1000',
            {
                headers: new HttpHeaders()
                    .set('Authorization', 'Bearer ' + this._appService.GetToken())
                    .set('Content-Type', 'application/json')
            })
            .do(data => console.log('All: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    getProject(projectId: string): Observable<IProject> {
        return this._http.get<IProject>(
            this._apiUrl + 'projects/' + projectId,
            {
                headers: new HttpHeaders()
                    .set('Authorization', 'Bearer ' + this._appService.GetToken())
                    .set('Content-Type', 'application/json')
            })
            .do(data => console.log('All: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }



    getModels(projectId: string): Observable<IModel[]> {
        return this._http.get<IModel[]>(
            this._apiUrl + 'projects/' + projectId + '/models?pageSize=1000',
            {
                headers: new HttpHeaders()
                    .set('Authorization', 'Bearer ' + this._appService.GetToken())
                    .set('Content-Type', 'application/json')
            })
            .do(data => console.log('All: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    getRevisions(projectId: string, modelId: string): Observable<IRevision[]> {
        return this._http.get<IRevision[]>(
            this._apiUrl + 'projects/' + projectId + '/revisions?pageSize=1000&model=' + modelId,
            {
                headers: new HttpHeaders()
                    .set('Authorization', 'Bearer ' + this._appService.GetToken())
                    .set('Content-Type', 'application/json')
            })
            .do(data => console.log('All: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    getProductsTypeSummary(projectId: string, revisionId: string): Observable<object> {
        return this._http.get<object>(
            this._apiUrl + 'projects/' + projectId + '/ifc/products/ifctypes?revision=' + revisionId,
            {
                headers: new HttpHeaders()
                    .set('Authorization', 'Bearer ' + this._appService.GetToken())
                    .set('Content-Type', 'application/json')
            })
            .do(data => console.log('All: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    getViewer3dToken(projectId: string, revisionId: string): Observable<IViewerToken> {
        let revisions: any = {revisions: [revisionId]};
        let body: string = JSON.stringify(revisions);

        return this._http.post<IViewerToken>(
            this._apiUrl + 'projects/' + projectId + '/viewer3d/token',
            body,
            {
                headers: new HttpHeaders()
                    .set('Authorization', 'Bearer ' + this._appService.GetToken())
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
                this._apiUrl + 'projects/'
                + projectId + '/ifc/products?pageSize=1000&page='
                + pageNumber + '&revision=' + revisionId + '&ifcType=' + ifcClass,
                {
                    headers: new HttpHeaders()
                        .set('Authorization', 'Bearer ' + this._appService.GetToken())
                        .set('Content-Type', 'application/json')
                }))
        )
            .catch(this.handleError);
    }

    getProduct(projectId: string, productId: number): Observable<IProduct> {

            return this._http.get<IProduct>(
                this._apiUrl + 'projects/' + projectId + '/ifc/products/' + productId,
                {
                    headers: new HttpHeaders()
                        .set('Authorization', 'Bearer ' + this._appService.GetToken())
                        .set('Content-Type', 'application/json')
                })
                .do(data => console.log('All: ' + JSON.stringify(data)))
                .catch(this.handleError);
    }

    getAllRevisions(projectId: string): Observable<IRevision[]> {
        return this._http.get<IRevision[]>(
            this._apiUrl + 'projects/' + projectId + '/revisions?pageSize=1000',
            {
                headers: new HttpHeaders()
                    .set('Authorization', 'Bearer ' + this._appService.GetToken())
                    .set('Content-Type', 'application/json')
            })
            .do(data => console.log('All: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    createNewProject(Name: string, Description: string): Observable<IProject> {
        return this._http.post<IProject>(
            this._apiUrl + 'projects',
            {
                name: Name,
                description: Description
            },
            {
                // params: new HttpParams().set('id', '56784'),
                headers: new HttpHeaders()
                    .set('Authorization', 'Bearer ' + this._appService.GetToken())
                    .set('Content-Type', 'application/json')
            })
            .do(data => console.log('All: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    AddUser(ProjectId: string, UserId: string, Role: string): Observable<IMember> {
        return this._http.post<IMember>(
            this._apiUrl + 'projects/' + ProjectId + '/members',
            {
                user: UserId,
                role: Role
            },
            {
                // params: new HttpParams().set('id', '56784'),
                headers: new HttpHeaders()
                    .set('Authorization', 'Bearer ' + this._appService.GetToken())
                    .set('Content-Type', 'application/json')
            })
            .do(data => console.log('All: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    AddModel(ProjectId: string, ModelName: string): Observable<any> {
        return this._http.post<any>(
            this._apiUrl + 'projects/' + ProjectId + '/models',
            {
                name: ModelName
            },
            {
                headers: new HttpHeaders()
                    .set('Authorization', 'Bearer ' + this._appService.GetToken())
                    .set('Content-Type', 'application/json')
            })
            .do(data => console.log('All: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    AddBoard(ProjectId: string, BoardName: string): Observable<IBimsyncBoard> {
        return this._http.post<IBimsyncBoard>(
            this._bcfUrl,
            {
                name: BoardName,
                bimsync_project_id: ProjectId
            },
            {
                headers: new HttpHeaders()
                    .set('Authorization', 'Bearer ' + this._appService.GetUser().BCFToken)
                    .set('Content-Type', 'application/json')
            })
            .do(data => console.log('All: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    AddExtensionStatus(BoardId: string, extensionName: string, extensionColor: string, extensionType: string): Observable<any> {
        return this._http.post<any>(
            this._bcfUrl + '/' + BoardId + '/extensions/statuses',
            {
                name: extensionName,
                color: extensionColor,
                type: extensionType
            },
            {
                headers: new HttpHeaders()
                    .set('Authorization', 'Bearer ' + this._appService.GetUser().BCFToken)
                    .set('Content-Type', 'application/json')
            })
            .do(data => console.log('All: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    UpdateExtensionStatus(BoardId: string,
        existingExtensionName: string,
        extensionName: string,
        extensionColor: string,
        extensionType: string): Observable<any> {
        return this._http.put<any>(
            this._bcfUrl + '/' + BoardId + '/extensions/statuses',
            {
                existingName: existingExtensionName,
                name: extensionName,
                color: extensionColor,
                type: extensionType
            },
            {
                headers: new HttpHeaders()
                    .set('Authorization', 'Bearer ' + this._appService.GetUser().BCFToken)
                    .set('Content-Type', 'application/json')
            })
            .do(data => console.log('All: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    DeleteExtensionStatus(BoardId: string, existingExtensionName: string): Observable<any> {
        let deleteBody: any = {name: existingExtensionName};

        return this._http.request('delete',
            this._bcfUrl + '/' + BoardId + '/extensions/statuses',
            {
                body: deleteBody,
                headers: new HttpHeaders()
                    .set('Authorization', 'Bearer ' + this._appService.GetUser().BCFToken)
                    .set('Content-Type', 'application/json')
            })
            .do(data => console.log('All: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    AddExtensionType(BoardId: string, extensionName: string, extensionColor: string): Observable<any> {
        return this._http.post<any>(
            this._bcfUrl + '/' + BoardId + '/extensions/types',
            {
                name: extensionName,
                color: extensionColor
            },
            {
                headers: new HttpHeaders()
                    .set('Authorization', 'Bearer ' + this._appService.GetUser().BCFToken)
                    .set('Content-Type', 'application/json')
            })
            .do(data => console.log('All: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    UpdateExtensionType(BoardId: string, existingExtensionName: string, extensionName: string, extensionColor: string): Observable<any> {
        return this._http.put<any>(
            this._bcfUrl + '/' + BoardId + '/extensions/types',
            {
                existingName: existingExtensionName,
                name: extensionName,
                color: extensionColor
            },
            {
                headers: new HttpHeaders()
                    .set('Authorization', 'Bearer ' + this._appService.GetUser().BCFToken)
                    .set('Content-Type', 'application/json')
            })
            .do(data => console.log('All: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    DeleteExtensionType(BoardId: string, existingExtensionName: string): Observable<any> {
        let deleteBody: any = {name: existingExtensionName};

        return this._http.request('delete',
            this._bcfUrl + '/' + BoardId + '/extensions/types',
            {
                body: deleteBody,
                headers: new HttpHeaders()
                    .set('Authorization', 'Bearer ' + this._appService.GetUser().BCFToken)
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
