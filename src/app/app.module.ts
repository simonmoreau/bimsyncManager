import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

import { ClarityModule } from '@clr/angular';
import { NgDragDropModule } from 'ng-drag-drop';

import { AppComponent } from './app.component';
import { ROUTING } from "./app.routing";
import { HomeComponent } from "./home/home.component";
import { BimsyncProjectComponent } from './bimsync-project/bimsync-project.component';
import { BimsyncOauthComponent } from './bimsync-oauth/bimsync-oauth.component';
import { DocumentationComponent } from './documentation/documentation.component';
import { TakeoffComponent } from './takeoff/takeoff.component';
import { ShareModalComponent } from './share-modal/share-modal.component';
import { SharingPageComponent } from './sharing-page/sharing-page.component';

import * as $ from 'jquery';
import { FieldSelectorComponent } from './takeoff/takeoff-components/field-selector/field-selector.component';
import { Viewer3dComponent } from './viewer3d/viewer3d.component';
import { PropertyPanelComponent } from './property-panel/property-panel.component';
import { ProjectDetailModalComponent } from './project-detail-modal/project-detail-modal.component';
import { ProjectCreateModalComponent } from './project-create-modal/project-create-modal.component';

window["$"] = $;
window["jQuery"] = $;

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        BimsyncProjectComponent,
        BimsyncOauthComponent,
        DocumentationComponent,
        TakeoffComponent,
        ShareModalComponent,
        SharingPageComponent,
        FieldSelectorComponent,
        Viewer3dComponent,
        PropertyPanelComponent,
        ProjectDetailModalComponent,
        ProjectCreateModalComponent
    ],
    imports: [
        BrowserAnimationsModule,
        BrowserModule,
        FormsModule,
        HttpClientModule,
        ClarityModule,
        ROUTING,
        NgDragDropModule.forRoot()
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {

}
