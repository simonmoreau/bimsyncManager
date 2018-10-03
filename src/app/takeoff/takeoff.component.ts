import { Component, OnInit } from '@angular/core';
import {TakeoffService} from './takeoff.services';
import { IProject, IModel } from '../bimsync-project/bimsync-project.models';

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
  selectedModel: IModel;
  errorMessage: string;

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
        } else {
          this.selectedModel = null;
        }
      },
      error => this.errorMessage = <any>error);
    return false;
  }

  trackByFn(index, model) {
    return model.id;
  }
}
