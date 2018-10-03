import { Component, OnInit } from '@angular/core';
import { TakeoffService } from './takeoff.services';
import { IProject, IModel, IRevision } from '../bimsync-project/bimsync-project.models';
import { ITypeSummary } from './takeoff.model';

@Component({
  selector: 'app-takeoff',
  templateUrl: './takeoff.component.html',
  styleUrls: ['./takeoff.component.scss'],
  providers: [TakeoffService]
})
export class TakeoffComponent implements OnInit {

  projects: IProject[] = [];
  selectedProject: IProject;
  models: IModel[] = [];
  revisions: IRevision[] = [];
  selectedModel: IModel;
  selectedRevision: IRevision;
  errorMessage: string;
  typesSummary: ITypeSummary[] = [];

  constructor(private _takeoffService: TakeoffService) { }

  ngOnInit() {
    this.GetProjects();
  }

  GetProjects() {
    this._takeoffService.getProjects()
      .subscribe(projects => {
        this.projects = projects;
      },
        error => this.errorMessage = <any>error);
    return false;
  }

  GetModels() {
    this._takeoffService.getModels(this.selectedProject.id)
      .subscribe(models => {
        this.models = models;
        if (this.models != null && this.models.length !== 0) {
          this.selectedModel = this.models[0];
          this.GetRevisions();
        } else {
          this.selectedModel = null;
        }
      },
        error => this.errorMessage = <any>error);
    return false;
  }

  GetRevisions() {
    this._takeoffService.getRevisions(this.selectedProject.id, this.selectedModel.id)
      .subscribe(revisions => {
        this.revisions = revisions;
        if (this.revisions != null && this.revisions.length !== 0) {
          this.selectedRevision = this.revisions[0];
          this.GetProductTypeSummary();
        } else {
          this.selectedRevision = null;
        }
      },
        error => this.errorMessage = <any>error);
    return false;
  }

  GetProductTypeSummary() {
    this._takeoffService.getProductsTypeSummary(this.selectedProject.id, this.selectedRevision.id)
      .subscribe(summaryData => {
        this.typesSummary.length = 0;
        Object.keys(summaryData).forEach(
          key => {

            let summary: ITypeSummary = {
              typeName: key,
              typeQuantity: summaryData[key]
            };

            this.typesSummary.push(summary);
          }
        );
      },
        error => this.errorMessage = <any>error);
    return false;
  }

  trackByFn(index, model) {
    return model.id;
  }
}
