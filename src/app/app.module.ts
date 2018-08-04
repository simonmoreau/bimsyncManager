import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

import { ClarityModule } from 'clarity-angular';

import { AppComponent } from './app.component';
import { ROUTING } from "./app.routing";
import { HomeComponent } from "./home/home.component";
import { BimsyncProjectComponent } from './bimsync-project/bimsync-project.component';
import { BimsyncOauthComponent } from './bimsync-oauth/bimsync-oauth.component';
import { DocumentationComponent } from './documentation/documentation.component';
import { TakeoffComponent } from './takeoff/takeoff.component';
import { ShareModalComponent } from './share-modal/share-modal.component';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        BimsyncProjectComponent,
        BimsyncOauthComponent,
        DocumentationComponent,
        TakeoffComponent,
        ShareModalComponent
    ],
    imports: [
        BrowserAnimationsModule,
        BrowserModule,
        FormsModule,
        HttpClientModule,
        ClarityModule,
        ROUTING
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
