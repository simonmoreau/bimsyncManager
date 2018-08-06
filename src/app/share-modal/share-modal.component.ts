import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { TakeoffService } from '../takeoff/takeoff.services';
import { IProject, IModel, IRevisionId, IViewerRequestBody } from '../bimsync-project/bimsync-project.models';
import { ClrLoadingState } from '@clr/angular';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import { TrustedHtmlString } from '../../../node_modules/@angular/core/src/sanitization/bypass';

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
  revisionNumber2d: string = "";
  modelId2d: string = "";
  sharingURL: string;
  aModelIsSelected: boolean = false;
  publishBtnState: ClrLoadingState = ClrLoadingState.DEFAULT;

  constructor(private _takeoffService: TakeoffService) { }

  ngOnInit() { }

  OpenShareModal(project) {
    this.selectedProject = project;
    this.GetModels();
    this.selectAll = false;
    this.share = true;
  }

  Publish() {
    this.publishBtnState = ClrLoadingState.LOADING;

    let revisionsIds: IRevisionId[] = [];

    this.models.forEach(item => {
      if (item.is3DSelected) {
        let revisionId: IRevisionId = {
          model_id: item.id,
          revision_id: item.selectedRevision.version
        };
        revisionsIds.push(revisionId)
        if (item.is2DSelected) {
          this.modelId2d = item.id;
          this.revisionNumber2d = item.selectedRevision.version;
        }
      }
    });

    this.GetViewerURL(revisionsIds);
  }

  /* To copy Text from Textbox */
  copyInputMessage(inputElement) {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
  }

  SelectAllModels() {
    this.models.forEach(model => {
      model.is3DSelected = this.selectAll;
      if (!this.selectAll) {
        model.is2DSelected = false;
      }
    });
  }

  Select3D(model: IModel) {
    if (!model.is3DSelected) {
      model.is2DSelected = false;
    }
  }

  Select2D(model: IModel) {
    if (model.is2DSelected) {
      model.is3DSelected = true;

      this.models.forEach(item => {
        if (item.id !== model.id) {
          item.is2DSelected = false;
        }
      });
    }
  }

  GetModels() {
    this._takeoffService.getModels(this.selectedProject.id)
      .subscribe(models => {
        models.forEach(model => {
          this.GetRevisions(model);
        });
        this.models = models;
      },
        error => this.errorMessage = <any>error);
    return false;
  }

  GetRevisions(model: IModel) {
    this._takeoffService.getRevisions(this.selectedProject.id, model.id)
      .subscribe(revisions => {
        model.revisions = revisions;
        model.selectedRevision = model.revisions[0];
        model.is3DSelected = false;
      },
        error => this.errorMessage = <any>error);
    return false;
  }

  GetViewerURL(revisionsIds: IRevisionId[]) {
    this._takeoffService.GetViewerToken(this.selectedProject.id, revisionsIds)
      .subscribe(viewerToken => {
        if (this.revisionNumber2d !== '') {
          this._takeoffService.GetViewer2DToken(this.modelId2d, this.revisionNumber2d)
            .subscribe(viewer2Dtoken => {

              let viewerRequestBody: IViewerRequestBody = {
                viewer2DToken: viewer2Dtoken.token,
                viewerToken: viewerToken.token
              };
              this._takeoffService.GetSharingURL(viewerRequestBody)
                .subscribe(viewerURL => {
                  this.sharingURL = viewerURL.url;
                  this.publishBtnState = ClrLoadingState.SUCCESS;
                },
                  error => this.errorMessage = <any>error);
            },
              error => this.errorMessage = <any>error);

        } else {
          let viewerRequestBody: IViewerRequestBody = {
            viewer2DToken: '',
            viewerToken: viewerToken.token
          };

          this._takeoffService.GetSharingURL(viewerRequestBody)
            .subscribe(viewerURL => {
              this.sharingURL = viewerURL.url;
              this.publishBtnState = ClrLoadingState.SUCCESS;
            },
              error => this.errorMessage = <any>error);
        }
      },
        error => this.errorMessage = <any>error);
    return false;
  }
}
