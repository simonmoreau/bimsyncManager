import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { TakeoffService } from '../takeoff/takeoff.services';
import { IProject, IModel, IRevisionId } from '../bimsync-project/bimsync-project.models';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

@Component({
  selector: 'app-share-modal',
  templateUrl: './share-modal.component.html',
  styleUrls: ['./share-modal.component.scss'],
  providers: [TakeoffService]
})

export class ShareModalComponent implements OnInit {

  @ViewChild('content') content: any;

  selectedProject: IProject;
  share: boolean;
  projects: IProject[] = [];
  models: IModel[] = [];
  errorMessage: string;
  selectAll: boolean = false;

  constructor(private _takeoffService: TakeoffService) { }

  ngOnInit() { }

  OpenShareModal(project) {
    this.selectedProject = project;
    this.GetModels();
    this.selectAll = false;
    this.share = true;
  }

  Publish() {
    let revisionsIds: IRevisionId[] = [];

    this.models.forEach(item => {
      if (item.isSelected) {
        let revisionId: IRevisionId = {
          model_id: item.id,
          revision_id: item.selectedRevision.version
        };
        revisionsIds.push(revisionId)
      }
    });

    this.GetViewerToken(revisionsIds);
  }

  SelectAllModels() {
    this.models.forEach(model => {
      model.isSelected = this.selectAll;
    });
  }

  GetModels() {
    this._takeoffService.getModels(this.selectedProject.id)
      .subscribe(models => {
        this.models = models;
        models.forEach(model => {
          this.GetRevisions(model);

        });
      },
        error => this.errorMessage = <any>error);
    return false;
  }

  GetRevisions(model: IModel) {
    this._takeoffService.getRevisions(this.selectedProject.id, model.id)
      .subscribe(revisions => {
        model.revisions = revisions;
        model.selectedRevision = model.revisions[0];
        model.isSelected = false;
      },
        error => this.errorMessage = <any>error);
    return false;
  }

  GetViewerToken(revisionsIds: IRevisionId[]) {

    this._takeoffService.GetViewerToken(this.selectedProject.id, revisionsIds)
      .subscribe(viewerToken => {
        console.log(JSON.stringify(viewerToken));
      },
        error => this.errorMessage = <any>error);
    return false;
  }
}
