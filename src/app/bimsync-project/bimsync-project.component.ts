import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';


import {IProject } from './project';
import {bimsyncProjectService } from './bimsync-project.services';

@Component({
  selector: 'app-bimsync-project',
  templateUrl: './bimsync-project.component.html',
  styleUrls: ['./bimsync-project.component.scss'],
  providers: [bimsyncProjectService]
})
export class BimsyncProjectComponent implements OnInit {
  projectName: string = '';
  projectDescription: string = '';
  errorMessage: string;

  projects: IProject[] = [];
  createdProject: IProject;

  constructor(private _bimsyncProjectService : bimsyncProjectService) {}

  ngOnInit() {
    this.GetProjects();
  }
  
  GetProjects(){
    this._bimsyncProjectService.getProjects()
    .subscribe(projects => {
        this.projects = projects;
    },
        error => this.errorMessage = <any>error);

    return false;
  }

  onSubmit() {

    console.log('onSubmit');
    this.CreateProject();
  }

  CreateProject(){
    console.log('Create bimsync project');

    this._bimsyncProjectService.createNewProject(this.projectName,this.projectDescription)
    .subscribe(project => {
      this.createdProject = project;
  },
      error => this.errorMessage = <any>error);
  }
}





