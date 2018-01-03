import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from 'app/bimsync-oauth/bimsync-oauth.models';

@Component({
    selector: 'my-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    User: IUser;
    constructor(private router: Router) {
    }

    ngOnInit() {
        //Check if there is a user in local storage
        var currentUser = JSON.parse(localStorage.getItem('user'));
        if (currentUser != null)
        {
            this.User = currentUser;
        }
    }
}
