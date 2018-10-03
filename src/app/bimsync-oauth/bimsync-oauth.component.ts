// Imports
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppService } from 'app/app.service';

@Component({
    selector: 'app-bimsync-oauth',
    template: 'bimsync-oauth.component.html'
})
export class BimsyncOauthComponent implements OnInit {

    errorMessage: string;

    // Resolve HTTP using the constructor
    constructor(
        private activatedRoute: ActivatedRoute,
        private appService: AppService) { }

    ngOnInit() {

        let state = '';
        let authorization_code = '';
        // subscribe to router event and retrive the callback code
        this.activatedRoute.queryParams.subscribe((params: Params) => {
            authorization_code = params['code'];
            state = params['state'];
        });

        // Get the connected user
        if (state === 'api') {
            this.appService.CreateUser(authorization_code);
        }

        if (state === 'bcf') {
            this.appService.CreateBCFToken(authorization_code);
        }
    }
}
