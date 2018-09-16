import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { TakeoffService } from '../takeoff/takeoff.services';
import { IProject, IModel, IRevisionId, IViewerRequestBody, ISharedRevisions, IRevision } from '../bimsync-project/bimsync-project.models';
import { ClrLoadingState } from '@clr/angular';
import { AppService } from 'app/app.service';

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
  frameSizes: IFrameSize[] = [];
  selectedframeSize: IFrameSize;
  sharingiFrameURL: string;
  aModelIsSelected: boolean = false;
  publishBtnState: ClrLoadingState = ClrLoadingState.DEFAULT;
  appService: AppService;

  constructor(private _takeoffService: TakeoffService, private _appService: AppService) {
    this.appService = _appService;
  }

  ngOnInit() {

    this.frameSizes = [
      { "xSize": "680", "ySize": "510" },
      { "xSize": "800", "ySize": "600" },
      { "xSize": "933", "ySize": "700" }
    ];
    this.selectedframeSize = this.frameSizes[0];
  }

  OpenShareModal(project) {
    this.selectedProject = project;
    this.GetAllRevisions();
    this.selectAll = false;
    this.share = true;
  }

  Publish() {
    this.publishBtnState = ClrLoadingState.LOADING;

    let selectedRevisions: string[] = [];
    let selected2dRevision: string;

    this.models.forEach(model => {
      if (model.is3DSelected) {
        selectedRevisions.push(model.selectedRevision.id);
        if (model.is2DSelected) {
          selected2dRevision = model.selectedRevision.id;
        }
      }
    });
    let sharedRevisions: ISharedRevisions = {
      projectId: this.selectedProject.id,
      revision2D: selected2dRevision,
      revisions3D: selectedRevisions
    };

    this.CreateSharedModel(sharedRevisions);

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

  GetAllRevisions() {
    this.models = new Array() as Array<IModel>;
    this._takeoffService.getModels(this.selectedProject.id)
      .subscribe(models => {
        this.models = models;

        this._takeoffService.getAllRevisions(this.selectedProject.id)
          .subscribe(revisions => {
            revisions.forEach(revision => {
              let index: number = this.models.indexOf(this.models.find(m => m.id === revision.model.id));

              let newRevisions: IRevision[] = new Array(revision);

              if (this.models[index].revisions != null) {
                newRevisions = this.models[index].revisions;
                newRevisions.push(revision);
              }

              let newModel: IModel = {
                id: this.models[index].id,
                name: this.models[index].name,
                revisions: newRevisions,
                selectedRevision: newRevisions[0],
                is3DSelected: false,
                is2DSelected: false
              };
              this.models[index] = newModel;

            });
          },
            error => this.errorMessage = <any>error);

      },
        error => this.errorMessage = <any>error);
    return false;
  }

  CreateSharedModel(sharedRevisions: ISharedRevisions) {

    this._takeoffService.CreateSharedModel(sharedRevisions)
      .subscribe(sharingCode => {
        this.sharingURL = this.appService._url + '/share?code=' + sharingCode.id;
        this.sharingiFrameURL = this.GetIFrameURL();
        this.publishBtnState = ClrLoadingState.SUCCESS;
      },
        error => this.errorMessage = <any>error);
  }

  GetIFrameURL(): string {
    return '<iframe width="'
      + this.selectedframeSize.xSize
      + '" height="' + this.selectedframeSize.ySize
      + '" src="' + this.sharingURL
      + '" frameborder="0" allowFullScreen="true"></iframe>';
  }

  ChangeFrameSize() {
    this.sharingiFrameURL = this.GetIFrameURL();
  }
}

export interface IFrameSize {
  xSize: string;
  ySize: string;
}
