import { Component, OnInit } from '@angular/core';
import { IProject, IModel, ISharedRevisions, IRevision } from '../bimsync-project/bimsync-project.models';

@Component({
  selector: 'app-project-detail-modal',
  templateUrl: './project-detail-modal.component.html',
  styleUrls: ['./project-detail-modal.component.scss']
})
export class ProjectDetailModalComponent implements OnInit {

  selectedProject: IProject;
  detail: boolean;

  constructor() { }

  ngOnInit() {
  }

  OpenDetailModal(project) {
    this.selectedProject = project;
    this.detail = true;
  }
}
