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

    appService: AppService;

    constructor(private router: Router, private _appService: AppService) {
        this.appService = _appService;
    }

    ngOnInit() {
        this.appService.GetUser();
    }

    LogOut() {
        localStorage.removeItem('user');
        this.appService._user = null;
        this.router.navigate(['/home']);
    }

    DisplayHeader(): boolean {
        if (this.router.url.includes('/share')) {
                  return false;
          }
        return true;
      }
}
