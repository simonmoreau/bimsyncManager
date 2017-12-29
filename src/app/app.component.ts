import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from 'app/bimsync-oauth/bimsync-oauth.models';

@Component({
    selector: 'my-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    User: IUser;
    constructor(private router: Router) {
    }
}
