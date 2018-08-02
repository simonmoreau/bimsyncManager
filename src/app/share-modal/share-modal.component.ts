import { Component, OnInit, ViewChild, Input } from '@angular/core';
import {takeoffService} from '../takeoff/takeoff.services';
import { IProject, IModel } from '../bimsync-project/bimsync-project.models';

@Component({
  selector: 'app-share-modal',
  templateUrl: './share-modal.component.html',
  styleUrls: ['./share-modal.component.scss'],
  providers: [takeoffService]
})

export class ShareModalComponent implements OnInit {

  @ViewChild('content') content: any;
  
  selectedProject:IProject;
  share: boolean;
  projects: IProject[] = [];
  models: IModel[] = [];
  errorMessage: string;

  constructor(private _takeoffService: takeoffService) { }

  ngOnInit() {
    
  }

  open(project) {
    this.selectedProject = project;
    this.GetModels();
    this.share = true;
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
    this._takeoffService.getRevisions(this.selectedProject.id,model.id)
      .subscribe(revisions => {
        model.revisions = revisions;
      },
      error => this.errorMessage = <any>error);
    return false;
  }
}
