import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from 'app/bimsync-oauth/bimsync-oauth.models';
import {AppService} from 'app/app.service';
import { appendFile } from 'fs';

@Component({
    selector: 'my-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    providers: [AppService]
})
export class AppComponent implements OnInit {

    constructor(private router: Router, private appService : AppService) {
    }

    ngOnInit() {
    }

    LogOut(){
        localStorage.removeItem('user');
        this.appService._user = null;
        this.router.navigate(['/home']);
    }

}
