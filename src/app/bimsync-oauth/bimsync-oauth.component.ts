// Imports
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { IAccessToken, IbimsyncUser, IUser } from './bimsync-oauth.models';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import { Body } from '@angular/http/src/body';
import { AppComponent} from 'app/app.component';
import { ucs2 } from 'punycode';

@Component({
    selector: 'app-bimsync-oauth',
    template: 'bimsync-oauth.component.html'
})
export class BimsyncOauthComponent implements OnInit {

    // private instance variable to hold base url
    private _projectsUrl = 'http://localhost:5000/api/users';
    private _authorization_code = '';
    private _access_token: IAccessToken;
    private _user: IUser;
    private requestBody: string;
    private _appComponent: AppComponent;
    errorMessage: string;

    // Resolve HTTP using the constructor
    constructor(
        private _http: HttpClient,
        private activatedRoute: ActivatedRoute,
        private router: Router,
    private appComponent: AppComponent) {
        this._appComponent = appComponent;
    }

    ngOnInit() {

        // subscribe to router event and retrive the callback code
        this.activatedRoute.queryParams.subscribe((params: Params) => {
            this._authorization_code = params['code'];
            //console.log(this._authorization_code);
        });

        //Get the connected user
        this.getUser()
            .subscribe(user => {
                this._user = user;
                this._appComponent.User = user;
                this.fetchBimsyncUser();
            },
            error => this.errorMessage = <any>error);

        //Redirect to the home page
        this.router.navigate(['/projects']);
    }

    getAccessToken(): Observable<IAccessToken> {
        return this._http.post<IAccessToken>(
            this._projectsUrl, this.requestBody,
            {
                //params: new HttpParams().set('id', '56784'),
                headers: new HttpHeaders()
                    .set('Content-Type', 'application/x-www-form-urlencoded')
            })
            .do(data => console.log('All: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    getUser(): Observable<IUser> {
        return this._http.post<IUser>(
            this._projectsUrl, '',
            {
                params: new HttpParams().set('code', this._authorization_code),
                headers: new HttpHeaders()
                    .set('Content-Type', 'application/x-www-form-urlencoded')
            })
            .do(data => console.log('All: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    fetchBimsyncUser() {
        //Get the connected user
        this.getBimsyncUser()
            .subscribe(bimsyncUser => {
                this._appComponent.User.bimsync_id = bimsyncUser.id;
                this._appComponent.User.name = bimsyncUser.name;
            },
            error => this.errorMessage = <any>error);
    }

    getBimsyncUser(): Observable<IbimsyncUser> {
        return this._http.get<IbimsyncUser>(
            'https://api.bimsync.com/v2/user',
            {
                headers: new HttpHeaders()
                    .set('Authorization', 'Bearer ' + this._appComponent.User.accessToken)
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