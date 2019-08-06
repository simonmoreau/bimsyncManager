import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import * as $ from 'jquery';

import {
  MatToolbarModule,
  MatMenuModule,
  MatIconModule,
  MatButtonModule,
  MatListModule,
  MatProgressSpinnerModule,
  MatCardModule,
  MatTooltipModule,
  MatSelectModule,
  MatTreeModule,
  MatCheckboxModule,
  MatChipsModule,
  MatButtonToggleModule,
  MatTableModule,
  MatPaginatorModule
} from '@angular/material';
import {MatDialogModule} from '@angular/material/dialog';
import {DragDropModule} from '@angular/cdk/drag-drop';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { HomeComponent } from './home/home/home.component';
import { UserComponent } from './user/user/user.component';
import { ProjectsComponent } from './projects-list/projects/projects.component';
import { Page404Component } from './shared/components/page404/page404.component';
import { InterceptorService } from './shared/services/interceptor.service';
import { ProjectComponent } from './projects-list/project/project.component';
import { TakeoffComponent } from './takeoff/takeoff/takeoff.component';
import { BimsyncViewerComponent } from './bimsync/bimsync-viewer/bimsync-viewer.component';
import { PanelComponent } from './takeoff/panel/panel.component';
import { RevisionSelectionComponent } from './takeoff/revision-selection/revision-selection.component';
import { ProjectHeaderComponent } from './shared/components/project-header/project-header.component';
import { ShareProjectDialogComponent } from './share-project/share-project-dialog/share-project-dialog.component';
import { ViewerHostComponent } from './bimsync/viewer-host/viewer-host.component';
import { PropertyTreeComponent } from './takeoff/property-tree/property-tree.component';
import { DropZoneComponent } from './takeoff/drop-zone/drop-zone.component';
import { PropertyPanelComponent } from './bimsync/property-panel/property-panel.component';
import { ViewerMenuComponent } from './bimsync/viewer-menu/viewer-menu.component';
import { QuantitiesComponent } from './takeoff/quantities/quantities.component';

declare var window: any;
window.$ = window.jQuery = $;

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    UserComponent,
    ProjectsComponent,
    Page404Component,
    ProjectComponent,
    TakeoffComponent,
    BimsyncViewerComponent,
    PanelComponent,
    RevisionSelectionComponent,
    ProjectHeaderComponent,
    ShareProjectDialogComponent,
    ViewerHostComponent,
    PropertyTreeComponent,
    DropZoneComponent,
    PropertyPanelComponent,
    ViewerMenuComponent,
    QuantitiesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatTooltipModule,
    MatSelectModule,
    MatDialogModule,
    MatTreeModule,
    MatCheckboxModule,
    DragDropModule,
    MatChipsModule,
    MatButtonToggleModule,
    MatTableModule,
    MatPaginatorModule,
    HttpClientModule
  ],
  entryComponents: [
    ShareProjectDialogComponent
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
