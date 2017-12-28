// Imports
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { IAccessToken } from './access_token';
import { IUser} from './user';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import { Body } from '@angular/http/src/body';

@Component({
  selector: 'app-bimsync-oauth',
  template: 'bimsync-oauth.component.html'
})
export class BimsyncOauthComponent implements OnInit  {

    // Resolve HTTP using the constructor
    constructor(private _http: HttpClient, private activatedRoute: ActivatedRoute, private router: Router) { }

    // private instance variable to hold base url
    private _projectsUrl = 'http://localhost:5000/api/users';
    private _authorization_code = '';
    private _access_token: IAccessToken;
    private _user: IUser;
    private requestBody:string;
    errorMessage: string;

    ngOnInit() {

        // subscribe to router event and retrive the callback code
        this.activatedRoute.queryParams.subscribe((params: Params) => {
            this._authorization_code = params['code'];
            //console.log(this._authorization_code);
        });

        console.log('_authorization_code : '+ this._authorization_code);

    //   this.requestBody = 'grant_type=authorization_code&code='+ this._authorization_code
    //   +'&redirect_uri=http://localhost:4200/callback&client_id=&client_secret=';

        //Get the connected user
        this.getUser()
        .subscribe(user => {
            this._user = user;
        },
        error => this.errorMessage = <any>error);

        // this.getAccessToken()
        //     .subscribe(access_token => {
        //         this._access_token = access_token;
        //     },
        //     error => this.errorMessage = <any>error);
        
        console.log('User : '+ JSON.stringify(this._user));

        //Redirect to the home page
        this.router.navigate(['/home']);
    }

    getAccessToken(): Observable<IAccessToken> {
        return this._http.post<IAccessToken>(
            this._projectsUrl,this.requestBody,
            {
                //params: new HttpParams().set('id', '56784'),
                headers: new HttpHeaders()
                    .set('Content-Type', 'application/x-www-form-urlencoded')
            })
            .do(data => console.log('All: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    getUser(): Observable<IUser>{
        return this._http.post<IUser>(
            this._projectsUrl ,'',
            {
                params: new HttpParams().set('code', this._authorization_code),
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